<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ovalo Leads — Ford Goldstein</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0efeb; color: #1a1a1a; min-height: 100vh; }
.nav { background: #003087; display: flex; align-items: center; padding: 0 24px; height: 52px; position: sticky; top: 0; z-index: 100; }
.nav-logo { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 15px; font-weight: 600; margin-right: 32px; }
.nav-tab { color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 500; padding: 0 16px; height: 52px; display: flex; align-items: center; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; }
.nav-tab:hover { color: #fff; }
.nav-tab.active { color: #fff; border-bottom-color: #fff; }
.page { display: none; padding: 24px 16px 48px; max-width: 700px; margin: 0 auto; }
.page.active { display: block; }
.card { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 12px; border: 1px solid #e4e2dc; }
.card-title { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
label { font-size: 11px; font-weight: 600; color: #666; display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
label span { font-weight: 400; color: #aaa; text-transform: none; letter-spacing: 0; }
textarea { width: 100%; border: 1px solid #e0ddd6; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #1a1a1a; background: #fafaf8; resize: vertical; outline: none; transition: border-color 0.15s; line-height: 1.5; }
textarea:focus { border-color: #003087; background: #fff; }
#crm { min-height: 120px; font-family: 'SF Mono', monospace; }
#wa { min-height: 80px; font-family: 'SF Mono', monospace; }
#sensacion { min-height: 52px; }
.field { margin-bottom: 14px; }
.field:last-child { margin-bottom: 0; }
.btn-primary { width: 100%; padding: 13px; background: #003087; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.15s; margin-bottom: 12px; }
.btn-primary:hover { background: #00256b; }
.btn-primary:disabled { background: #b0b8c8; cursor: not-allowed; }
.btn-secondary { width: 100%; padding: 11px; background: transparent; color: #555; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; }
.btn-secondary:hover { background: #f0efeb; }
.btn-copy { font-size: 12px; font-weight: 500; color: #003087; background: #e8eef7; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; }
.btn-copy:hover { background: #d0ddef; }
#loading { display: none; text-align: center; padding: 32px 0; color: #888; font-size: 14px; }
.spinner { width: 26px; height: 26px; border: 2.5px solid #e0ddd6; border-top-color: #003087; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }
#errorBox { display: none; background: #fff2f2; border: 1px solid #fcc; border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; }
#errorBox p { font-size: 12px; color: #c00; white-space: pre-wrap; word-break: break-all; }
#resultado { display: none; }
.guardado-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 4px 10px; border-radius: 6px; margin-bottom: 12px; }
.guardado-ok { background: #e8f5e9; color: #1b5e20; }
.guardado-no { background: #fff8e1; color: #f57f17; }
.lead-titulo { font-size: 19px; font-weight: 700; margin-bottom: 6px; }
.score-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.score-big .num { font-size: 28px; font-weight: 700; }
.score-big .den { font-size: 14px; color: #aaa; }
.score-cl { font-size: 13px; color: #555; background: #f0efeb; padding: 4px 10px; border-radius: 6px; }
.score-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-bottom: 14px; }
.score-item { background: #f0efeb; border-radius: 8px; padding: 8px; text-align: center; }
.score-item .sl { font-size: 10px; color: #888; margin-bottom: 2px; }
.score-item .sv { font-size: 18px; font-weight: 600; }
.score-item .sv span { font-size: 10px; color: #bbb; }
.diag-box { background: #f0efeb; border-radius: 10px; padding: 13px 15px; margin-bottom: 14px; font-size: 14px; line-height: 1.65; color: #333; white-space: pre-line; }
.spin-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px; }
.spin-item { border-radius: 8px; padding: 10px 8px; text-align: center; }
.spin-item.ok { background: #e8f5e9; border: 1.5px solid #a5d6a7; }
.spin-item.falta { background: #fff8e1; border: 1.5px solid #ffe082; }
.spin-item .sll { font-size: 20px; font-weight: 700; }
.spin-item.ok .sll { color: #2e7d32; }
.spin-item.falta .sll { color: #f57f17; }
.spin-item .slabel { font-size: 10px; color: #666; margin-top: 2px; }
.spin-etapa { background: #fff3e0; border-radius: 8px; padding: 10px 13px; font-size: 13px; color: #e65100; margin-bottom: 14px; }
.canal-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 7px; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.canal-llamada { background: #e3f0ff; color: #003087; }
.canal-wp { background: #e8f5e9; color: #1b5e20; }
.razon { font-size: 13px; color: #777; font-style: italic; margin-bottom: 14px; }
.accion-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #aaa; margin-bottom: 8px; }
.objetivo-box { background: #f0efeb; border-radius: 8px; padding: 11px 13px; margin-bottom: 12px; font-size: 14px; color: #333; }
.apertura-box { background: #e8eef7; border-radius: 8px; padding: 11px 13px; margin-bottom: 14px; font-size: 14px; color: #1a3a6b; line-height: 1.6; }
.checklist { list-style: none; margin-bottom: 14px; }
.checklist li { border: 1px solid #e4e2dc; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; background: #fff; }
.cl-punto { font-size: 13px; font-weight: 600; color: #003087; margin-bottom: 5px; display: flex; align-items: flex-start; gap: 8px; }
.cl-punto::before { content: ""; min-width: 16px; height: 16px; border: 1.5px solid #003087; border-radius: 3px; display: inline-block; margin-top: 1px; }
.cl-pregunta { font-size: 13px; color: #333; font-style: italic; margin-bottom: 3px; padding-left: 24px; }
.cl-dato { font-size: 12px; color: #999; padding-left: 24px; }
.msg-box { background: #fff; border: 1px solid #e4e2dc; border-radius: 10px; padding: 13px 15px; margin-bottom: 14px; }
.msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.msg-label { font-size: 11px; color: #aaa; }
.msg-texto { font-size: 14px; line-height: 1.65; color: #1a1a1a; }
.tag { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; }
.tag-respaldo { background: #f3e5f5; color: #6a1b9a; }
.tag-siresponde { background: #e0f2f1; color: #004d40; }
.planb-box { border-left: 3px solid #ccc; padding: 9px 13px; margin-bottom: 18px; font-size: 13px; color: #666; }
.divider { border: none; border-top: 1px solid #eee; margin: 14px 0; }
.resultado-section { background: #fff; border: 1px solid #e4e2dc; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; }
.resultado-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.btn-resultado { padding: 8px 14px; border-radius: 8px; border: 1.5px solid transparent; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.btn-r-atendio { background: #e8f5e9; color: #1b5e20; border-color: #a5d6a7; }
.btn-r-no-atendio { background: #fff3e0; color: #e65100; border-color: #ffcc80; }
.btn-r-respondio { background: #e3f2fd; color: #0d47a1; border-color: #90caf9; }
.btn-r-agendo { background: #f3e5f5; color: #4a148c; border-color: #ce93d8; }
.btn-r-activo { outline: 3px solid #333; }
.resultado-notas { width: 100%; border: 1px solid #e0ddd6; border-radius: 8px; padding: 8px 12px; font-size: 13px; background: #fafaf8; outline: none; resize: none; min-height: 52px; margin-bottom: 10px; font-family: inherit; }
.resultado-notas:focus { border-color: #003087; }
.btn-guardar-resultado { padding: 9px 20px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-guardar-resultado:disabled { background: #b0b8c8; cursor: not-allowed; }
.resultado-saved { font-size: 13px; color: #2e7d32; display: none; padding: 6px 0; }
/* GESTIONES */
.search-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.search-bar input { flex: 1; border: 1px solid #e0ddd6; border-radius: 8px; padding: 10px 12px; font-size: 14px; outline: none; background: #fff; }
.search-bar input:focus { border-color: #003087; }
.search-bar button { padding: 10px 16px; background: #003087; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.search-bar button:hover { background: #00256b; }
.stats-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 16px; }
.stat-card { background: #fff; border-radius: 10px; padding: 14px; border: 1px solid #e4e2dc; text-align: center; }
.stat-card .st-num { font-size: 24px; font-weight: 700; }
.stat-card .st-label { font-size: 11px; color: #888; margin-top: 3px; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #e4e2dc; }
th { background: #003087; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
td { padding: 10px 12px; border-bottom: 1px solid #f0efeb; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fafaf8; cursor: pointer; }
.badge-score { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.bs-hot { background: #ffebee; color: #c62828; }
.bs-warm { background: #fff8e1; color: #f57f17; }
.bs-cold { background: #e3f2fd; color: #1565c0; }
.bs-dead { background: #f5f5f5; color: #757575; }
.spin-mini { display: flex; gap: 2px; }
.spin-mini span { width: 18px; height: 18px; border-radius: 3px; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.spin-mini .ok { background: #c8e6c9; color: #1b5e20; }
.spin-mini .no { background: #f5f5f5; color: #aaa; }
.resultado-chip { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
.rc-atendio { background: #e8f5e9; color: #1b5e20; }
.rc-no_atendio { background: #fff3e0; color: #e65100; }
.rc-respondio_wp { background: #e3f2fd; color: #0d47a1; }
.rc-agendo_visita { background: #f3e5f5; color: #4a148c; }
.rc-null { background: #f5f5f5; color: #aaa; }
.refresh-btn { padding: 9px 16px; background: transparent; color: #003087; border: 1px solid #003087; border-radius: 8px; font-size: 13px; cursor: pointer; }
.refresh-btn:hover { background: #e8eef7; }
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-logo">
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="11" rx="10" ry="6.5" stroke="white" stroke-width="1.5"/>
      <path d="M4 8.5C4 8.5 7 13.5 11 13.5C15 13.5 18 8.5 18 8.5" stroke="white" stroke-width="1.5"/>
    </svg>
    Óvalo Leads
  </div>
  <div class="nav-tab active" onclick="switchTab('analizar')">Analizar</div>
  <div class="nav-tab" onclick="switchTab('gestiones')">Mis gestiones</div>
</nav>

<!-- ANALIZAR -->
<div id="tab-analizar" class="page active">
  <div class="card">
    <div class="card-title">Historial del lead</div>
    <div class="field">
      <label>CRM Tecnom <span>(obligatorio)</span></label>
      <textarea id="crm" placeholder="Pegá el historial del CRM acá..."></textarea>
    </div>
    <div class="field">
      <label>WhatsApp <span>(opcional)</span></label>
      <textarea id="wa" placeholder="Pegá la conversación de WhatsApp acá..."></textarea>
    </div>
    <div class="field">
      <label>Tu sensación <span>(lo que el CRM no captura)</span></label>
      <textarea id="sensacion" placeholder="Ej: creo que el tema es precio, se enfrió después de la segunda llamada..."></textarea>
    </div>
  </div>

  <button class="btn-primary" id="analizarBtn" onclick="analizar()">Analizar lead</button>
  <div id="loading"><div class="spinner"></div><p>Analizando historial...</p></div>
  <div id="errorBox"><p id="errorMsg"></p></div>

  <div id="resultado">
    <div class="card">
      <div id="guardadoChip"></div>
      <div class="lead-titulo" id="tituloLead"></div>
      <div class="score-row">
        <span id="scoreEmoji" style="font-size:22px"></span>
        <div class="score-big"><span class="num" id="scoreNum"></span><span class="den">/25</span></div>
        <span class="score-cl" id="scoreCl"></span>
      </div>
      <div class="score-grid" id="scoreGrid"></div>
    </div>

    <div class="card">
      <div class="card-title">Diagnóstico</div>
      <div class="diag-box" id="diagnosticoTexto"></div>
      <div class="card-title">Estado SPIN</div>
      <div class="spin-grid" id="spinGrid"></div>
      <div class="spin-etapa" id="spinEtapa"></div>
    </div>

    <div class="card">
      <div class="card-title">Acción recomendada</div>
      <div id="canalBadge"></div>
      <p class="razon" id="razonCanal"></p>
      <div id="bloqueAccion"></div>
      <div class="divider"></div>
      <div class="accion-label">Plan B — si no hay respuesta en 5-7 días</div>
      <div class="planb-box" id="planBTexto"></div>
    </div>

    <div class="resultado-section" id="resultadoSection" style="display:none">
      <div class="card-title" style="margin-bottom:12px">Registrar resultado del contacto</div>
      <div class="resultado-btns">
        <button class="btn-resultado btn-r-atendio" onclick="selResultado('atendio',this)">✓ Atendió</button>
        <button class="btn-resultado btn-r-no-atendio" onclick="selResultado('no_atendio',this)">✗ No atendió</button>
        <button class="btn-resultado btn-r-respondio" onclick="selResultado('respondio_wp',this)">💬 Respondió WP</button>
        <button class="btn-resultado btn-r-agendo" onclick="selResultado('agendo_visita',this)">⭐ Agendó visita</button>
      </div>
      <textarea class="resultado-notas" id="notasResultado" placeholder="Notas del contacto (opcional)..."></textarea>
      <button class="btn-guardar-resultado" id="btnGuardarResultado" onclick="guardarResultado()" disabled>Guardar resultado</button>
      <div class="resultado-saved" id="resultadoSaved">✓ Resultado guardado</div>
    </div>

    <br>
    <button class="btn-secondary" onclick="resetear()">Analizar otro lead</button>
  </div>
</div>

<!-- GESTIONES -->
<div id="tab-gestiones" class="page">
  <div class="search-bar">
    <input type="text" id="filtroBusqueda" placeholder="Buscar por nombre, teléfono o modelo..." oninput="filtrarTabla()" />
    <button class="refresh-btn" onclick="cargarGestiones()">Actualizar</button>
  </div>

  <div class="stats-row">
    <div class="stat-card"><div class="st-num" id="st-total">—</div><div class="st-label">Total leads</div></div>
    <div class="stat-card"><div class="st-num" id="st-hot">—</div><div class="st-label">Calientes 🔥</div></div>
    <div class="stat-card"><div class="st-num" id="st-warm">—</div><div class="st-label">Tibios 🟡</div></div>
    <div class="stat-card"><div class="st-num" id="st-cold">—</div><div class="st-label">Fríos ⚫</div></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Modelo</th>
          <th>Score</th>
          <th>SPIN</th>
          <th>Última gestión</th>
          <th>Resultado</th>
          <th>#</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="tbodyLeads">
        <tr><td colspan="7" style="text-align:center;padding:32px;color:#aaa">Cargando...</td></tr>
      </tbody>
    </table>
  </div>
</div>

<script>
let currentPhone = null;
let currentGestionId = null;
let resultadoSeleccionado = null;
let allLeads = [];

function switchTab(tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  const tabs = document.querySelectorAll('.nav-tab');
  if (tab === 'analizar') tabs[0].classList.add('active');
  else { tabs[1].classList.add('active'); cargarGestiones(); }
}

async function analizar() {
  const crm = document.getElementById('crm').value.trim();
  const wa = document.getElementById('wa').value.trim();
  const sensacion = document.getElementById('sensacion').value.trim();
  if (!crm) { mostrarError('Pegá el historial del CRM para poder analizar.'); return; }

  document.getElementById('errorBox').style.display = 'none';
  document.getElementById('resultado').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('analizarBtn').disabled = true;

  try {
    const resp = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crm, wa, sensacion })
    });
    const data = await resp.json();
    if (!resp.ok || data.error) { mostrarError(JSON.stringify(data.error || data, null, 2)); return; }
    if (data._gestion_id) currentGestionId = data._gestion_id;
    if (data._phone) currentPhone = data._phone;
    renderResultado(data);
  } catch(e) {
    mostrarError('Error de red: ' + e.message);
  } finally {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('analizarBtn').disabled = false;
  }
}

function renderResultado(r) {
  // Chip de guardado
  const chip = document.getElementById('guardadoChip');
  if (r._guardado) {
    chip.innerHTML = `<span class="guardado-chip guardado-ok">✓ Guardado en base de datos · Tel: ${r._phone}</span>`;
    document.getElementById('resultadoSection').style.display = 'block';
  } else {
    chip.innerHTML = `<span class="guardado-chip guardado-no">⚠ No se pudo detectar teléfono — no guardado</span>`;
    document.getElementById('resultadoSection').style.display = 'none';
  }

  document.getElementById('tituloLead').textContent = r.titulo || '';
  const total = Math.min(r.score?.total || 0, 25);
  const emoji = total >= 20 ? '🔥' : total >= 14 ? '🟡' : total >= 8 ? '🔵' : '⚫';
  document.getElementById('scoreEmoji').textContent = emoji;
  document.getElementById('scoreNum').textContent = total;
  document.getElementById('scoreCl').textContent = r.clasificacion || '';

  const crit = [
    { key: 'intencion', label: 'Intención' },
    { key: 'capacidad_pago', label: 'Cap. pago' },
    { key: 'urgencia', label: 'Urgencia' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'fit_producto', label: 'Fit' }
  ];
  document.getElementById('scoreGrid').innerHTML = crit.map(c => {
    const s = r.score?.[c.key] || {};
    return `<div class="score-item" title="${(s.nota||'').replace(/"/g,'&quot;')}">
      <div class="sl">${c.label}</div>
      <div class="sv">${Math.min(s.puntaje||0,5)}<span>/5</span></div>
    </div>`;
  }).join('');

  document.getElementById('diagnosticoTexto').textContent = r.diagnostico || '';

  const spin = r.spin || {};
  const letras = ['S','P','I','N'];
  const nombres = { S:'Situación', P:'Problema', I:'Implicación', N:'Need-Payoff' };
  document.getElementById('spinGrid').innerHTML = letras.map(l => {
    const d = spin[l] || {};
    const ok = d.cubierto === true;
    return `<div class="spin-item ${ok?'ok':'falta'}" title="${(d.detalle||'').replace(/"/g,'&quot;')}">
      <div class="sll">${l}</div><div class="slabel">${nombres[l]}</div>
      <div style="font-size:14px;margin-top:3px">${ok?'✓':'○'}</div>
    </div>`;
  }).join('');

  document.getElementById('spinEtapa').textContent = spin.etapa_actual
    ? `${spin.etapa_actual}${spin.siguiente_letra ? ' · Completar: ' + spin.siguiente_letra : ''}` : '';

  const canal = r.canal || 'llamada';
  document.getElementById('canalBadge').innerHTML = `<div class="canal-badge ${canal==='llamada'?'canal-llamada':'canal-wp'}">${canal==='llamada'?'📞 Llamada telefónica':'💬 WhatsApp'}</div>`;
  document.getElementById('razonCanal').textContent = r.razon_canal || '';

  const accion = r.accion || {};
  let html = '';
  if (canal === 'llamada') {
    const ll = accion.llamada || {};
    if (ll.objetivo) html += `<div class="accion-label">Objetivo</div><div class="objetivo-box">${ll.objetivo}</div>`;
    if (ll.apertura) html += `<div class="accion-label">Apertura — primeros 30 segundos</div><div class="apertura-box">${ll.apertura}</div>`;
    if (ll.checklist?.length) {
      html += `<div class="accion-label">Checklist de indagación</div><ul class="checklist">`;
      ll.checklist.forEach(item => {
        html += `<li><div class="cl-punto">${item.punto||''}</div>
          <div class="cl-pregunta">"${item.pregunta_sugerida||''}"</div>
          <div class="cl-dato">Buscás saber: ${item.dato_que_buscas||''}</div></li>`;
      });
      html += `</ul>`;
    }
    if (ll.si_no_atiende) {
      html += `<span class="tag tag-respaldo">Si no atiende — WhatsApp de respaldo</span>
      <div class="msg-box"><div class="msg-header"><span class="msg-label">Listo para copiar</span>
      <button class="btn-copy" onclick="copiar('respaldo')">Copiar</button></div>
      <div class="msg-texto" id="textoRespaldo">${ll.si_no_atiende}</div></div>`;
    }
  } else {
    const wp = accion.whatsapp || {};
    if (wp.objetivo) html += `<div class="accion-label">Objetivo</div><div class="objetivo-box">${wp.objetivo}</div>`;
    if (wp.mensaje) {
      html += `<div class="accion-label">Mensaje</div>
      <div class="msg-box"><div class="msg-header"><span class="msg-label">Listo para WhatsApp</span>
      <button class="btn-copy" onclick="copiar('mensaje')">Copiar</button></div>
      <div class="msg-texto" id="textoMensaje">${wp.mensaje}</div></div>`;
    }
    if (wp.si_responde) html += `<span class="tag tag-siresponde">Si responde</span><div class="objetivo-box">${wp.si_responde}</div>`;
  }

  document.getElementById('bloqueAccion').innerHTML = html;
  document.getElementById('planBTexto').textContent = r.plan_b || '';

  resultadoSeleccionado = null;
  document.getElementById('btnGuardarResultado').disabled = true;
  document.getElementById('resultadoSaved').style.display = 'none';
  document.getElementById('notasResultado').value = '';
  document.querySelectorAll('.btn-resultado').forEach(b => b.classList.remove('btn-r-activo'));

  document.getElementById('resultado').style.display = 'block';
  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copiar(tipo) {
  const id = tipo === 'respaldo' ? 'textoRespaldo' : 'textoMensaje';
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    document.querySelectorAll('.btn-copy').forEach(b => {
      if (b.getAttribute('onclick')?.includes(tipo)) {
        b.textContent = '¡Copiado!';
        setTimeout(() => b.textContent = 'Copiar', 2000);
      }
    });
  });
}

function selResultado(tipo, btn) {
  document.querySelectorAll('.btn-resultado').forEach(b => b.classList.remove('btn-r-activo'));
  btn.classList.add('btn-r-activo');
  resultadoSeleccionado = tipo;
  document.getElementById('btnGuardarResultado').disabled = false;
}

async function guardarResultado() {
  if (!resultadoSeleccionado || !currentPhone) return;
  const notas = document.getElementById('notasResultado').value;
  const btn = document.getElementById('btnGuardarResultado');
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  try {
    const res = await fetch('/api/resultado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: currentPhone, gestion_id: currentGestionId, resultado: resultadoSeleccionado, notas })
    });
    if (res.ok) {
      document.getElementById('resultadoSaved').style.display = 'block';
      btn.textContent = '✓ Guardado';
    } else {
      btn.disabled = false;
      btn.textContent = 'Guardar resultado';
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Guardar resultado';
  }
}

function resetear() {
  ['crm','wa','sensacion'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('resultado').style.display = 'none';
  document.getElementById('errorBox').style.display = 'none';
  currentPhone = null; currentGestionId = null; resultadoSeleccionado = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  document.getElementById('errorBox').style.display = 'block';
  document.getElementById('loading').style.display = 'none';
  document.getElementById('analizarBtn').disabled = false;
}

async function cargarGestiones() {
  document.getElementById('tbodyLeads').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:#aaa">Cargando...</td></tr>';
  try {
    const res = await fetch('/api/leads');
    const data = await res.json();
    allLeads = data.leads || [];
    renderTabla(allLeads);
    document.getElementById('st-total').textContent = allLeads.length;
    document.getElementById('st-hot').textContent = allLeads.filter(l => l.score >= 20).length;
    document.getElementById('st-warm').textContent = allLeads.filter(l => l.score >= 14 && l.score < 20).length;
    document.getElementById('st-cold').textContent = allLeads.filter(l => l.score < 14).length;
  } catch {
    document.getElementById('tbodyLeads').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:#c00">Error cargando datos.</td></tr>';
  }
}

function filtrarTabla() {
  const q = document.getElementById('filtroBusqueda').value.toLowerCase();
  renderTabla(allLeads.filter(l =>
    (l.nombre||'').toLowerCase().includes(q) ||
    (l.modelo||'').toLowerCase().includes(q) ||
    (l.id||'').includes(q)
  ));
}

function renderTabla(leads) {
  if (!leads.length) {
    document.getElementById('tbodyLeads').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:#aaa">Sin gestiones registradas.</td></tr>';
    return;
  }
  document.getElementById('tbodyLeads').innerHTML = leads.map(l => {
    const sc = l.score >= 20 ? 'bs-hot' : l.score >= 14 ? 'bs-warm' : l.score >= 8 ? 'bs-cold' : 'bs-dead';
    const spinMini = ['S','P','I','N'].map(letra => {
      const key = 'spin_' + letra.toLowerCase();
      const ok = l[key] === true;
      return `<span class="${ok?'ok':'no'}">${letra}</span>`;
    }).join('');
    const resChip = l.ultimo_resultado
      ? `<span class="resultado-chip rc-${l.ultimo_resultado}">${resultadoLabel(l.ultimo_resultado)}</span>`
      : `<span class="resultado-chip rc-null">—</span>`;
    return `<tr onclick="irALead('${l.id}','${escHtml(l.nombre)}')">
      <td><strong>${escHtml(l.nombre||'—')}</strong></td>
      <td>${escHtml(l.modelo||'—')}</td>
      <td><span class="badge-score ${sc}">${l.score||0}/25</span></td>
      <td><div class="spin-mini">${spinMini}</div></td>
      <td>${l.ultima_gestion||'—'}</td>
      <td>${resChip}</td>
      <td style="text-align:center">${l.total_gestiones||1}</td>
      <td onclick="event.stopPropagation()"><button onclick="eliminarLead('${l.id}','${escHtml(l.nombre)}')" style="background:#fff2f2;color:#c00;border:1px solid #fcc;border-radius:5px;padding:3px 8px;font-size:11px;cursor:pointer;">✕</button></td>
    </tr>`;
  }).join('');
}

function irALead(phone, nombre) {
  location.href = 'lead.html?phone=' + encodeURIComponent(phone);
}

function resultadoLabel(r) {
  const map = { atendio:'✓ Atendió', no_atendio:'✗ No atendió', respondio_wp:'💬 WP', agendo_visita:'⭐ Agendó' };
  return map[r] || r;
}

async function eliminarLead(phone, nombre) {
  if (!confirm(`¿Eliminar a ${nombre} y todo su historial?`)) return;
  try {
    await fetch('/api/delete-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, action: 'delete_lead' })
    });
    allLeads = allLeads.filter(l => l.id !== phone);
    renderTabla(allLeads);
    document.getElementById('st-total').textContent = allLeads.length;
    document.getElementById('st-hot').textContent = allLeads.filter(l => l.score >= 20).length;
    document.getElementById('st-warm').textContent = allLeads.filter(l => l.score >= 14 && l.score < 20).length;
    document.getElementById('st-cold').textContent = allLeads.filter(l => l.score < 14).length;
  } catch(e) { alert('Error al eliminar'); }
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
</script>
</body>
</html>
