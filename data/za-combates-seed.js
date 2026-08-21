(function(){
  const KEY='boss-creator-v1';
  const MARK='za-combates-cargados-v1';
  try{
    const store=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');
    if(!Array.isArray(store.games)) store.games=[];
    if(store.games.some(g=>g.importMarker===MARK)) return;
    const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
    const names=[
      'Aura','Petra','Marcial','Aura','Blasco','Erico','Silvina','Silvina','Aquiles','Candela','Norman','Matías','Silvina','Aura','Alana','Matías','Aura','Matías','Vito y Leti','Aquiles','Plubio','Blasco','Sixto','Fátima','Nívea','Dracón','Máximo'
    ];
    const bosses=names.map(name=>({id:uid(),name,type:'',photo:null,pokemon:[],finished:false,variants:null}));
    // Aura aparece tres veces en la historia, pero debe ser un único boss con tres rutas de inicial.
    const auraIndexes=[0,3,13,16];
    const aura=bosses[auraIndexes[0]];
    aura.name='Aura';
    aura.variants={fire:{label:'🔥 Fuego',pokemon:[]},water:{label:'💧 Agua',pokemon:[]},leaf:{label:'🍃 Hoja',pokemon:[]}};
    bosses.splice(auraIndexes[3],1);
    bosses.splice(auraIndexes[2]-1,1);
    bosses.splice(auraIndexes[1]-2,1);
    const game={id:uid(),name:'Pokémon Zafiro Alfa — Combates',gen:'Gen 6',bosses,importMarker:MARK};
    store.games.push(game);
    localStorage.setItem(KEY,JSON.stringify(store));
  }catch(e){console.warn('No se pudo cargar la partida de combates de Zafiro Alfa',e)}
})();
