# Carta de El Capricho — sincronizada automáticamente con Comandator

Esta carpeta es un mini-sitio estático: una página (`index.html`) que muestra la
carta con vuestro diseño (colores, tipografías, logo), leyendo los datos desde
`menu-data.json`. Un robot (GitHub Actions) visita vuestra página en Comandator
cada día, extrae los platos y precios actuales, y actualiza ese JSON solo.

## Qué contiene

```
index.html                       la página de la carta (no hay que tocarla)
menu-data.json                   los datos actuales (se genera/actualiza solo)
assets/                          logos (portada, marca de agua, contacto)
scripts/scrape_menu.py           el script que lee Comandator
.github/workflows/update-menu.yml   la tarea programada que lo ejecuta cada día
```

## Puesta en marcha (una sola vez)

1. **Crea un repositorio nuevo** en GitHub (puede ser público o privado) y sube
   el contenido de esta carpeta tal cual.

2. **Activa GitHub Pages**: en el repo, ve a `Settings → Pages`, y en "Source"
   elige la rama `main` (o `master`) y carpeta `/ (root)`. Guarda. A los pocos
   minutos tu carta estará en una URL del tipo
   `https://tu-usuario.github.io/tu-repo/`.

3. **No hace falta ninguna clave ni configuración extra.** El workflow usa el
   token automático que GitHub da a cada Action (`GITHUB_TOKEN`) para poder
   hacer commit de los cambios — no hay que crear secretos ni tocar nada.

4. **Pruébalo a mano una vez**: en el repo, ve a la pestaña `Actions` →
   "Actualizar carta desde Comandator" → botón `Run workflow`. Tarda 1-2
   minutos. Si todo va bien, verás un commit nuevo actualizando
   `menu-data.json` (o "Sin cambios en la carta" si no había novedades).

A partir de ahí, se ejecuta solo **todos los días a las 06:00 UTC** (puedes
cambiar la hora editando la línea `cron` del workflow). Cada vez que Comandator
tenga un plato nuevo, un precio distinto, o una categoría añadida, aparecerá
en tu página al día siguiente sin que tengas que hacer nada.

## Si Comandator cambia el diseño de su web

El scraper busca elementos con clases concretas (`h6.MuiTypography-h6`,
`.MuiCard-root`, etc.) porque así está construida su página hoy. Si en el
futuro Comandator rediseña su web, el workflow empezará a fallar (verás una
❌ roja en la pestaña Actions) en vez de publicar datos vacíos o erróneos —
avísame en ese momento y ajustamos los selectores.

## Actualizar el diseño de la carta

El aspecto visual vive entero en `index.html` (y los logos en `assets/`).
Puedes pedírmelo en cualquier momento — los datos (`menu-data.json`) y el
diseño están separados a propósito para que una cosa no dependa de la otra.
