(function(){
const KEY='boss-creator-v1', MARK='za-combates-equipos-v3';
try{
 const store=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}'); if(!Array.isArray(store.games)) store.games=[];
 const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
 const team=arr=>arr.map(p=>({id:uid(),name:p.name,level:p.level,ability:p.ability||'',item:p.item||'',moves:p.moves||[]}));
 const findGame=()=>store.games.find(g=>g.name==='Pokémon Zafiro Alfa — Combates');
 const data=[];
 let g=findGame(); if(!g){g={id:uid(),name:'Pokémon Zafiro Alfa — Combates',gen:'Gen 6',bosses:[],importMarker:MARK};store.games.push(g)}
 g.bosses=[];
 data.forEach(x=>{
   if(x.variants){const b={id:uid(),name:'Aura',type:'',photo:null,pokemon:[],finished:true,variants:{}}; Object.entries(x.variants).forEach(([k,v])=>b.variants[k]={label:v.label,pokemon:team(v.pokemon)}); b.pokemon=team(x.variants.water.pokemon); g.bosses.push(b);}
   else g.bosses.push({id:uid(),name:x.name,type:'',photo:null,pokemon:team(x.pokemon),finished:true,variants:null});
 });
 g.importMarker=MARK; localStorage.setItem(KEY,JSON.stringify(store));
 if(!sessionStorage.getItem(MARK+'-reloaded')){sessionStorage.setItem(MARK+'-reloaded','1');location.reload();}
}catch(e){console.error('ZA teams import failed',e)}
})();
