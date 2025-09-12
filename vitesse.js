let t0=null, running=false;
function initVitesse(){ ensureIdentityOrRedirect(); }
function startStop(){ if(!running){ running=true; t0=performance.now(); $('#startstop').textContent='Stop'; } else { running=false; const t=(performance.now()-t0)/1000; $('#chrono').value = t.toFixed(2); $('#startstop').textContent='Start'; } }
function saveVitesse(){ const ident=getCurrentIdentity(); const manual=parseFloat($('#chrono').value||'0'); if(!manual||manual<=0){ alert('Indiquez un temps (Start/Stop ou saisie).'); return; } saveResults(ident,{tests:{Vitesse:{type:'Sprint30m', t_30m_s: Number(manual.toFixed(2))}}}); alert('Vitesse enregistrée : 30 m en '+manual.toFixed(2)+' s'); }
document.addEventListener('DOMContentLoaded', ()=>{ initVitesse(); $('#startstop').addEventListener('click', startStop); $('#savevitesse').addEventListener('click', saveVitesse); });
