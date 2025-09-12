document.addEventListener('DOMContentLoaded', ()=>{
  const d=ensureDuo();
  const ok0=identOK(0), ok1=identOK(1);
  if(!(ok0 && ok1)){ alert('Complétez l’identité de 2 élèves.'); window.location.href='identite.html'; }
  const pre=document.getElementById('json');
  const gen=()=>{ const payload=buildQrPayload(); pre.textContent=JSON.stringify(payload,null,2); const node=document.getElementById('qrcode'); node.innerHTML=''; new QRCode(node,{text:JSON.stringify(payload),width:260,height:260}); };
  document.getElementById('gen').addEventListener('click', gen);
  gen(); // auto
});
