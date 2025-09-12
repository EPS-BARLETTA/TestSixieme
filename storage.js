// Duo storage model
const KEY_DUO = 'ts6e.duo';

function getDuo(){ try { return JSON.parse(localStorage.getItem(KEY_DUO) || 'null'); } catch { return null; } }
function saveDuo(duo){ localStorage.setItem(KEY_DUO, JSON.stringify(duo)); }
function ensureDuo(){ let d=getDuo(); if(!d){ d={ eleves:[{Nom:'',Prenom:'',Classe:'',Sexe:''},{Nom:'',Prenom:'',Classe:'',Sexe:''}], tests:{ Endurance:[null,null], Saut:[null,null], Vitesse:[null,null] } }; saveDuo(d); } return getDuo(); }
function identOK(i){ const e=ensureDuo().eleves[i]; return e && e.Nom && e.Prenom && e.Classe && e.Sexe; }

// Build ScanProf-compatible payload: two students
function buildQrPayload(){
  const d = ensureDuo();
  const pack = d.eleves.map((e,i)=>{
    const t = d.tests;
    const node = { app:'Aptitudes6e', version:1,
      eleve: { Nom:e.Nom, Prenom:e.Prenom, Classe:e.Classe, Sexe:e.Sexe },
      tests: {}
    };
    if(t.Endurance[i]) node.tests.Endurance = t.Endurance[i];
    if(t.Saut[i]) node.tests.Saut = t.Saut[i];
    if(t.Vitesse[i]) node.tests.Vitesse = t.Vitesse[i];
    return node;
  });
  return { pack, meta:{ date:new Date().toISOString().slice(0,10), source:'TestSixieme' } };
}
