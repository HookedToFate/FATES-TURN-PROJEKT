const app = document.querySelector('.oracle-app');

if (!app) {
  console.warn('Oracle app container missing.');
} else {
  const cardsContainer = app.querySelector('[data-cards]');
  const drawButtons = Array.from(app.querySelectorAll('[data-draw]'));
  const allowReversedToggle = app.querySelector('#allow-reversed');
  const seedInput = app.querySelector('#seed-date');
  const clearSeedButton = app.querySelector('#clear-seed');
  const feedback = app.querySelector('[data-feedback]');
  const writeButton = app.querySelector('#write-with-this');
  const modal = app.querySelector('#prompt-modal');
  const promptList = app.querySelector('[data-prompts]');
  const promptCopyButton = app.querySelector('[data-copy-prompts]');
  const exportTextarea = app.querySelector('#export-markdown');
  const exportCopyButton = app.querySelector('[data-copy-export]');

  let deck = [];
  let metadata = { deck_name: 'Fate Oracle', version: 1 };
  let currentSpread = [];
  let currentSeed = null;

  init();

  async function init() {
    feedback.textContent = 'Loading deck…';
    try {
      const response = await fetch('../data/oracle_deck.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Deck request failed: ${response.status}`);
      }
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.cards)) {
        throw new Error('Deck file missing "cards" array.');
      }
      deck = payload.cards;
      metadata.deck_name = payload.deck_name ?? metadata.deck_name;
      metadata.version = payload.version ?? metadata.version;
      announce(`Loaded ${deck.length} cards from ${metadata.deck_name}.`);
    } catch (error) {
      deck = [];
      showError(`Could not load deck: ${error.message}`);
    }

    drawButtons.forEach(button => button.addEventListener('click', handleDrawClick));
    clearSeedButton.addEventListener('click', () => {
      seedInput.value = '';
      currentSeed = null;
      announce('Seed cleared. Draw for a fresh spread.');
    });

    allowReversedToggle.addEventListener('change', () => {
      if (currentSpread.length) {
        redrawFromExisting();
      }
    });

    seedInput.addEventListener('change', () => {
      currentSeed = seedInput.value ? formatSeed(seedInput.value) : null;
      if (currentSeed && currentSpread.length) {
        redrawFromExisting();
      } else {
        announce(currentSeed ? 'Seed ready. Draw to lock spread.' : 'Seed cleared.');
      }
    });

    writeButton.addEventListener('click', () => {
      if (!currentSpread.length) return;
      populatePrompts();
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', 'open');
      }
    });

    modal?.addEventListener('close', () => announce('Closed writing prompts.'));
    promptCopyButton.addEventListener('click', () => {
      const prompts = Array.from(promptList.querySelectorAll('p')).map(p => p.textContent.trim()).join('\n\n');
      copyText(prompts, promptCopyButton, 'Prompts copied to clipboard.');
    });

    exportCopyButton.addEventListener('click', () => {
      copyText(exportTextarea.value, exportCopyButton, 'Markdown copied.');
    });
  }

  function handleDrawClick(event) {
    if (!deck.length) {
      showError('Deck not available. Fix data/oracle_deck.json and reload.');
      return;
    }
    const count = Number(event.currentTarget.dataset.draw) || 1;
    const useSeed = seedInput.value ? formatSeed(seedInput.value) : null;
    currentSeed = useSeed;
    currentSpread = drawCards(count, Boolean(allowReversedToggle.checked), useSeed);
    renderSpread();
    renderMarkdown();
    writeButton.disabled = !currentSpread.length;
    exportCopyButton.disabled = !currentSpread.length;
    announce(`Drew ${currentSpread.length} card${currentSpread.length === 1 ? '' : 's'}.`);
  }

  function redrawFromExisting() {
    if (!currentSpread.length) return;
    const count = currentSpread.length;
    currentSpread = drawCards(count, Boolean(allowReversedToggle.checked), currentSeed);
    renderSpread();
    renderMarkdown();
    writeButton.disabled = !currentSpread.length;
    exportCopyButton.disabled = !currentSpread.length;
    announce('Spread updated with new settings.');
  }

  function drawCards(count, allowReversed, seed) {
    const rng = seed ? createSeededRng(seed + ':' + count + ':' + (allowReversed ? 'reversed' : 'upright')) : Math.random;
    const available = [...deck];
    const pulled = [];
    for (let i = 0; i < count && available.length; i += 1) {
      const index = Math.floor(rng() * available.length);
      const card = available.splice(index, 1)[0];
      const reversed = allowReversed ? rng() < 0.5 : false;
      pulled.push({ ...card, reversed });
    }
    return pulled;
  }

  function renderSpread() {
    cardsContainer.innerHTML = '';
    if (!currentSpread.length) {
      cardsContainer.innerHTML = '<p class="empty">Draw cards to see your spread.</p>';
      return;
    }

    currentSpread.forEach((card, index) => {
      const cardEl = document.createElement('article');
      cardEl.className = 'card';
      cardEl.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(card.title)}</h3>
          <span class="card-orientation">${card.reversed ? 'Reversed' : 'Upright'}</span>
        </div>
        <p class="card-meaning">${escapeHtml(card.reversed ? card.reversed_meaning : card.upright_meaning)}</p>
        <p class="card-prompt"><span>Hook:</span> ${escapeHtml(card.prompt_hook)}</p>
        <p class="card-meta">Card ${index + 1} · ${escapeHtml(card.id)}</p>
      `;
      cardsContainer.appendChild(cardEl);
    });
  }

  function populatePrompts() {
    promptList.innerHTML = '';
    if (!currentSpread.length) {
      promptList.innerHTML = '<p>No cards drawn yet.</p>';
      promptCopyButton.disabled = true;
      return;
    }
    promptCopyButton.disabled = false;
    const prompts = buildWritingPrompts(currentSpread);
    prompts.forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      promptList.appendChild(paragraph);
    });
  }

  function buildWritingPrompts(spread) {
    const titles = spread.map(card => card.title);
    const hooks = spread.map(card => card.prompt_hook);
    const moods = spread.map(card => card.reversed ? card.reversed_meaning : card.upright_meaning);
    return [
      `Freewrite how ${joinList(titles)} interact. Let each paragraph respond to: ${hooks[0] ?? 'a surprising spark'}.`,
      `Draft a scene where the energy shifts from "${moods[0] ?? 'uncertainty'}" to "${moods[moods.length - 1] ?? 'resolution'}".`,
      `Describe a character who embodies ${hooks.slice(0, 2).join(' & ') || hooks[0] || 'the spread'} and faces a choice implied by ${titles[titles.length - 1] || 'the final card'}.`
    ];
  }

  function renderMarkdown() {
    if (!currentSpread.length) {
      exportTextarea.value = '';
      return;
    }
    const timestamp = new Date();
    const lines = [
      `# ${metadata.deck_name} Reading`,
      '',
      `- Drawn: ${timestamp.toISOString()}`,
      `- Cards: ${currentSpread.length}`,
      `- Reversed allowed: ${allowReversedToggle.checked ? 'yes' : 'no'}`,
      `- Seed: ${seedInput.value || 'random'}`,
      ''
    ];
    currentSpread.forEach((card, index) => {
      lines.push(`## Card ${index + 1}: ${card.title}`);
      lines.push('');
      lines.push(`- ID: ${card.id}`);
      lines.push(`- Orientation: ${card.reversed ? 'Reversed' : 'Upright'}`);
      lines.push(`- Meaning: ${card.reversed ? card.reversed_meaning : card.upright_meaning}`);
      lines.push(`- Prompt hook: ${card.prompt_hook}`);
      lines.push('');
    });
    const prompts = buildWritingPrompts(currentSpread);
    lines.push('### Writing prompts');
    lines.push('');
    prompts.forEach(prompt => {
      lines.push(`- ${prompt}`);
    });
    lines.push('');
    exportTextarea.value = lines.join('\n');
  }

  function copyText(text, button, message) {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      flashButton(button);
      announce(message);
    }).catch(() => {
      fallbackCopy(text, button, message);
    });
  }

  function fallbackCopy(text, button, message) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'readonly');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      flashButton(button);
      announce(message);
    } catch (error) {
      announce('Copy not supported—select text manually.');
    }
  }

  function flashButton(button) {
    if (!button) return;
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 600);
  }

  function announce(message) {
    if (feedback) feedback.textContent = message;
  }

  function showError(message) {
    announce(message);
    cardsContainer.innerHTML = `<p class="error">${escapeHtml(message)}</p>`;
    writeButton.disabled = true;
    exportCopyButton.disabled = true;
  }

  function createSeededRng(seedString) {
    const hash = Array.from(seedString).reduce((acc, char) => {
      acc = (acc << 5) - acc + char.charCodeAt(0);
      return acc | 0;
    }, 0);
    let state = hash >>> 0;
    return function () {
      state += 0x6D2B79F5;
      let t = state;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function formatSeed(value) {
    return `${metadata.deck_name}:${value}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function joinList(items) {
    if (!items.length) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  }
}
