const STORAGE_KEY_CURRENT = 'tests6e.current';
const STORAGE_KEY_RESULTS = 'tests6e.results';

function getCurrentIdentity(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT)||'null'); } catch { return null; } }
function setCurrentIdentity(ident){ localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(ident)); }
function keyFromIdent(ident){ return [ident.Nom||'', ident.Prenom||'', ident.Classe||'', ident.Sexe||''].join('|'); }
function getAllResults(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY_RESULTS)||'{}'); } catch { return {}; } }
function saveResults(ident, partial){
  const k = keyFromIdent(ident); if(!k) return;
  const all = getAllResults();
  const prev = all[k] || {eleve: ident, tests:{}};
  all[k] = { eleve: ident, tests: {...prev.tests, ...(partial.tests||{})} };
  localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(all));
}
function getResultsFor(ident){ const k = keyFromIdent(ident); const all = getAllResults(); return all[k] || {eleve: ident, tests:{}}; }
function buildQrPayload(ident){ const res = getResultsFor(ident); return { app:'Aptitudes6e', version:1, eleve: ident, tests: res.tests, meta:{date:new Date().toISOString().slice(0,10), source:'TestSixieme'} }; }
function ensureIdentityOrRedirect(){ const ident = getCurrentIdentity(); if(!ident||!ident.Nom||!ident.Prenom||!ident.Classe||!ident.Sexe){ window.location.href='tests.html'; } return ident; }
