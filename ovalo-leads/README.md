# Analizador de Leads — Plan Óvalo Ford Goldstein
## Guía de deploy en Vercel — paso a paso

---

## Qué necesitás antes de arrancar

- Cuenta en GitHub (si no tenés: github.com → Sign up, es gratis)
- Cuenta en Vercel (si no tenés: vercel.com → Sign up with GitHub, es gratis)
- Tu API key de Anthropic (la encontrás en console.anthropic.com → API Keys)

---

## PASO 1 — Subir el proyecto a GitHub

1. Entrá a **github.com** y hacé click en el botón verde **"New"** (arriba a la izquierda)
2. Nombre del repositorio: `ovalo-leads` (o el que quieras)
3. Dejalo en **Private**
4. Click en **"Create repository"**
5. En la página que aparece, hacé click en **"uploading an existing file"**
6. Subí los archivos con esta estructura exacta:
   ```
   ovalo-leads/
   ├── vercel.json
   ├── api/
   │   └── analyze.js
   └── public/
       └── index.html
   ```
7. Click en **"Commit changes"**

---

## PASO 2 — Conectar Vercel con GitHub

1. Entrá a **vercel.com** y hacé login con tu cuenta de GitHub
2. Click en **"Add New Project"**
3. En la lista de repositorios, buscá `ovalo-leads` y hacé click en **"Import"**
4. En la pantalla de configuración **NO toques nada** — dejá todo como está
5. **NO hagas click en Deploy todavía** — primero hay que agregar la API key (Paso 3)

---

## PASO 3 — Agregar tu API key de Anthropic

En la misma pantalla de configuración de Vercel, antes de deployar:

1. Expandí la sección **"Environment Variables"**
2. En el campo **Name** escribí exactamente: `ANTHROPIC_API_KEY`
3. En el campo **Value** pegá tu API key (empieza con `sk-ant-...`)
4. Click en **"Add"**
5. Ahora sí, click en **"Deploy"**

Vercel va a tardar unos 30-60 segundos en buildear.

---

## PASO 4 — Abrir la app

Cuando termine el deploy, Vercel te muestra una URL del estilo:
```
https://ovalo-leads-xxxx.vercel.app
```

Hacé click en esa URL. Ya está funcionando.

Guardá esa URL en favoritos del celular — desde ahí vas a usarla todos los días.

---

## Cómo usar la app

1. Abrí Tecnom, entrá al caso del lead
2. Seleccioná y copiá todo el historial de actividad
3. Pegalo en el campo **"Historial CRM"**
4. Si tenés el chat de WhatsApp, copialo y pegalo en el segundo campo
5. En **"Tu sensación"** escribí lo que el CRM no captura (opcional pero recomendado)
6. Click en **"Analizar lead"**
7. En 5-10 segundos tenés el análisis completo con el mensaje listo para copiar

---

## Si necesitás actualizar la grilla de precios

Cuando cambie la grilla (cada mes), abrí el archivo `api/analyze.js` en GitHub:
1. Entrá a tu repo en github.com
2. Click en `api` → `analyze.js`
3. Click en el ícono del lápiz (Edit)
4. Buscá la sección `GRILLA VIGENTE` y actualizá los valores
5. Click en **"Commit changes"**

Vercel detecta el cambio y redeploya automáticamente en menos de 1 minuto.

---

## Si algo no funciona

**La app carga pero el análisis da error:** revisá que la API key esté bien cargada en Vercel.
Ve a tu proyecto en vercel.com → Settings → Environment Variables → verificá que `ANTHROPIC_API_KEY` esté ahí.

**La URL no carga:** esperá 2 minutos y recargá. A veces el primer deploy tarda un poco más.

**Errores en el análisis:** copiame el mensaje de error exacto que aparece en rojo.
