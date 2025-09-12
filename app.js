
// App State persisted in localStorage
const LS_KEY = "testsixieme.state.v1";

const defaultState = {
  eleves: [
    { nom:"", prenom:"", classe:"", sexe:"", endurance_palier:null, vma:null, vitesse_s: null, vitesse_kmh: null, saut_cm: null },
    { nom:"", prenom:"", classe:"", sexe:"", endurance_palier:null, vma:null, vitesse_s: null, vitesse_kmh: null, saut_cm: null },
  ],
  // Flags for completed tests
  done: { endurance:false, vitesse:false, saut:false },
  // class log to allow scanning many pairs in a row
  historique: [] // each item will be {timestamp, eleves:[{...},{...}]}
};

function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if(!s) return structuredClone(defaultState);
    // ensure shape
    return Object.assign(structuredClone(defaultState), s);
  }catch(e){
    console.warn("State load error", e);
    return structuredClone(defaultState);
  }
}

function saveState(s){
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

function resetState(soft=false){
  const s = loadState();
  if(soft){
    s.done = { endurance:false, vitesse:false, saut:false };
    s.eleves.forEach(e => {
      e.endurance_palier = null; e.vma = null;
      e.vitesse_s = null; e.vitesse_kmh = null;
      e.saut_cm = null;
    });
    saveState(s);
  }else{
    localStorage.removeItem(LS_KEY);
  }
}

function setEleve(idx, data){
  const s = loadState();
  s.eleves[idx] = Object.assign({}, s.eleves[idx], data);
  saveState(s);
}

function markDone(testKey, val=true){
  const s = loadState();
  s.done[testKey] = !!val;
  saveState(s);
}

function allIdentityFilled(){
  const s = loadState();
  return s.eleves.every(e => e.nom && e.prenom && e.classe && e.sexe);
}

// Utils
function vmaFromPalier(p){ // per guide: starts 8.5 km/h at palier 1, +0.5 each minute
  if(p==null) return null;
  const n = Number(p);
  if(!Number.isFinite(n) || n<1) return null;
  return +(8.5 + 0.5*(n-1)).toFixed(1);
}

function vitesseKmHFromSeconds(t_s){ // 30m in seconds -> km/h
  if(t_s==null) return null;
  const t = Number(t_s);
  if(!Number.isFinite(t) || t<=0) return null;
  const kmh = 108 / t; // 0.03 km / (t/3600) = 108 / t
  return +kmh.toFixed(1);
}

function cmInt(x){
  const n = Math.round(Number(x));
  return Number.isFinite(n) && n>0 ? n : null;
}

// Navigation guards: prevent leaving menu until identities are set
function guardMenuAccess(){
  if(!allIdentityFilled()){
    alert("Renseignez NOM, PRÉNOM, CLASSE, SEXE pour les deux élèves avant d'accéder aux tests.");
    location.href = "saisie.html";
  }
}

function guardQRAccess(){
  const s = loadState();
  if(!(s.done.endurance && s.done.vitesse && s.done.saut)){
    alert("Les 3 tests doivent être complétés pour générer le QR code.");
    location.href = "menu-tests.html";
  }
}

// Populate identity form if present
function mountIdentiteForm(){
  const s = loadState();
  ["0","1"].forEach(i=>{
    const e = s.eleves[+i];
    ["nom","prenom","classe","sexe"].forEach(k=>{
      const el = document.querySelector(`[name="${k}${i}"]`);
      if(el){ el.value = e[k] ?? ""; }
    });
  });
}

function handleIdentiteSubmit(ev){
  ev.preventDefault();
  const form = ev.target;
  const data = [0,1].map(i=>{
    return {
      nom: form[`nom${i}`].value.trim().toUpperCase(),
      prenom: form[`prenom${i}`].value.trim(),
      classe: form[`classe${i}`].value.trim().toUpperCase(),
      sexe: form[`sexe${i}`].value
    }
  });
  if(data.some(d=>!d.nom || !d.prenom || !d.classe || !d.sexe)){
    alert("Merci de compléter les 4 champs pour les DEUX élèves.");
    return;
  }
  const s = loadState();
  s.eleves[0] = Object.assign(s.eleves[0], data[0]);
  s.eleves[1] = Object.assign(s.eleves[1], data[1]);
  saveState(s);
  location.href = "menu-tests.html";
}

// Helpers for test pages
function mountEnduranceForm(){
  guardMenuAccess();
  const s = loadState();
  [0,1].forEach(i=>{
    const e = s.eleves[i];
    const palier = e.endurance_palier ?? "";
    const vma = e.vma ?? "";
    const palierEl = document.querySelector(`[name="palier${i}"]`);
    const vmaEl = document.querySelector(`#vma${i}`);
    if(palierEl){ palierEl.value = palier; }
    if(vmaEl){ vmaEl.textContent = vma ? vma + " km/h" : "—"; }
  });
}

function submitEndurance(ev){
  ev.preventDefault();
  const form = ev.target;
  const paliers = [0,1].map(i => form[`palier${i}`].value.trim());
  if(paliers.some(x=>!x)){
    alert("Renseignez le DERNIER PALIER ENTENDU pour les deux élèves (Entend. Luc Léger).");
    return;
  }
  [0,1].forEach(i=>{
    const p = parseInt(paliers[i],10);
    const v = vmaFromPalier(p);
    setEleve(i, { endurance_palier: p, vma: v });
    const vmaEl = document.querySelector(`#vma${i}`);
    if(vmaEl){ vmaEl.textContent = v ? v+" km/h" : "—"; }
  });
  markDone("endurance", true);
  alert("Endurance enregistrée ✅");
}

function mountVitesseForm(){
  guardMenuAccess();
  const s = loadState();
  [0,1].forEach(i=>{
    const e = s.eleves[i];
    const t = e.vitesse_s ?? "";
    const input = document.querySelector(`[name="t${i}"]`);
    const v = e.vitesse_kmh;
    if(input) input.value = t ? String(t) : "";
    const out = document.querySelector(`#kmh${i}`);
    if(out) out.textContent = v ? v + " km/h" : "—";
  });
}

function submitVitesse(ev){
  ev.preventDefault();
  const f = ev.target;
  const t0 = f["t0"].value.trim();
  const t1 = f["t1"].value.trim();
  if(!t0 || !t1) { alert("Entrez le temps (en s) pour les DEUX élèves."); return; }
  [t0,t1].forEach((t,i)=>{
    const sec = Number(t.replace(",", "."));
    const kmh = vitesseKmHFromSeconds(sec);
    setEleve(i, { vitesse_s: +sec.toFixed(1), vitesse_kmh: kmh });
    const out = document.querySelector(`#kmh${i}`);
    if(out) out.textContent = kmh ? kmh + " km/h" : "—";
  });
  markDone("vitesse", true);
  alert("Vitesse enregistrée ✅");
}

function mountSautForm(){
  guardMenuAccess();
  const s = loadState();
  [0,1].forEach(i=>{
    const e = s.eleves[i];
    const cm = e.saut_cm ?? "";
    const input = document.querySelector(`[name="cm${i}"]`);
    if(input) input.value = cm ? String(cm) : "";
  });
}

function submitSaut(ev){
  ev.preventDefault();
  const f = ev.target;
  const c0 = f["cm0"].value.trim();
  const c1 = f["cm1"].value.trim();
  if(!c0 || !c1) { alert("Entrez la distance (en cm) pour les DEUX élèves."); return; }
  const n0 = cmInt(c0), n1 = cmInt(c1);
  if(n0==null || n1==null){ alert("Distances invalides. Utilisez des nombres entiers en centimètres."); return; }
  setEleve(0, { saut_cm:n0 });
  setEleve(1, { saut_cm:n1 });
  markDone("saut", true);
  alert("Saut enregistré ✅");
}

// Timer utilities for Vitesse page (no overlap)
let timerInterval=null, timerStart=null;
function startTimer(outputSel, btnStartSel, btnStopSel){
  const out=document.querySelector(outputSel), bS=document.querySelector(btnStartSel), bP=document.querySelector(btnStopSel);
  if(timerInterval) return;
  timerStart = performance.now();
  bS.disabled = true; bP.disabled=false;
  timerInterval = setInterval(()=>{
    const t = (performance.now()-timerStart)/1000;
    out.textContent = t.toFixed(1)+" s";
  }, 50);
}

function stopTimer(outputSel, inputSel, btnStartSel, btnStopSel){
  const out=document.querySelector(outputSel), inp=document.querySelector(inputSel), bS=document.querySelector(btnStartSel), bP=document.querySelector(btnStopSel);
  if(!timerInterval) return;
  clearInterval(timerInterval); timerInterval=null;
  const t = (performance.now()-timerStart)/1000;
  out.textContent = t.toFixed(1)+" s";
  inp.value = t.toFixed(1);
  bS.disabled=false; bP.disabled=true;
}

// QR generation
function buildQRPayload(){
  const s = loadState();
  const now = new Date().toISOString();
  const payload = {
    source: "TestSixieme",
    version: "1.0.0",
    createdAt: now,
    eleves: s.eleves.map(e => ({
      "Nom": e.nom,
      "Prénom": e.prenom,
      "Classe": e.classe,
      "Sexe": e.sexe,
      "VMA": e.vma,
      "Vitesse": e.vitesse_kmh,
      "Saut": e.saut_cm
    }))
  };
  return payload;
}

function canGenerateQR(){
  const s = loadState();
  return allIdentityFilled() && s.done.endurance && s.done.vitesse && s.done.saut;
}

function generateQR(){
  if(!canGenerateQR()){
    alert("Identité + 3 tests requis pour générer le QR.");
    return;
  }
  const data = buildQRPayload();
  const el = document.getElementById("qrcode");
  el.innerHTML = "";
  const qr = new QRCode(el, { text: JSON.stringify(data), width: 220, height: 220 });
  // also append to historique (class log)
  const s = loadState();
  s.historique.push({ timestamp: Date.now(), eleves: structuredClone(s.eleves) });
  // reset tests for next pair but keep identities so prof can scan QR then change identities if needed
  s.done = { endurance:false, vitesse:false, saut:false };
  // Optionally clear test fields to prep next pair:
  s.eleves.forEach(e => { e.endurance_palier=null; e.vma=null; e.vitesse_s=null; e.vitesse_kmh=null; e.saut_cm=null; });
  saveState(s);
  // export JSON preview
  document.getElementById("jsonOut").textContent = JSON.stringify(data, null, 2);
}

function copyJSON(){
  const t = document.getElementById("jsonOut").textContent;
  navigator.clipboard.writeText(t).then(()=>alert("JSON copié ✅"));
}

function clearAll(){
  if(confirm("Tout effacer (identités, tests, historique) ?")){
    resetState(false);
    location.href = "index.html";
  }
}

// Tiny router helpers for nav buttons
function go(p){ location.href = p; }
