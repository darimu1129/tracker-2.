(function(){
  const KEY='boss-creator-v1';
  const GAME='Pokémon Zafiro Alfa — Combates';
  const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
  const P=(name,level,ability,item,moves)=>({id:uid(),name,level,ability,item,moves});
  const teams={
    fire:[P('Swellow',22,'Intrépido','Pañuelo Seda',['Pájaro Osado','Veloc. Extrema','Foco Energía','Doble Equipo']),P('Shroomish',22,'Pies Rápidos','Semilla Milagro',['Recurrente','Golpe Cabeza','Tóxico','Drenadoras']),P('Ponyta',22,'Cuerpo Llama','Carbón',['Nitrocarga','Doble Patada','Hipnosis','Pisotón']),P('Marshtomp',24,'Torrente','Baya Zidra',['Voto Agua','Excavar','Tumba Rocas','Maldición']),P('Munchlax',24,'Sebo','Restos',['Golpe Cuerpo','Bostezo','Triturar','Protección'])],
    water:[P('Swellow',22,'Intrépido','Pañuelo Seda',['Pájaro Osado','Veloc. Extrema','Foco Energía','Doble Equipo']),P('Ponyta',22,'Cuerpo Llama','Carbón',['Nitrocarga','Doble Patada','Pisotón','Hipnosis']),P('Wailmer',22,'Velo Agua','Agua Mística',['Hidropulso','Desenrollar','Golpe Cuerpo','Fisura']),P('Grovyle',24,'Espesura','Baya Zidra',['Voto Planta','Golpe Aéreo','Dragoaliento','Silbato']),P('Munchlax',24,'Sebo','Restos',['Golpe Cuerpo','Protección','Bostezo','Relajo'])],
    leaf:[P('Swellow',22,'Intrépido','Pañuelo Seda',['Pájaro Osado','Veloc. Extrema','Foco Energía','Doble Equipo']),P('Wailmer',22,'Velo Agua','Agua Mística',['Hidropulso','Desenrollar','Golpe Cuerpo','Fisura']),P('Shroomish',22,'Pies Rápidos','Semilla Milagro',['Recurrente','Tóxico','Golpe Cabeza','Drenadoras']),P('Combusken',24,'Mar Llamas','Baya Zidra',['Voto Fuego','Doble Patada','Golpe Aéreo','Danza Pluma']),P('Munchlax',24,'Sebo','Restos',['Golpe Cuerpo','Bostezo','Triturar','Protección'])]
  };
  function ensure(){
    let s; try{s=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}')}catch{return}
    const g=s.games?.find(x=>x.name===GAME); if(!g)return;
    let b=g.bosses?.find(x=>x.name==='Aura — 295 / 296 / 297' || x.name==='Aura (295/296/297)');
    if(!b){b={id:uid(),name:'Aura — 295 / 296 / 297',type:'',photo:null,finished:true,activeVariant:'fire',variants:{fire:{pokemon:teams.fire},water:{pokemon:teams.water},leaf:{pokemon:teams.leaf}},pokemon:teams.fire};g.bosses.splice(Math.min(3,g.bosses.length),0,b)}
    else {b.variants={fire:{pokemon:teams.fire},water:{pokemon:teams.water},leaf:{pokemon:teams.leaf}};b.activeVariant=b.activeVariant||'fire';b.pokemon=b.variants[b.activeVariant].pokemon}
    localStorage.setItem(KEY,JSON.stringify(s));
  }
  function paint(){
    const b=window.currentBoss?.(); if(!b)return;
    const content=document.querySelector('.content'); if(!content)return;
    if(b.variants && !content.querySelector('.aura-variants')){
      const box=document.createElement('div');box.className='card aura-variants';
      box.innerHTML='<strong>Equipo de Aura</strong><div class="aura-choice"><button class="btn btn-primary" data-aura-choice="fire">🔥 Fuego</button><button class="btn btn-secondary" data-aura-choice="water">💧 Agua</button><button class="btn btn-secondary" data-aura-choice="leaf">🍃 Hoja</button></div>';
      content.insertBefore(box,content.firstChild);
      box.querySelectorAll('[data-aura-choice]').forEach(btn=>btn.onclick=()=>{const k=btn.dataset.auraChoice;const s=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');const g=s.games.find(x=>x.name===GAME);const bb=g?.bosses.find(x=>x.id===b.id);if(!bb)return;bb.activeVariant=k;bb.pokemon=bb.variants[k].pokemon;localStorage.setItem(KEY,JSON.stringify(s));location.reload()});
    }
    if(window.state?.screen==='boss' || document.querySelector('.crumb')?.textContent?.includes('›')){
      if(!document.getElementById('guide') && window.buildGuide){window.buildGuide().then(html=>{const c=document.querySelector('.content');if(c&&!document.getElementById('guide')&&html)c.insertAdjacentHTML('beforeend',html)})}
    }
  }
  ensure();
  const obs=new MutationObserver(()=>setTimeout(paint,0));
  if(document.body)obs.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(paint,100));
  setTimeout(paint,300);
})();
