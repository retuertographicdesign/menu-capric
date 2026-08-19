#!/usr/bin/env python3
"""
Extrae la carta de El Capricho de Costa del Silencio desde Comandator
y la guarda en menu-data.json (en la raíz del repo).

Solo se sincronizan 5 secciones (a petición): Entrantes, Principales,
Bebidas, Vermuts y Vinos. Cada una se compone agrupando una o varias
categorías reales de Comandator (su web repite parte de la carta con
y sin el prefijo "CARTA - "; usamos la versión numerada cuando existe).

La página es una app Next.js que renderiza la carta con JavaScript, así que
necesitamos un navegador real (Playwright), no una simple petición HTTP.

Uso:
    python scripts/scrape_menu.py
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

MENU_URL = (
    "https://www.comandator.com/es/establecimiento/"
    "capricho-de-costa-del-silencio-tenerife-arona/menu"
)

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "menu-data.json"

# Qué categorías reales de Comandator alimentan cada una de nuestras 5
# secciones finales, y en qué orden. Se combinan y deduplican por nombre.
SECTION_MAP = [
    ("Entrantes", ["CARTA - PRODUCTOS EN MESA"]),
    ("Principales", [
        "CARTA - PLATOS ELABORADOS CON CONSERVAS",
        "CARTA - BOCADILLOS IBÉRICOS",
    ]),
    ("Bebidas", ["REFRESCOS Y AGUA", "CERVEZAS Y SIDRAS"]),
    ("Vermuts", ["VERMU", "CAVAS", "CHAMPAN Y CAVAS"]),
    ("Vinos", [
        "CARTA - VINO POR COPAS",
        "CARTA - VINO BLANCO AFRUTADO",
        "CARTA - VINO BLANCO SECO",
        "VINO TINTO",
    ]),
]

# JS que corre DENTRO de la página ya renderizada para extraer categoría -> items.
# Mismos selectores verificados manualmente sobre la página real (Material UI).
EXTRACT_JS = """
() => {
  const headers = Array.from(document.querySelectorAll('h6.MuiTypography-h6'));
  const data = [];
  headers.forEach(h => {
    const catName = h.textContent.trim();
    const box = h.closest('.MuiBox-root');
    const grid = box ? box.querySelector('.MuiGrid-container') : null;
    if (!grid) return;
    const cards = grid.querySelectorAll('.MuiCard-root');
    const items = [];
    cards.forEach(card => {
      const name = card.querySelector('p.MuiTypography-body1')?.textContent?.trim();
      const priceEl = Array.from(card.querySelectorAll('p,span,div'))
        .find(e => /€/.test(e.textContent) && e.children.length === 0);
      const price = priceEl ? priceEl.textContent.trim() : null;
      if (name && price) items.push({ name, price });
    });
    if (items.length) data.push({ category: catName, items });
  });
  return data;
}
"""


def clean_price(raw: str) -> str:
    """'18.50 €' -> '18,50'. Normaliza a coma decimal, sin símbolo de euro."""
    num = re.sub(r"[^\d.,]", "", raw).replace(".", ",")
    return num


def scrape_raw() -> dict:
    """Devuelve {nombre_categoria_comandator: [ {name, price}, ... ]}."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(MENU_URL, wait_until="networkidle", timeout=60000)
        page.wait_for_selector("h6.MuiTypography-h6", timeout=30000)
        page.wait_for_timeout(1500)
        raw = page.evaluate(EXTRACT_JS)
        browser.close()

    by_category = {}
    for cat in raw:
        items = [
            {"name": it["name"], "price": clean_price(it["price"])}
            for it in cat["items"]
        ]
        by_category[cat["category"]] = items
    return by_category


def build_sections(by_category: dict) -> list[dict]:
    sections = []
    for section_name, source_categories in SECTION_MAP:
        seen = set()
        items = []
        for src in source_categories:
            for it in by_category.get(src, []):
                key = (it["name"], it["price"])
                if key in seen:
                    continue
                seen.add(key)
                items.append(it)
        if not items:
            print(f"AVISO: la sección '{section_name}' no encontró productos "
                  f"(categorías buscadas: {source_categories}).", file=sys.stderr)
        sections.append({"category": section_name, "items": items})
    return sections


def main() -> int:
    by_category = scrape_raw()

    if not by_category:
        print("ERROR: no se extrajo ninguna categoría. Comandator puede haber "
              "cambiado su estructura (selectores CSS) o la página no cargó bien.",
              file=sys.stderr)
        return 1

    sections = build_sections(by_category)
    total_items = sum(len(s["items"]) for s in sections)
    print(f"Generadas {len(sections)} secciones, {total_items} productos.")

    payload = {
        "source": MENU_URL,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "categories": sections,
    }

    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Guardado en {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
