#!/usr/bin/env python3
"""
Extrae la carta de El Capricho de Costa del Silencio desde Comandator
y la guarda en menu-data.json (en la raíz del repo).

Solo se sincronizan las categorías que en Comandator llevan el prefijo
"CARTA - " (su web repite parte de la carta sin ese prefijo; esas
versiones duplicadas se ignoran). El menú de navegación resultante usa
los nombres limpios indicados a continuación, en vez del nombre bruto
de Comandator.

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

# Nombre limpio a mostrar en el menú de navegación para cada categoría
# "CARTA - X" de Comandator. La clave es el nombre SIN el prefijo,
# normalizado en mayúsculas para que la comparación no dependa de cómo
# Comandator lo capitalice. El orden de este diccionario es el orden en
# que aparecerán las secciones en la carta.
DISPLAY_NAMES = {
    "PRODUCTOS EN MESA": "Productos en mesa",
    "PLATOS ELABORADOS CON CONSERVAS": "Platos elaborados con conservas",
    "CONSERVAS CAMBADOS": "Conservas Cambados",
    "CONSERVAS REAL CONSERVERA": "Conservas Real Conservera",
    "ANCHOAS": "Anchoas",
    "LONCHEADOS": "Loncheados",
    "TAQUITOS": "Taquitos",
    "BOCADILLOS IBÉRICOS": "Bocadillos ibéricos",
    "MONTADITOS": "Montaditos",
    "QUESOS": "Quesos",
    "SNACKS": "Snacks",
    "SMOOTHIES": "Smoothies",
    "CAFÉ": "Café",
    "VINO POR COPAS": "Vino por copas",
    "VINO BLANCO AFRUTADO": "Vino blanco afrutado",
    "VINO BLANCO SECO": "Vino blanco seco",
}

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

CARTA_PREFIX_RE = re.compile(r"^\s*carta\s*[-–—:]\s*", re.IGNORECASE)


def clean_price(raw: str) -> str:
    """'18.50 €' -> '18,50'. Normaliza a coma decimal, sin símbolo de euro."""
    num = re.sub(r"[^\d.,]", "", raw).replace(".", ",")
    return num


def scrape_raw() -> list[dict]:
    """Devuelve [{category, items: [{name, price}, ...]}, ...] tal cual viene de la web."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(MENU_URL, wait_until="networkidle", timeout=60000)
        page.wait_for_selector("h6.MuiTypography-h6", timeout=30000)
        page.wait_for_timeout(1500)
        raw = page.evaluate(EXTRACT_JS)
        browser.close()

    result = []
    for cat in raw:
        items = [
            {"name": it["name"], "price": clean_price(it["price"])}
            for it in cat["items"]
        ]
        result.append({"category": cat["category"], "items": items})
    return result


def build_sections(raw_categories: list[dict]) -> list[dict]:
    """Filtra solo las categorías 'CARTA - X' y las renombra según DISPLAY_NAMES,
    en el orden fijo de DISPLAY_NAMES (no en el orden en que llegan de la web)."""
    by_clean_name = {}
    for cat in raw_categories:
        raw_name = cat["category"]
        if not CARTA_PREFIX_RE.match(raw_name):
            continue
        clean = CARTA_PREFIX_RE.sub("", raw_name).strip().upper()
        by_clean_name[clean] = cat["items"]

    sections = []
    for clean_key, display_name in DISPLAY_NAMES.items():
        items = by_clean_name.get(clean_key)
        if items is None:
            print(f"AVISO: no se encontró la sección 'CARTA - {clean_key}' "
                  f"en Comandator (¿cambió de nombre?).", file=sys.stderr)
            continue
        sections.append({"category": display_name, "items": items})
    return sections


def main() -> int:
    raw_categories = scrape_raw()

    if not raw_categories:
        print("ERROR: no se extrajo ninguna categoría. Comandator puede haber "
              "cambiado su estructura (selectores CSS) o la página no cargó bien.",
              file=sys.stderr)
        return 1

    sections = build_sections(raw_categories)
    if not sections:
        print("ERROR: ninguna categoría 'CARTA - X' coincidió con DISPLAY_NAMES.",
              file=sys.stderr)
        return 1

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
