function vmaFromPalier(p){ return 8.5 + 0.5*p; }
function initEndu(){
  const d=ensureDuo();
  [0,1].forEach(i=>{
    const root=document.querySelector(`[data-eleve="${i}"]`);
    root.querySelector('.nomlib').textContent = `${d.eleves[i].Prenom} ${d.eleves[i].Nom}`;
    const palierInput=root.querySelector('.palier');
    const vmaOut=root.querySelector('.vma');
    palierInput.addEventListener('input', ()=>{
      const p=Number(palierInput.value||0);
      vmaOut.textContent = p? vmaFromPalier(p).toFixed(1)+' km/h' : '-';
    });
  });
  document.getElementById('save-endu').addEventListener('click', ()=>{
    const upd=ensureDuo();
    [0,1].forEach(i=>{
      const p=Number(document.querySelector(`[data-eleve="${i}"] .palier`).value||0);
      if(p>0) upd.tests.Endurance[i] = { type:'LucLeger20m', palier:p, vma_kmh: Number(vmaFromPalier(p).toFixed(1)) };
    });
    saveDuo(upd);
    alert('Endurance enregistrée');
  });
}
document.addEventListener('DOMContentLoaded', initEndu);
