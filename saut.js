let essaisCount = [2,2];
function initSaut(){
  const d=ensureDuo();
  [0,1].forEach(i=>{
    const root=document.querySelector(`[data-eleve="${i}"]`);
    root.querySelector('.nomlib').textContent = `${d.eleves[i].Prenom} ${d.eleves[i].Nom}`;
    root.querySelector('.toggle3').addEventListener('change', (e)=>{
      essaisCount[i] = e.target.checked?3:2;
      root.querySelector('[data-e3]').style.display = e.target.checked? '' : 'none';
      calcBest(i);
    });
    ['e1','e2','e3'].forEach(k=>{
      const el=root.querySelector(`.${k}`); if(el) el.addEventListener('input', ()=>calcBest(i));
    });
    calcBest(i);
  });
  document.getElementById('save-saut').addEventListener('click', ()=>{
    const upd=ensureDuo();
    [0,1].forEach(i=>{
      const root=document.querySelector(`[data-eleve="${i}"]`);
      const vals=[Number(root.querySelector('.e1').value||0), Number(root.querySelector('.e2').value||0), essaisCount[i]===3?Number(root.querySelector('.e3').value||0):0];
      const kept=vals.slice(0,essaisCount[i]);
      const best=Math.max(0,...kept);
      if(best>0) upd.tests.Saut[i] = { type:'SL_sans_elan', essais_cm: kept, best_cm: best };
    });
    saveDuo(upd);
    alert('Saut enregistré');
  });
}
function calcBest(i){
  const root=document.querySelector(`[data-eleve="${i}"]`);
  const vals=[Number(root.querySelector('.e1').value||0), Number(root.querySelector('.e2').value||0), essaisCount[i]===3?Number(root.querySelector('.e3').value||0):0];
  const kept=vals.slice(0,essaisCount[i]);
  const best=Math.max(0,...kept);
  root.querySelector('.best').textContent = best? best+' cm' : '-';
}
document.addEventListener('DOMContentLoaded', initSaut);
