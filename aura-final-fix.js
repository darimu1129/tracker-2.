(function(){
const KEY='boss-creator-v1',GAME='Pokémon Zafiro Alfa — Combates';
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const P=(name,level,ability,item,moves)=>({id:uid(),name,level,ability,item:item||'',moves:moves||[]});
// Exact Aura 295/296/297 teams from the imported combat data.
const variants={
 fire:{label:'🔥 Fuego',pokemon:[P('Swampert',24,'Torrente','Baya Zidra',['Voto Agua','Excavar','Tumba Rocas','Maldición']),P('Munchlax',24,'Sebo','Restos',['Golpe Cuerpo','Bostezo','Triturar','Protección'])]},
 water:{label:'💧 Agua',pokemon:[P('Combusken',24,'Mar Llamas','Baya Zidra',['Voto Fuego','Doble Patada','Golpe Aéreo','Danza Pluma']),P('Munchlax',24,'Sebo','Restos',['Golpe Cuerpo','Bostezo','Triturar','Protección'])]},
 leaf:{label:'🍃 Hoja',pokemon:[P('Grovyle',24,'Espesura','Baya Zidra',['Voto Planta','Golpe Aéreo','Dragoaliento','Silbato']),P('Munchlax',24,'Sebo','Restos',['Golpe Cuerpo','Protección','Bostezo','Relajo'])]}
};
function patch(){try{
 const s=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');const g=s.games?.find(x=>x.name===GAME);if(!g)return;
 let b=g.bosses?.find(x=>x.name==='Aura — 295 / 296 / 297'||x.name==='Aura (295/296/297)');
 if(!b){b={id:uid(),name:'Aura — 295 / 296 / 297',type:'',photo:null,finished:true,activeVariant:'fire',variants,pokemon:variants.fire.pokemon};
   const idx=Math.max(0,g.bosses.findIndex(x=>x.name==='Aura — Tercer combate'));g.bosses.splice(idx<0?Math.min(3,g.bosses.length):idx,0,b);
 }else{b.variants=variants;b.activeVariant=b.activeVariant||'fire';b.pokemon=b.variants[b.activeVariant].pokemon;b.finished=true;}
 localStorage.setItem(KEY,JSON.stringify(s));
}catch(e){console.error('aura-final-fix',e)}}
function buttons(){try{const b=window.currentBoss?.();if(!b?.variants)return;const c=document.querySelector('.content');if(!c||c.querySelector('.aura-final-choice'))return;const box=document.createElement('div');box.className='card aura-final-choice';box.innerHTML='<strong>Equipo de Aura</strong><div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn btn-primary" data-af="fire">🔥 Fuego</button><button class="btn btn-secondary" data-af="water">💧 Agua</button><button class="btn btn-secondary" data-af="leaf">🍃 Hoja</button></div>';c.insertBefore(box,c.firstChild);box.querySelectorAll('[data-af]').forEach(x=>x.onclick=()=>{const s=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}'),g=s.games.find(x=>x.name===GAME),bb=g?.bosses.find(x=>x.id===b.id);if(!bb)return;bb.activeVariant=x.dataset.af;bb.pokemon=bb.variants[x.dataset.af].pokemon;localStorage.setItem(KEY,JSON.stringify(s));location.reload()});}catch(e){console.error(e)}}
patch();
const obs=new MutationObserver(()=>setTimeout(buttons,30));
if(document.body)obs.observe(document.body,{childList:true,subtree:true});setTimeout(buttons,300);setTimeout(buttons,1000);
})();
