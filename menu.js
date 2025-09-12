document.addEventListener('DOMContentLoaded', ()=>{
  const d = ensureDuo();
  const ok0 = identOK(0), ok1 = identOK(1);
  if(!(ok0 && ok1)){ alert('Complétez l’identité de 2 élèves.'); window.location.href='identite.html'; }
  document.getElementById('to-endu').addEventListener('click', ()=>go('endu-saisie.html'));
  document.getElementById('to-saut').addEventListener('click', ()=>go('saut-saisie.html'));
  document.getElementById('to-vitesse').addEventListener('click', ()=>go('vitesse-saisie.html'));
  document.getElementById('to-prof').addEventListener('click', ()=>go('prof-luc-leger.html'));
  document.getElementById('to-qr').addEventListener('click', ()=>go('qr.html'));
});
