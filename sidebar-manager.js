(function(){
  const KEY='boss-creator-v1';
  function enhance(){
    const list=document.querySelector('.save-list');
    if(!list)return;
    list.querySelectorAll('.save-item').forEach(item=>{
      if(item.querySelector('.save-delete'))return;
      const gameId=item.dataset.game;
      const del=document.createElement('span');
      del.className='save-delete';
      del.title='Borrar partida';
      del.setAttribute('role','button');
      del.setAttribute('tabindex','0');
      del.textContent='×';
      del.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        try{
          const store=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');
          const game=store.games.find(g=>g.id===gameId);
          if(!game)return;
          if(!confirm('¿Borrar la partida "'+game.name+'"? Esta acción no se puede deshacer.'))return;
          store.games=store.games.filter(g=>g.id!==gameId);
          localStorage.setItem(KEY,JSON.stringify(store));
          location.reload();
        }catch(err){console.error(err);alert('No se pudo borrar la partida.');}
      });
      del.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();del.click();}});
      item.appendChild(del);
    });
  }
  const obs=new MutationObserver(enhance);
  obs.observe(document.body,{childList:true,subtree:true});
  enhance();
})();
