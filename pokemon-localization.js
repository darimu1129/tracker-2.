(()=>{
  const API='https://pokeapi.co/api/v2/';
  const cache=JSON.parse(localStorage.getItem('pokemon-es-cache')||'{}');
  const save=()=>localStorage.setItem('pokemon-es-cache',JSON.stringify(cache));
  const slug=s=>String(s||'').trim().toLowerCase().replace(/ /g,'-');
  async function names(kind,name){
    const key=kind+':'+slug(name); if(!name)return name;
    if(cache[key])return cache[key];
    try{
      const r=await fetch(API+kind+'/'+encodeURIComponent(slug(name))); if(!r.ok)return name;
      const d=await r.json(); const n=d.names?.find(x=>x.language?.name==='es')?.name;
      if(n){cache[key]=n;save();return n}
    }catch{}
    return name;
  }
  async function translateGuide(){
    const root=document.getElementById('guide'); if(!root)return;
    const jobs=[];
    root.querySelectorAll('[data-move-name]').forEach(el=>jobs.push(names('move',el.dataset.moveName).then(n=>el.textContent=n)));
    root.querySelectorAll('[data-ability-name]').forEach(el=>jobs.push(names('ability',el.dataset.abilityName).then(n=>el.textContent=n)));
    root.querySelectorAll('[data-item-name]').forEach(el=>jobs.push(names('item',el.dataset.itemName).then(n=>el.textContent=n)));
    await Promise.all(jobs);
  }
  function translateStaticText(){
    document.querySelectorAll('.guide-detail [data-ability-name],.guide-detail [data-item-name]').forEach(()=>{});
    translateGuide();
  }
  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){const r=oldRender.apply(this,arguments);setTimeout(translateStaticText,50);return r};
  }
  const obs=new MutationObserver(()=>{clearTimeout(window.__pokeEsTimer);window.__pokeEsTimer=setTimeout(translateStaticText,80)});
  obs.observe(document.body,{childList:true,subtree:true});
  window.PokemonES={names,translateGuide,cache};
})();
