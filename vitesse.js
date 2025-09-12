let running=[false,false], t0=[0,0];
function initVitesse(){
  const d=ensureDuo();
  [0,1].forEach(i=>{
    const root=document.querySelector(`[data-eleve="${i}"]`);
    root.querySelector('.nomlib').textContent = `${d.eleves[i].Prenom} ${d.eleves[i].Nom}`;
    root.querySelector('.startstop').addEventListener('click', ()=>startStop(i));
  });
  document.getElementById('save-vitesse').addEventListener('click', ()=>{
    const upd=ensureDuo();
    [0,1].forEach(i=>{
      const t=parseFloat(document.querySelector(`[data-eleve="${i}"] .chrono`).value||'0');
      if(t>0) upd.tests.Vitesse[i] = { type:'Sprint30m', t_30m_s: Number(t.toFixed(2)) };
    });
    saveDuo(upd);
    alert('Vitesse enregistrée');
  });
}
function startStop(i){
  const root=document.querySelector(`[data-eleve="${i}"]`);
  if(!running[i]){ running[i]=true; t0[i]=performance.now(); root.querySelector('.startstop').textContent='Stop'; }
  else { running[i]=false; const t=(performance.now()-t0[i])/1000; root.querySelector('.chrono').value = t.toFixed(2); root.querySelector('.startstop').textContent='Start'; }
}
document.addEventListener('DOMContentLoaded', initVitesse);
