let essaisCount = 2; // 2 essais par défaut, 3e optionnel
function initSaut(){
  ensureIdentityOrRedirect();
  const toggle = $('#toggle3'); toggle.addEventListener('change', ()=>{ essaisCount = toggle.checked ? 3 : 2; document.querySelector('[data-e3]').style.display = toggle.checked ? '' : 'none'; calcBest(); });
  ['essai1','essai2','essai3'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input', calcBest); });
  calcBest();
}
function values(){ return [Number($('#essai1').value||0), Number($('#essai2').value||0), essaisCount===3?Number($('#essai3').value||0):0]; }
function calcBest(){ const v = values(); const best = Math.max(0, ...v); $('#best').textContent = best ? best+' cm' : '-'; }
function saveSaut(){ const ident=getCurrentIdentity(); const v=values(); const best=Math.max(0,...v); const kept=v.slice(0,essaisCount); saveResults(ident,{tests:{Saut:{type:'SL_sans_elan', essais_cm: kept, best_cm: best}}}); alert('Saut enregistré : meilleur = '+best+' cm'); }
document.addEventListener('DOMContentLoaded', ()=>{ initSaut(); $('#savesaut').addEventListener('click', saveSaut); });
