// home-ui-mode.js v2 — injects a tiny inline link in the actions row
(function(){
  function buildInline(){
    const actions = document.getElementById('actions-row') || document.querySelector('.section-center div[style*="justify-content:center"]');
    if(!actions || actions.querySelector('[data-ui-mini]')) return;
    const pref = window.__UIMode__ ? __UIMode__.get() : 'auto';
    if(pref === 'phone'){
      const back = document.createElement('a');
      back.href = '#'; back.dataset.uiMini = '1';
      back.className = 'ui-mode-mini';
      back.textContent = 'Revenir en auto';
      back.addEventListener('click', (e)=>{ e.preventDefault(); __UIMode__.clear(); location.reload(); });
      const state = document.createElement('span');
      state.className = 'ui-mode-mini'; state.dataset.uiMini = '1';
      state.textContent = '📱 Téléphone ✓';
      actions.append(state, back);
    }else{
      const opt = document.createElement('a');
      opt.href = '#'; opt.dataset.uiMini = '1';
      opt.className = 'ui-mode-mini primary';
      opt.textContent = '📱 Optimiser pour téléphone';
      opt.addEventListener('click', (e)=>{ e.preventDefault(); __UIMode__.set('phone'); location.reload(); });
      const keep = document.createElement('a');
      keep.href = '#'; keep.dataset.uiMini = '1';
      keep.className = 'ui-mode-mini';
      keep.textContent = 'Laisser en auto';
      keep.addEventListener('click', (e)=>{ e.preventDefault(); __UIMode__.clear(); location.reload(); });
      actions.append(opt, keep);
    }
  }
  function init(){
    if(!window.__UIMode__){
      const iv = setInterval(()=>{ if(window.__UIMode__){ clearInterval(iv); buildInline(); } }, 50);
      setTimeout(()=>clearInterval(iv),2000);
    }else{
      buildInline();
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();