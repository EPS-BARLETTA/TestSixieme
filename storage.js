// Simple storage helpers for TestSixieme
const STORAGE_KEY_CURRENT = 'tests6e.current';
const STORAGE_KEY_RESULTS = 'tests6e.results';

// Get current identity
function getCurrentIdentity(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT) || 'null'); } catch { return null; }
}
function setCurrentIdentity(ident){
  localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(ident));
}
// Results are stored as a map keyed by slug "Nom|Prenom|Classe|Sexe"
function keyFromIdent(ident){
  if(!ident) return null;
  return [ident.Nom||'', ident.Prenom||'', ident.Classe||'', ident.Sexe||''].join('|');
}
function getAllResults(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_RESULTS) || '{}'); } catch { return {}; }
}
function saveResults(ident, partial){
  const key = keyFromIdent(ident);
  if(!key) return;
  const all = getAllResults();
  all[key] = Object.assign({eleve: ident, tests:{}}, all[key]||{}, partial? {tests: Object.assign({}, (all[key]||{}).tests||{}, partial.tests||{})} : {});
  localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(all));
}
function getResultsFor(ident){
  const key = keyFromIdent(ident);
  const all = getAllResults();
  return all[key] || {eleve: ident, tests:{}};
}

// Build single QR payload for current identity
function buildQrPayload(ident){
  const res = getResultsFor(ident);
  return {
    app: 'Aptitudes6e',
    version: 1,
    eleve: ident,
    tests: res.tests,
    meta: { date: new Date().toISOString().slice(0,10), source: 'TestSixieme' }
  };
}

// Navigation helpers
function ensureIdentityOrRedirect(){
  const ident = getCurrentIdentity();
  if(!ident || !ident.Nom || !ident.Prenom || !ident.Classe || !ident.Sexe){
    window.location.href = 'tests.html';
  }
  return ident;
}
