// Luc-Léger logic (computed timings from official parameters)
// Vitesse palier (km/h) = 8.5 + 0.5 * palier
// Durée palier ~ 60 s ; bips toutes les (20 / v(m/s)) s ; navettes = round(60 / secPerShuttle)
let running=false, palier=1, shuttle=1, lastTs=null, secondsLeft=0, secPerShuttle=0, raf=null;

function vmaFromPalier(p){ return 8.5 + 0.5 * p; }
function secPerShuttleFromVkmh(vkmh){ const v = vkmh*1000/3600; return 20 / v; }

function initLL(){
  const ident = ensureIdentityOrRedirect();
  palier = 1; shuttle = 1;
  secPerShuttle = secPerShuttleFromVkmh(vmaFromPalier(palier));
  secondsLeft = secPerShuttle;
  updateUI();
}

function updateUI(){
  const vma = vmaFromPalier(palier);
  $('#palier').textContent = palier;
  $('#navette').textContent = shuttle;
  $('#vma').textContent = vma.toFixed(1)+' km/h';
  $('#bipdans').textContent = secondsLeft.toFixed(1)+' s';
  $('#sec20').textContent = secPerShuttle.toFixed(1)+' s / 20 m';
  const pct = Math.max(0, Math.min(100, (1 - secondsLeft / secPerShuttle)*100));
  $('#bar').style.width = pct+'%';
}

function beep(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type='sine'; o.frequency.value=880; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.22);
    o.start(); o.stop(ctx.currentTime+0.24);
  }catch{}
}

function loop(ts){
  if(!running){ return; }
  const dt = (ts - lastTs)/1000; lastTs = ts;
  secondsLeft -= dt;
  if(secondsLeft<=0){
    beep();
    // prochaine navette ou prochain palier
    const navettesInPalier = Math.max(1, Math.round(60 / secPerShuttle));
    if(shuttle >= navettesInPalier){
      palier += 1;
      shuttle = 1;
      secPerShuttle = secPerShuttleFromVkmh(vmaFromPalier(palier));
      secondsLeft = secPerShuttle;
    } else {
      shuttle += 1;
      secondsLeft = secPerShuttle;
    }
    updateUI();
  }
  updateUI();
  raf = requestAnimationFrame(loop);
}

function startLL(){
  if(running) { running=false; return; }
  running = true;
  lastTs = performance.now();
  raf = requestAnimationFrame(loop);
  $('#startbtn').textContent = 'Pause';
}
function pauseLL(){
  running=false;
  $('#startbtn').textContent = 'Démarrer';
}
function toggleRun(){
  running ? pauseLL() : startLL();
}
function reinitLL(){
  running=false; palier=1; shuttle=1;
  secPerShuttle = secPerShuttleFromVkmh(vmaFromPalier(palier));
  secondsLeft = secPerShuttle;
  updateUI();
  $('#startbtn').textContent = 'Démarrer';
}

function stopAtCurrentPalier(){
  // Save endurance result for current identity
  const ident = getCurrentIdentity();
  const vma = vmaFromPalier(palier);
  saveResults(ident, { tests: { Endurance: { type:'LucLeger20m', palier: palier, vma_kmh: Number(vma.toFixed(1)) } } });
  alert('Endurance enregistré : palier '+palier+' (VMA '+vma.toFixed(1)+' km/h)');
}

document.addEventListener('DOMContentLoaded', ()=>{
  initLL();
  $('#startbtn').addEventListener('click', toggleRun);
  $('#reinitbtn').addEventListener('click', reinitLL);
  $('#stopbtn').addEventListener('click', stopAtCurrentPalier);
});
