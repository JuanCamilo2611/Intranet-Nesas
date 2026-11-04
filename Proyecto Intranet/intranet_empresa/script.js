const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const today = new Date();
const isoDate = (d=today) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmtDate = value => { if(!value) return 'Sin fecha'; const d = new Date(`${value}T12:00:00`); return d.toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}); };
const seed = {
  manuales:[
    {title:'Solución de problemas de conexión',category:'Redes y conectividad',date:isoDate(),description:'Pasos básicos para validar la conexión de red, VPN y acceso a herramientas corporativas.'},
    {title:'Configuración inicial del puesto de trabajo',category:'Equipos',date:isoDate(),description:'Lista de verificación para preparar un equipo y sus periféricos antes de iniciar operación.'},
    {title:'Acceso a aplicaciones corporativas',category:'Aplicaciones',date:isoDate(),description:'Recomendaciones para revisar acceso, navegador y credenciales de las herramientas de trabajo.'},
    {title:'Reporte de incidentes de TI',category:'Soporte TI',date:isoDate(),description:'Información que conviene incluir al reportar un incidente técnico al área de soporte.'}
  ],
  calidad:[
    {title:'Matriz de evaluación de llamadas',category:'Calidad',date:isoDate(),description:'Criterios de revisión, ponderaciones y observaciones para auditorías de calidad.'},
    {title:'Lista de verificación de procesos',category:'Procedimientos',date:isoDate(),description:'Controles de cumplimiento para estandarizar tareas y revisar pasos críticos.'},
    {title:'Control de versiones documentales',category:'Documentación',date:isoDate(),description:'Registro de responsables, fechas de revisión y cambios aplicados a documentos.'}
  ],
  actas:[
    {title:'Reunión de seguimiento operativo',category:'Reunión',date:isoDate(),description:'Revisión de pendientes, acuerdos del equipo y responsables de cada compromiso.'},
    {title:'Comité de mejora continua',category:'Calidad',date:isoDate(),description:'Ideas de mejora, hallazgos identificados y próximos pasos de seguimiento.'}
  ],
  rankings:[
    {title:'Ranking quincenal - Ejemplo A',category:'Desempeño',date:isoDate(),description:'Registro de ejemplo para ilustrar la consulta de informes quincenales.'},
    {title:'Ranking quincenal - Ejemplo B',category:'Desempeño',date:isoDate(),description:'Plantilla demostrativa para organizar reportes por periodo.'}
  ],
  cierres:[
    {title:'Cierre operativo de ejemplo - Turno mañana',category:'Cierre operativo',date:isoDate(),description:'Registro demostrativo de cierre. Responsable: Equipo de operaciones. Hora: 13:00.'},
    {title:'Cierre operativo de ejemplo - Turno tarde',category:'Cierre operativo',date:isoDate(),description:'Registro demostrativo de cierre. Responsable: Equipo de operaciones. Hora: 21:00.'}
  ]
};
const keys = ['manuales','calidad','actas','rankings','cierres'];
const labels = {inicio:'Panel principal',manuales:'Manuales técnicos',calidad:'Matrices de calidad',actas:'Actas y reuniones',rankings:'Rankings quincenales',cierres:'Historial de cierres'};
const titles = {inicio:['Buenos días, equipo','Todo lo que necesitas para trabajar, en un solo lugar.'],manuales:['Manuales técnicos','Encuentra guías prácticas y soluciones para las herramientas de trabajo.'],calidad:['Matrices de calidad','Consulta documentos, criterios y recursos de seguimiento de calidad.'],actas:['Actas y reuniones','Organiza reuniones, acuerdos y compromisos del equipo.'],rankings:['Rankings quincenales','Centraliza los informes y resultados de cada periodo.'],cierres:['Historial de cierres','Consulta los registros operativos, fechas y observaciones.']};
let data = loadData();
let currentPage = 'inicio';
let currentQuery = '';
let toastTimer;
function loadData(){try{const stored=localStorage.getItem('nexaIntranetData');if(stored){const parsed=JSON.parse(stored);return {...structuredClone(seed),...parsed};}}catch(e){}return structuredClone(seed);}
function saveData(){try{localStorage.setItem('nexaIntranetData',JSON.stringify(data));}catch(e){showToast('No se pudo guardar en este navegador.');}}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function iconFor(page){return ({manuales:'▤',calidad:'✓',actas:'▧',rankings:'▥',cierres:'◷'})[page]||'•';}
function render(){
  $('#manualCount').textContent=data.manuales.length;
  $('#statManuals').textContent=data.manuales.length;
  $('#statQuality').textContent=data.calidad.length;
  $('#statMinutes').textContent=data.actas.length;
  $('#statClosures').textContent=data.cierres.length;
  renderActivity();
  keys.forEach(key=>renderModule(key));
}
function renderActivity(){
  const all=keys.flatMap(key=>data[key].map(item=>({...item,key}))).sort((a,b)=>(b.createdAt||b.date||'').localeCompare(a.createdAt||a.date||'')).slice(0,4);
  $('#recentActivity').innerHTML=all.map(item=>`<div class="activity-item"><div class="activity-bullet">${iconFor(item.key)}</div><div class="activity-body"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.category||labels[item.key])} · ${fmtDate(item.date)}</p></div><span class="activity-time">${item.createdAt?new Date(item.createdAt).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}):'Ejemplo'}</span></div>`).join('')||'<div class="empty-state"><strong>Sin actividad</strong><p>Los nuevos registros aparecerán aquí.</p></div>';
}
function renderModule(key){
 const root=$(`#page-${key}`);
 if(key==='cierres'){
  const rows=data[key].filter(x=>matches(x,currentQuery)).map(item=>`<tr><td><strong>${escapeHTML(item.title)}</strong></td><td>${fmtDate(item.date)}</td><td>${escapeHTML(item.category||'Cierre operativo')}</td><td>${escapeHTML(item.description||'—')}</td><td><span class="status-pill">Registrado</span></td></tr>`).join('');
  root.innerHTML=toolbar(key)+`<div class="table-wrap"><table class="data-table"><thead><tr><th>Registro</th><th>Fecha</th><th>Tipo</th><th>Observaciones</th><th>Estado</th></tr></thead><tbody>${rows||'<tr><td colspan="5">No se encontraron registros.</td></tr>'}</tbody></table></div>`;
 }else if(key==='actas'||key==='rankings'){
  const rows=data[key].filter(x=>matches(x,currentQuery)).map(item=>`<tr><td><strong>${escapeHTML(item.title)}</strong></td><td>${fmtDate(item.date)}</td><td>${escapeHTML(item.category||'General')}</td><td>${escapeHTML(item.description||'—')}</td><td><span class="status-pill">Disponible</span></td></tr>`).join('');
  root.innerHTML=toolbar(key)+`<div class="table-wrap"><table class="data-table"><thead><tr><th>Nombre del registro</th><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Estado</th></tr></thead><tbody>${rows||'<tr><td colspan="5">No se encontraron registros.</td></tr>'}</tbody></table></div>`;
 }else{
  const items=data[key].filter(x=>matches(x,currentQuery));
  root.innerHTML=toolbar(key)+`<div class="records-grid">${items.map(item=>`<article class="record-card"><div class="record-top"><span class="record-icon">${iconFor(key)}</span><span class="record-tag">${escapeHTML(item.category||labels[key])}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description||'Sin descripción adicional.')}</p><div class="record-meta"><span>${fmtDate(item.date)}</span><button data-detail="${escapeHTML(item.id||'')}" data-key="${key}" data-title="${escapeHTML(item.title)}" data-description="${escapeHTML(item.description||'')}" data-category="${escapeHTML(item.category||'')}" data-date="${escapeHTML(item.date||'')}">Ver detalle ↗</button></div></article>`).join('')||`<div class="empty-state"><strong>No hay resultados</strong><p>Prueba otra búsqueda o crea un registro nuevo.</p></div>`}</div>`;
 }
 const search=$(`#search-${key}`); if(search) search.value=currentQuery;
}
function toolbar(key){return `<div class="module-toolbar"><label class="module-search"><span>⌕</span><input id="search-${key}" data-module-search="${key}" placeholder="Buscar en ${labels[key].toLowerCase()}..." value="${escapeHTML(currentQuery)}"></label><span class="result-count">${data[key].length} registro(s)</span></div>`;}
function matches(item,q){if(!q)return true;const text=[item.title,item.category,item.description,item.date].join(' ').toLocaleLowerCase('es');return text.includes(q.toLocaleLowerCase('es'));}
function goTo(page){
 if(!labels[page])return;currentPage=page;currentQuery='';$('[data-page].active')?.classList.remove('active');$(`.nav-item[data-page="${page}"]`)?.classList.add('active');
 $$('.page-view').forEach(el=>el.classList.toggle('hidden',el.id!==`page-${page}`));
 $('#crumb').textContent=labels[page];$('#pageTitle').innerHTML=`${titles[page][0]}${page==='inicio'?' <span>✦</span>':''}`;$('#pageSubtitle').textContent=titles[page][1];
 $('#quickAddText').textContent=page==='inicio'?'Crear registro':`Agregar a ${labels[page].toLowerCase()}`;
 if(page!=='inicio')renderModule(page);$('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
}
function openModal(){
 $('#modalTitle').textContent=currentPage==='inicio'?'Crear registro':`Nuevo registro: ${labels[currentPage]}`;
 $('#modalDescription').textContent='Este registro se guardará localmente en este navegador. No incluyas datos personales o confidenciales.';
 $('#recordCategory').value=({manuales:'Soporte TI',calidad:'Calidad',actas:'Reunión',rankings:'Desempeño',cierres:'Cierre operativo'})[currentPage]||'General';
 $('#recordDate').value=isoDate();$('#recordTitle').value='';$('#recordDescription').value='';
 $('#modalBackdrop').classList.remove('hidden');$('#recordTitle').focus();
}
function closeModal(){$('#modalBackdrop').classList.add('hidden');}
function showToast(message){const el=$('#toast');el.textContent=message;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),3200);}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-page]');if(nav){goTo(nav.dataset.page);return;}
 const detail=e.target.closest('[data-detail]');if(detail){const item=data[detail.dataset.key].find(x=>x.id===detail.dataset.detail)||{title:detail.dataset.title,description:detail.dataset.description,category:detail.dataset.category,date:detail.dataset.date};showToast(`${item.title} · ${item.description||'Sin descripción'}`);return;}
});
$('#quickAdd').addEventListener('click',openModal);$('#closeModal').addEventListener('click',closeModal);$('#cancelModal').addEventListener('click',closeModal);
$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal();});
$('#recordForm').addEventListener('submit',e=>{
 e.preventDefault();let target=keys.includes(currentPage)?currentPage:($('#recordCategory').value==='Calidad'?'calidad':$('#recordCategory').value==='Reunión'?'actas':$('#recordCategory').value==='Desempeño'?'rankings':$('#recordCategory').value==='Cierre operativo'?'cierres':'manuales');
 const fd=new FormData(e.currentTarget);const item={id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,title:fd.get('title').trim(),category:fd.get('category'),date:fd.get('date')||isoDate(),description:fd.get('description').trim(),createdAt:new Date().toISOString()};
 data[target].unshift(item);saveData();render();closeModal();if(currentPage!==target)goTo(target);else renderModule(target);showToast('Registro guardado en este navegador.');
});
document.addEventListener('input',e=>{
 if(e.target.matches('[data-module-search]')){currentQuery=e.target.value;renderModule(e.target.dataset.moduleSearch);}
 if(e.target.id==='globalSearch'){const q=e.target.value.trim();if(q){currentQuery=q;if(currentPage==='inicio'){const found=keys.find(k=>data[k].some(x=>matches(x,q)));if(found)goTo(found);}if(keys.includes(currentPage))renderModule(currentPage);}}
});
$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim();const found=keys.find(k=>data[k].some(x=>matches(x,q)));if(found){currentQuery=q;goTo(found);renderModule(found);}else if(q)showToast('No se encontraron registros con ese término.');}});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus();}if(e.key==='Escape')closeModal();});
$('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#todayLabel').textContent=today.toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
render();
