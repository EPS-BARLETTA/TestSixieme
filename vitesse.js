let t0=null, running=false;
function initVitesse(){
  ensureIdentityOrRedirect();
}
function startStop(){
  if(!running){
    t0 = performance.now(); running=true;
    $('#startstop').textContent='Stop';
  }else{
    running=false;
    const t = (performance.now()-t0)/1000;
    $('#chrono').textContent = t.toFixed(2)+' s';
    $('#startstop').textContent='Start';
  }
}
function saveVitesse(){
  const ident = getCurrentIdentity();
  let t = $('#chrono').textContent.replace(' s','');
  const manual = Number($('#manual').value||0);
  const time = manual>0 ? manual : Number(t||0);
  if(!time){ alert('Chrono vide. Lancez le chrono ou saisissez manuellement.'); return; }
  saveResults(ident, { tests: { Vitesse: { type:'Sprint30m', t_30m_s: Number(time.toFixed(2)) } } });
  alert('Vitesse enregistrée : 30 m en '+time.toFixed(2)+' s');
}
document.addEventListener('DOMContentLoaded', ()=>{
  initVitesse();
  $('#startstop').addEventListener('click', startStop);
  $('#savevitesse').addEventListener('click', saveVitesse);
});
