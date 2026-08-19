#!/usr/bin/env python3
"""
Extrae la carta de El Capricho de Costa del Silencio desde Comandator
y la guarda en menu-data.json (en la raíz del repo).

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


def scrape() -> list[dict]:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(MENU_URL, wait_until="networkidle", timeout=60000)
        # La carta se hidrata tras la carga inicial; damos un margen extra.
        page.wait_for_selector("h6.MuiTypography-h6", timeout=30000)
        page.wait_for_timeout(1500)
        raw = page.evaluate(EXTRACT_JS)
        browser.close()

    categories = []
    for cat in raw:
        items = [
            {"name": it["name"], "price": clean_price(it["price"])}
            for it in cat["items"]
        ]
        categories.append({"category": cat["category"], "items": items})
    return categories


def main() -> int:
    categories = scrape()

    if not categories:
        print("ERROR: no se extrajo ninguna categoría. Comandator puede haber "
              "cambiado su estructura (selectores CSS) o la página no cargó bien.",
              file=sys.stderr)
        return 1

    total_items = sum(len(c["items"]) for c in categories)
    print(f"Extraídas {len(categories)} categorías, {total_items} productos.")

    payload = {
        "source": MENU_URL,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "categories": categories,
    }

    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Guardado en {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
