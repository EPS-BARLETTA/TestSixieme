// Common UI helpers
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

function bindIdentityForm(root=document){
  const nom = root.querySelector('#nom');
  const prenom = root.querySelector('#prenom');
  const classe = root.querySelector('#classe');
  const sexe = root.querySelector('#sexe');
  const saveBtn = root.querySelector('#save-identite');
  const ident = getCurrentIdentity() || {Nom:'', Prenom:'', Classe:'', Sexe:''};
  if(nom) nom.value = ident.Nom||'';
  if(prenom) prenom.value = ident.Prenom||'';
  if(classe) classe.value = ident.Classe||'';
  if(sexe) sexe.value = ident.Sexe||'';

  if(saveBtn){
    saveBtn.addEventListener('click', ()=>{
      const upd = { Nom: nom.value.trim().toUpperCase(), Prenom: prenom.value.trim(), Classe: classe.value.trim(), Sexe: sexe.value };
      setCurrentIdentity(upd);
      const badge = document.querySelector('#ident-badge');
      if(badge){ badge.textContent = `${upd.Prenom} ${upd.Nom} · ${upd.Classe} · ${upd.Sexe||''}`; }
      alert('Identité enregistrée 👍');
    });
  }
}

function renderIdentityBadge(){
  const ident = getCurrentIdentity();
  const badge = document.querySelector('#ident-badge');
  if(badge && ident){
    badge.textContent = `${ident.Prenom||''} ${ident.Nom||''} · ${ident.Classe||''} · ${ident.Sexe||''}`;
  }
}
document.addEventListener('DOMContentLoaded', renderIdentityBadge);
