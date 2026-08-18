(function(){
  const API='https://pokeapi.co/api/v2/pokemon/';
  const LIST='https://pokeapi.co/api/v2/pokemon?limit=2000';
  const MEGAS=new Set(['venusaur-mega','charizard-mega-x','charizard-mega-y','blastoise-mega','beedrill-mega','pidgeot-mega','alakazam-mega','slowbro-mega','gengar-mega','kangaskhan-mega','pinsir-mega','gyarados-mega','aerodactyl-mega','mewtwo-mega-x','mewtwo-mega-y','ampharos-mega','steelix-mega','scizor-mega','heracross-mega','houndoom-mega','tyranitar-mega','sceptile-mega','blaziken-mega','swampert-mega','gardevoir-mega','mawile-mega','aggron-mega','medicham-mega','manectric-mega','banette-mega','absol-mega','latias-mega','latios-mega','rayquaza-mega','lopunny-mega','garchomp-mega','lucario-mega','abomasnow-mega','gallade-mega','audino-mega','sharpedo-mega','camerupt-mega','altaria-mega','metagross-mega','sableye-mega','glalie-mega','diancie-mega','groudon-primal','kyogre-primal']);
  const pretty=s=>s.split('-').map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(' ');
  window.POKEMON_DATA=[];
  const DEX={venusaur:3,charizard:6,blastoise:9,beedrill:15,pidgeot:18,alakazam:65,slowbro:80,gengar:94,kangaskhan:115,pinsir:127,gyarados:130,aerodactyl:142,mewtwo:150,ampharos:181,steelix:208,scizor:212,heracross:214,houndoom:229,tyranitar:248,sceptile:254,blaziken:257,swampert:260,gardevoir:282,mawile:303,aggron:306,medicham:308,manectric:310,banette:354,absol:359,latias:380,latios:381,rayquaza:384,lopunny:428,garchomp:445,lucario:448,abomasnow:460,gallade:475,audino:531,sharpedo:319,camerupt:323,altaria:334,metagross:376,sableye:302,glalie:362,diancie:719,groudon:383,kyogre:382};
  const cache={};
  async function details(name){if(cache[name])return cache[name];try{const r=await fetch(API+encodeURIComponent(name));const d=await r.json();let stats=d.stats.map(x=>x.base_stat);const pv=(d.past_stats||[]).find(x=>x.generation?.name==='generation-viii');if(pv?.stats?.length)stats=pv.stats.map(x=>x.base_stat);const out={name:pretty(d.name),id:d.id,slug:d.name,type:d.types.map(x=>pretty(x.type.name)).join(' / '),abilities:d.abilities.map(x=>x.ability.name),stats};cache[name]=out;return out}catch{return null}}
  window.POKEMON_RUNTIME={details,cache};
  fetch(LIST).then(r=>r.json()).then(async data=>{
    const opts=[];
    for(const m of data.results){
      const id=Number(m.url.split('/').filter(Boolean).pop());
      if((id>=1&&id<=721)||MEGAS.has(m.name)){
        const display=pretty(m.name);
        const base=MEGAS.has(m.name)?DEX[m.name.split('-')[0]]:id;
        opts.push({name:display,id:base||id,slug:m.name});
      }
    }
    window.POKEMON_DATA=opts;
    if(typeof render==='function')render();
  });
  document.addEventListener('change',async e=>{
    if(e.target?.id!=='pokeName')return;
    const typed=e.target.value.trim();const opt=window.POKEMON_DATA.find(x=>x.name===typed);if(!opt)return;
    const d=await details(opt.slug);if(!d)return;d.id=opt.id;
    const idx=window.POKEMON_DATA.findIndex(x=>x.name===typed);if(idx>=0)window.POKEMON_DATA[idx]=d;
    const s=document.getElementById('pokeAbility');if(s)s.innerHTML='<option value="">Selecciona habilidad</option>'+d.abilities.map(a=>`<option>${a}</option>`).join('');
  });
})();
