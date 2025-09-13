// ui-autoinject.js — include this <script> on any page.
// If user chose 'phone' on index, injects same inline overrides here too.
(function(){
  const PREF_KEY='uiMode';
  const phoneCSS = `
  .container{max-width:420px!important}
  h1{font-size:26px!important}
  .btn{padding:12px 14px!important;min-width:140px!important;border-radius:14px!important;font-size:16px!important}
  .grid.cards{grid-template-columns:1fr!important}
  .big-btn{min-width:260px!important;padding:18px 20px!important;font-size:18px!important}
  .card{min-height:auto!important}
  .live{font-size:36px!important;min-width:140px!important}
  `;
  function apply(){
    if((localStorage.getItem(PREF_KEY)||'auto')!=='phone') return;
    if(document.getElementById('ui-phone-overrides')) return;
    const el = document.createElement('style');
    el.id='ui-phone-overrides'; el.textContent = phoneCSS;
    document.head.appendChild(el);
    document.documentElement.setAttribute('data-ui-mode','phone');
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', apply, {once:true});
  }else{
    apply();
  }
})();