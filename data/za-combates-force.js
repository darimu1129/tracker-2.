(async function(){
  const KEY='boss-creator-v1';
  const GAME='Pokémon Zafiro Alfa — Combates';
  try{
    const store=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');
    store.games=(store.games||[]).filter(g=>g.name!==GAME);
    localStorage.setItem(KEY,JSON.stringify(store));
    const r=await fetch('./data/za-combates-final.js?v=force4',{cache:'no-store'});
    const src=await r.text();
    eval(src);
  }catch(e){console.error('No se pudo reconstruir Zafiro Alfa con los equipos del PDF',e)}
})();
