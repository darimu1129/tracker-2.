/* Boss Creator picker improvements: Pokémon, abilities and items are real selectors. */
(() => {
  const API = 'https://pokeapi.co/api/v2/';
  const cache = { abilities: null, items: null };
  const pretty = s => String(s || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  async function loadAbilities() {
    if (cache.abilities) return cache.abilities;
    const generations = await Promise.all(Array.from({length: 7}, (_, i) =>
      fetch(`${API}generation/${i + 1}`).then(r => r.json())
    ));
    const map = new Map();
    generations.forEach(g => (g.abilities || []).forEach(a => map.set(a.name, a)));
    cache.abilities = [...map.keys()].sort((a,b) => a.localeCompare(b));
    return cache.abilities;
  }

  async function loadItems() {
    if (cache.items) return cache.items;
    // Generation VII's item index ends at 930; filtering the API's global list
    // avoids hundreds of individual requests while excluding later-generation items.
    const data = await fetch(`${API}item?limit=2000`).then(r => r.json());
    cache.items = (data.results || [])
      .map(x => ({ name: x.name, id: Number(x.url.split('/').filter(Boolean).pop()) }))
      .filter(x => x.id > 0 && x.id <= 930)
      .sort((a,b) => a.id - b.id);
    return cache.items;
  }

  function pokemonSelect(old) {
    const list = window.POKEMON_DATA || [];
    const options = list.map(p => `<option value="${esc(p.name)}" ${p.name === old ? 'selected' : ''}>${esc(p.name)}${p.form ? ` — ${esc(p.form)}` : ''}</option>`).join('');
    return `<select id="pokeName" required><option value="">Selecciona un Pokémon...</option>${options}</select>`;
  }

  async function enhance() {
    const modal = document.querySelector('.modal-backdrop.open .modal');
    if (!modal) return;

    const poke = document.getElementById('pokeName');
    if (poke && poke.tagName !== 'SELECT') {
      const old = poke.value;
      poke.outerHTML = pokemonSelect(old);
    }

    const ability = document.getElementById('pokeAbility');
    if (ability && !ability.dataset.allAbilities) {
      ability.dataset.allAbilities = 'loading';
      try {
        const selected = ability.value;
        const abilities = await loadAbilities();
        ability.innerHTML = `<option value="">Selecciona una habilidad...</option>` + abilities.map(a => `<option value="${esc(a)}" ${a === selected ? 'selected' : ''}>${esc(pretty(a))}</option>`).join('');
        ability.dataset.allAbilities = 'true';
      } catch {
        ability.dataset.allAbilities = '';
      }
    }

    const item = document.getElementById('pokeItem');
    if (item && item.tagName !== 'SELECT') {
      const old = item.value;
      item.outerHTML = `<select id="pokeItem"><option value="">Sin objeto</option></select>`;
      const select = document.getElementById('pokeItem');
      select.dataset.items = 'loading';
      try {
        const items = await loadItems();
        select.innerHTML = `<option value="">Sin objeto</option>` + items.map(x => `<option value="${esc(x.name)}" ${x.name === old ? 'selected' : ''}>${esc(pretty(x.name))}</option>`).join('');
        select.dataset.items = 'true';
      } catch {
        select.dataset.items = '';
      }
    }
  }

  const observer = new MutationObserver(() => enhance());
  observer.observe(document.body, { childList: true, subtree: true });
  enhance();
})();
