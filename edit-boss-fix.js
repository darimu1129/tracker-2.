(()=>{
  const KEY='boss-creator-v1';
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function findContext(){
    const hs=[...document.querySelectorAll('h2')];
    const bossTitle=hs.find(h=>h.textContent.trim() && h.closest('.section-title'))?.textContent.trim();
    const crumb=document.querySelector('.crumb')?.textContent.trim()||'';
    const gameName=crumb.split('›')[0].trim();
    if(!bossTitle||!gameName)return null;
    const store=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');
    const game=store.games.find(g=>g.name===gameName);
    const boss=game?.bosses.find(b=>b.name===bossTitle);
    return game&&boss?{store,game,boss}:null;
  }
  function openEditor(ctx){
    const old=document.getElementById('boss-edit-fix-modal'); if(old)old.remove();
    const modal=document.createElement('div'); modal.id='boss-edit-fix-modal'; modal.className='modal-backdrop open';
    modal.innerHTML=`<div class="modal"><h2>Editar boss</h2><div class="grid grid-2"><div class="field"><label>Tipo</label><select id="fixBossType"><option>Elite Four / Campeón</option><option>Líder de Gimnasio</option><option>Rival</option><option>Equipo Enemigo</option></select></div><div class="field"><label>Nombre</label><input id="fixBossName" value="${esc(ctx.boss.name)}"></div></div><div class="field" style="margin-top:14px"><label>Foto del boss</label><input id="fixBossPhoto" type="file" accept="image/*"><div id="fixPhotoPreview" class="file-preview">${ctx.boss.photo?`<img src="${ctx.boss.photo}" alt="">`:'Selecciona una imagen (opcional)'}</div></div><div class="actions"><button class="btn btn-secondary" id="fixCancel">Cancelar</button><button class="btn btn-primary" id="fixSave">Guardar cambios</button></div></div>`;
    document.body.appendChild(modal);
    document.getElementById('fixBossType').value=ctx.boss.type||'Rival';
    document.getElementById('fixCancel').onclick=()=>modal.remove();
    document.getElementById('fixBossPhoto').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{modal.dataset.photo=r.result;document.getElementById('fixPhotoPreview').innerHTML=`<img src="${r.result}" alt="">`};r.readAsDataURL(f)};
    document.getElementById('fixSave').onclick=()=>{const name=document.getElementById('fixBossName').value.trim();if(!name)return alert('Pon un nombre al boss');ctx.boss.name=name;ctx.boss.type=document.getElementById('fixBossType').value;if(modal.dataset.photo)ctx.boss.photo=modal.dataset.photo;localStorage.setItem(KEY,JSON.stringify(ctx.store));location.reload()};
  }
  document.addEventListener('click',e=>{const btn=e.target.closest('[data-action="edit-boss"]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();const ctx=findContext();if(ctx)openEditor(ctx);},true);
})();
