// ui-mode.js — core apply/remember logic
(function(){
  const PREF_KEY = 'uiMode'; // 'auto' | 'phone'
  function apply(mode){
    const html = document.documentElement;
    if(mode === 'phone'){ html.setAttribute('data-ui-mode','phone'); }
    else{ html.removeAttribute('data-ui-mode'); }
  }
  function init(){ apply(localStorage.getItem(PREF_KEY) || 'auto'); }
  window.__UIMode__ = {
    set(mode){ localStorage.setItem(PREF_KEY, mode); apply(mode); },
    get(){ return (localStorage.getItem(PREF_KEY) || 'auto'); },
    clear(){ localStorage.removeItem(PREF_KEY); apply('auto'); }
  };
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();