// Prof Luc-Léger with PIN 57 and fullscreen; long beep on stage change
let running=false, palier=1, shuttle=1, lastTs=0, secondsLeft=0, secPerShuttle=0, raf=null;
function vmaFromPalier(p){ return 8.5 + 0.5*p; }
function secPerShuttleFromV(vkmh){ const v=vkmh*1000/3600; return 20/v; }
function shortBeep(){ try{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sine'; o.frequency.value=900; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.35,ctx.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.22); o.start(); o.stop(ctx.currentTime+.24);}catch{} }
function longBeep(){ try{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sine'; o.frequency.value=600; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.5,ctx.currentTime+.02); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.6); o.start(); o.stop(ctx.currentTime+.62);}catch{} }
function initLL(){ palier=1; shuttle=1; secPerShuttle=secPerShuttleFromV(vmaFromPalier(palier)); secondsLeft=secPerShuttle; updateLL(); }
function updateLL(){ const vma=vmaFromPalier(palier); document.getElementById('palier').textContent=palier; document.getElementById('navette').textContent=shuttle; document.getElementById('vma').textContent=vma.toFixed(1)+' km/h'; document.getElementById('bipdans').textContent=secondsLeft.toFixed(1)+' s'; document.getElementById('sec20').textContent=secPerShuttle.toFixed(1)+' s / 20 m'; document.getElementById('bar').style.width = Math.max(0,Math.min(100,(1-secondsLeft/secPerShuttle)*100))+'%'; }
function loop(ts){ if(!running) return; const dt=(ts-lastTs)/1000; lastTs=ts; secondsLeft-=dt; if(secondsLeft<=0){ // shuttle done
  const navettesInPalier=Math.max(1,Math.round(60/secPerShuttle));
  if(shuttle>=navettesInPalier){ palier+=1; shuttle=1; secPerShuttle=secPerShuttleFromV(vmaFromPalier(palier)); secondsLeft=secPerShuttle; longBeep(); } else { shuttle+=1; secondsLeft=secPerShuttle; shortBeep(); }
  updateLL();
} updateLL(); raf=requestAnimationFrame(loop); }
function toggleRun(){ if(!running){ running=true; lastTs=performance.now(); document.getElementById('startbtn').textContent='Pause'; raf=requestAnimationFrame(loop);} else { running=false; document.getElementById('startbtn').textContent='Démarrer'; } }
function reinitLL(){ running=false; palier=1; shuttle=1; secPerShuttle=secPerShuttleFromV(vmaFromPalier(palier)); secondsLeft=secPerShuttle; updateLL(); document.getElementById('startbtn').textContent='Démarrer'; }
function fullscreen(){ const el=document.documentElement; if(el.requestFullscreen) el.requestFullscreen(); }
document.addEventListener('DOMContentLoaded', ()=>{
  // PIN modal
  const overlay=document.getElementById('overlay'); const input=document.getElementById('pin'); const goBtn=document.getElementById('go');
  goBtn.addEventListener('click', ()=>{ if(input.value==='57'){ overlay.style.display='none'; initLL(); } else { alert('Code incorrect'); } });
  document.getElementById('startbtn').addEventListener('click', toggleRun);
  document.getElementById('reinitbtn').addEventListener('click', reinitLL);
  document.getElementById('fsbtn').addEventListener('click', fullscreen);
});
