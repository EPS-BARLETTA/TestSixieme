function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

// Fill identity form for two students
function bindDuoIdentity(){
  const d = ensureDuo();
  ['0','1'].forEach(idx=>{
    const e = d.eleves[Number(idx)];
    const root = document.querySelector(`[data-eleve="${idx}"]`);
    root.querySelector('.nom').value = e.Nom||'';
    root.querySelector('.prenom').value = e.Prenom||'';
    root.querySelector('.classe').value = e.Classe||'';
    root.querySelector('.sexe').value = e.Sexe||'';
  });
  document.getElementById('save-duo').addEventListener('click', ()=>{
    const upd = ensureDuo();
    ['0','1'].forEach(idx=>{
      const root = document.querySelector(`[data-eleve="${idx}"]`);
      upd.eleves[Number(idx)] = {
        Nom: (root.querySelector('.nom').value||'').toUpperCase().trim(),
        Prenom: (root.querySelector('.prenom').value||'').trim(),
        Classe: (root.querySelector('.classe').value||'').trim(),
        Sexe: root.querySelector('.sexe').value||''
      };
    });
    saveDuo(upd);
    alert('Identités enregistrées 👍');
  });
}

// Nav helpers
function go(href){ window.location.href = href; }
