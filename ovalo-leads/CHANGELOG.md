# Analizador de Leads — Plan Óvalo Ford Goldstein
## Registro de versiones

---

## VERSIÓN 1.0 — Analizador básico de leads
*Deployada en Vercel — Marzo 2026*

### Qué hacía

Recibía el historial de un lead copiado del CRM de Tecnom y lo procesaba con la API de Claude (Sonnet) para devolver un análisis estructurado en cuatro partes:

**1. Score de calificación**
Cinco criterios puntuados de 1 a 5: intención de compra, capacidad de pago, urgencia, nivel de engagement y fit con el producto. Total sobre 25 con clasificación: caliente (20-25), tibio (14-19), frío (8-13), muy frío (1-7).

**2. Diagnóstico**
Lectura del estado real del lead: etapa del funnel, objeción principal explícita o implícita, qué faltaba para avanzar.

**3. Mensaje sugerido**
Un mensaje listo para copiar en WhatsApp. Con reglas específicas: máximo 3-5 oraciones, tono humano, sin mencionar el silencio del cliente, sin urgencia fabricada, con al menos un detalle personal del historial, terminando con pregunta binaria concreta.

**4. Plan B**
Qué hacer si el cliente no responde en 5-7 días.

### Inputs aceptados
- Historial del CRM (Tecnom Nubux) — campo obligatorio
- Historial de WhatsApp — opcional
- Sensación del vendedor — opcional (contexto no registrado en CRM)

### Contexto embebido en el sistema
- Grilla de precios Óvalo vigente (Marzo 2026) con valores móviles, integración mínima y cuotas fijas por modelo
- Regla de cambio de modelo — todos los modelos Ford son accesibles por plan de ahorro
- Ejemplos reales de mensajes buenos y malos (casos Sool y Jose Luis)
- Instrucción de lectura cronológica del historial antes de sugerir

### Limitación principal identificada
La app asumía que el lead ya tenía la necesidad activada y orientaba todo hacia cerrar una visita. Generaba mensajes de tipo "¿venís hoy o mañana?" antes de que el lead entendiera por qué debería venir. Faltaba una capa de indagación consultiva previa que construyera el interés real antes de proponer la reunión.

---

## VERSIÓN 2.0 — Asistente consultivo orientado a conversión
*En desarrollo — Marzo 2026*

### El cambio de filosofía

La v1 era reactiva y orientada al cierre de visita. La v2 es consultiva y orientada a construir la necesidad primero.

La premisa central cambia: **la visita es la consecuencia, no el objetivo**. El objetivo es que el lead llegue a entender que tiene un problema o necesidad real, y que el plan de ahorro es la solución más lógica para ese problema. Cuando eso está claro, la visita se propone sola.

### El framework incorporado: SPIN adaptado al proceso Ford

La app ahora evalúa en qué etapa del proceso de indagación está el lead antes de sugerir cualquier acción:

**S — Situación:** ¿se sabe qué auto tiene, para qué lo usa, cuándo quiere moverse?

**P — Problema:** ¿se sabe qué le molesta de su situación actual, por qué está mirando opciones?

**I — Implicación:** ¿el cliente dimensionó el costo de no actuar? ¿Entendió qué pierde si espera?

**N — Need-Payoff:** ¿el cliente verbalizó el beneficio de la solución con sus propias palabras?

La visita se propone cuando se tiene N. Antes de eso, el siguiente paso siempre es completar la letra que falta.

### Alineación con el proceso de 4 pasos del equipo Ford Goldstein

| Proceso Ford | SPIN |
|---|---|
| Paso 1 — Detección de necesidades | S + P |
| Paso 2 — Test drive + Guía 360 | Potencia I + N (experiencia emocional) |
| Paso 3 — Presupuesto / Cierre | Solo válido después de N |
| Paso 4 — Contacto posterior 48hs | Seguimiento sobre necesidad ya activada |

El código (1.2.3.4) en el nombre del contacto en Tecnom se usa como referencia secundaria de en qué paso está el lead, pero el historial tiene prioridad sobre ese dato por ser más confiable.

### Nueva lógica de output

**Sección 1 — Título + Score** (igual que v1)

**Sección 2 — Diagnóstico SPIN**
Igual que v1 pero agrega: qué letras del SPIN están cubiertas con información real del historial y cuáles faltan. Esto define el siguiente paso.

**Sección 3 — Canal recomendado + Acción**
La app decide entre llamada telefónica o WhatsApp basándose en el historial (qué canal usó antes, qué respondió, perfil del cliente, complejidad de la etapa).

**Si recomienda LLAMADA:**
- Objetivo concreto de la llamada (qué letra del SPIN falta completar)
- Encuadre de apertura — cómo arrancar los primeros 30 segundos sin sonar a venta, con legitimidad y contexto para que el cliente entienda por qué se le pregunta
- Checklist de indagación — 4 a 6 puntos en orden SPIN, cada uno con la pregunta sugerida en tono consultivo y el dato específico que busca obtener
- Mensaje de WhatsApp de respaldo — listo para copiar, por si no atiende

**Si recomienda WHATSAPP:**
- Objetivo del mensaje
- Mensaje listo para copiar — con encuadre adecuado según la etapa, sin sonar a interrogatorio
- Guía de respuestas probables — qué hacer según lo que conteste el cliente

**Sección 4 — Plan B**
Qué hacer si no hay respuesta en 5-7 días.

### Principios de tono incorporados

- El encuadre previo a la indagación desactiva la guardia del cliente explicando el propósito de las preguntas antes de hacerlas
- Las preguntas no suenan a interrogatorio sino a conversación: "contame cómo viene el tema del auto" en lugar de "¿para qué usás el auto?"
- Antes de pedir información, se da algo — un dato, una observación, algo que demuestre que el contacto tiene sentido
- El canal se elige según el historial del lead, no por defecto

### Lo que no cambia respecto a v1
- Inputs (CRM + WhatsApp + sensación del vendedor)
- Grilla de precios embebida
- Regla de cambio de modelo
- Ejemplos de mensajes buenos y malos
- Lectura cronológica obligatoria del historial antes de sugerir
- Score de calificación con los 5 criterios

---

## Stack técnico
- Frontend: HTML/CSS/JS estático
- Backend: Serverless function en Vercel (Node.js)
- Modelo: Claude Sonnet (claude-sonnet-4-20250514) vía API de Anthropic
- Deploy: Vercel (repo GitHub privado)
- Variables de entorno: ANTHROPIC_API_KEY en Vercel Settings
