function initSaut(){
  ensureIdentityOrRedirect();
  ['essai1','essai2','essai3'].forEach(id=>{
    const el = document.getElementById(id);
    el.addEventListener('input', calcBest);
  });
  calcBest();
}
function calcBest(){
  const v = [Number($('#essai1').value||0), Number($('#essai2').value||0), Number($('#essai3').value||0)];
  const best = Math.max(0, ...v);
  $('#best').textContent = best ? best+' cm' : '-';
}
function saveSaut(){
  const ident = getCurrentIdentity();
  const essais = [$('#essai1').value, $('#essai2').value, $('#essai3').value].map(x=>Number(x||0));
  const best = Math.max(0, ...essais);
  saveResults(ident, { tests: { Saut: { type:'SL_sans_elan', essais_cm: essais, best_cm: best } } });
  alert('Saut enregistré : meilleur = '+best+' cm');
}
document.addEventListener('DOMContentLoaded', ()=>{
  initSaut();
  $('#savesaut').addEventListener('click', saveSaut);
});
