function $(s){return document.querySelector(s)};
function bindIdentityForm(root=document){
  const ident = getCurrentIdentity() || {Nom:'', Prenom:'', Classe:'', Sexe:''};
  const nom = root.querySelector('#nom'); const prenom = root.querySelector('#prenom'); const classe = root.querySelector('#classe'); const sexe = root.querySelector('#sexe');
  if(nom) nom.value = ident.Nom||''; if(prenom) prenom.value = ident.Prenom||''; if(classe) classe.value = ident.Classe||''; if(sexe) sexe.value = ident.Sexe||'';
  const btn = root.querySelector('#save-identite');
  if(btn){ btn.addEventListener('click', ()=>{ const upd={Nom:nom.value.trim().toUpperCase(), Prenom:prenom.value.trim(), Classe:classe.value.trim(), Sexe:sexe.value}; setCurrentIdentity(upd); renderIdentityBadge(); alert('Identité enregistrée 👍'); })}
}
function renderIdentityBadge(){ const b=$('#ident-badge'); const id=getCurrentIdentity(); if(b && id){ b.textContent = `${id.Prenom||''} ${id.Nom||''} · ${id.Classe||''} · ${id.Sexe||''}`; } }
document.addEventListener('DOMContentLoaded', renderIdentityBadge);
