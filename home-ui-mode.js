// home-ui-mode.js — adds one simple button on the landing page (index.html)
// "Optimiser pour téléphone" -> saves preference then reloads
(function(){
  const isHome = /(?:^|\/)index\.html?$/.test(location.pathname) || location.pathname === '/';
  function build(){
    if(document.getElementById('home-ui-mode-banner')) return;
    const wrap = document.createElement('div');
    wrap.id = 'home-ui-mode-banner';
    const card = document.createElement('div');
    card.className = 'card';
    const state = document.createElement('span');
    state.className = 'state';
    const primary = document.createElement('button');
    const alt = document.createElement('button');
    alt.className = 'link'; alt.type = 'button';
    const pref = window.__UIMode__ ? __UIMode__.get() : 'auto';
    if(pref === 'phone'){
      state.textContent = 'Mode téléphone activé ✓';
      primary.textContent = 'Revenir en affichage auto';
      primary.className = 'link';
      primary.addEventListener('click', ()=>{ __UIMode__.clear(); location.reload(); });
      alt.remove();
      card.append(state, primary);
    }else{
      state.textContent = 'Affichage Auto (par défaut)';
      primary.textContent = 'Optimiser pour téléphone';
      primary.className = 'primary';
      primary.type = 'button';
      primary.addEventListener('click', ()=>{ __UIMode__.set('phone'); location.reload(); });
      alt.textContent = 'Laisser en Auto';
      alt.addEventListener('click', ()=>{ __UIMode__.clear(); location.reload(); });
      card.append(state, primary, alt);
    }
    wrap.appendChild(card);
    document.body.prepend(wrap);
  }
  function init(){
    if(!isHome) return;
    if(!window.__UIMode__){
      const iv = setInterval(()=>{
        if(window.__UIMode__){ clearInterval(iv); build(); }
      }, 50);
      setTimeout(()=>clearInterval(iv), 2000);
    }else{
      build();
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();