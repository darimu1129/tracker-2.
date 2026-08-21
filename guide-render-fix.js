(function(){
  function fillGuide(){
    try{
      const b=window.currentBoss?.();
      if(!b || !b.pokemon?.length || !window.buildGuide) return;
      const slot=document.getElementById('guide');
      if(!slot) return;
      if(slot.dataset.filled==='1' && slot.children.length) return;
      window.buildGuide().then(html=>{
        const s=document.getElementById('guide');
        if(!s || s.dataset.filled==='1') return;
        const tmp=document.createElement('div');
        tmp.innerHTML=html||'';
        const built=tmp.querySelector('#guide');
        if(built){s.replaceWith(built);built.dataset.filled='1';}
      });
    }catch(e){console.error('guide-render-fix',e)}
  }
  const obs=new MutationObserver(()=>setTimeout(fillGuide,20));
  function start(){if(document.body)obs.observe(document.body,{childList:true,subtree:true});fillGuide();setTimeout(fillGuide,300);setTimeout(fillGuide,1000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
