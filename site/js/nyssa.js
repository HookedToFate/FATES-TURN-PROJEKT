const app = document.querySelector('.nyssa-app');

if (!app) {
  console.warn('Nyssa module container not found.');
} else {
  const feedback = app.querySelector('[data-feedback]');
  const errorBox = app.querySelector('[data-error]');
  const flagsBox = app.querySelector('[data-flags]');
  const proseBox = app.querySelector('[data-prose]');
  const choiceBox = app.querySelector('[data-choices]');
  const oracleOutput = app.querySelector('[data-oracle-card]');
  const exportTextarea = app.querySelector('[data-export]');
  const copyButton = app.querySelector('[data-copy]');
  const backBtn = app.querySelector('[data-action="back"]');
  const forwardBtn = app.querySelector('[data-action="forward"]');
  const resetBtn = app.querySelector('[data-action="reset"]');
  const oracleBtn = app.querySelector('[data-action="oracle"]');
  const exportButton = app.querySelector('[data-action="export"]');

  const STORAGE_KEY = 'nyssa-state-v1';

  let story = null;
  let nodesById = new Map();
  let deck = [];
  let state = {
    history: [],
    index: 0,
    flags: new Set()
  };

  init();

  async function init() {
    setLoading(true);
    bindEvents();
    await Promise.all([loadStory(), loadDeck()]);
    restoreState();
    if (!state.history.length && story?.start) {
      state.history = [story.start];
      state.index = 0;
      state.flags = computeFlags(state.history, state.index);
      persistState();
    }
    render();
    setLoading(false);
  }

  function bindEvents() {
    backBtn.addEventListener('click', () => step(-1));
    forwardBtn.addEventListener('click', () => step(1));
    resetBtn.addEventListener('click', resetAdventure);
    oracleBtn.addEventListener('click', drawOracleAssist);
    exportButton.addEventListener('click', () => {
      copyText(exportTextarea.value, exportButton, 'Adventure Markdown copied.');
    });
    copyButton.addEventListener('click', () => {
      copyText(exportTextarea.value, copyButton, 'Adventure Markdown copied.');
    });
  }

  async function loadStory() {
    try {
      const response = await fetch('../data/nyssa_story.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Story request failed: ${response.status}`);
      story = await response.json();
      if (!story || !Array.isArray(story.nodes)) throw new Error('Story missing nodes array.');
      nodesById = new Map(story.nodes.map(node => [node.id, node]));
    } catch (error) {
      showError(`Could not load story: ${error.message}`);
    }
  }

  async function loadDeck() {
    try {
      const response = await fetch('../data/oracle_deck.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Deck request failed: ${response.status}`);
      const payload = await response.json();
      deck = Array.isArray(payload.cards) ? payload.cards : [];
    } catch (error) {
      deck = [];
      announce('Oracle deck unavailable.');
    }
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.history) && typeof parsed.index === 'number') {
        state.history = parsed.history.filter(id => nodesById.has(id));
        if (!state.history.length) return;
        state.index = Math.min(Math.max(parsed.index, 0), state.history.length - 1);
        state.flags = computeFlags(state.history, state.index);
      }
    } catch (error) {
      console.warn('Could not restore Nyssa state:', error);
    }
  }

  function persistState() {
    try {
      const payload = {
        history: state.history,
        index: state.index
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Persist failed:', error);
    }
  }

  function render() {
    clearError();
    if (!story || !story.nodes || !story.nodes.length) {
      showError('Story data missing. Fix data/nyssa_story.json.');
      return;
    }
    if (!state.history.length) {
      showError('Adventure not initialized.');
      return;
    }
    const nodeId = state.history[state.index];
    const node = nodesById.get(nodeId);
    if (!node) {
      showError(`Story node "${nodeId}" not found.`);
      return;
    }
    renderPassage(node);
    renderChoices(node);
    updateFlags();
    updateHistoryControls();
    exportTextarea.value = buildExportMarkdown();
    copyButton.disabled = !exportTextarea.value.trim();
  }

  function renderPassage(node) {
    const titleHtml = `<h3>${escapeHtml(node.title)}</h3>`;
    const proseHtml = renderMarkdown(node.prose || '');
    proseBox.innerHTML = titleHtml + proseHtml;
  }

  function renderChoices(node) {
    choiceBox.innerHTML = '';
    const list = document.createElement('ul');
    const choices = node.choices || [];
    if (!choices.length) {
      const empty = document.createElement('p');
      empty.className = 'choice-empty';
      empty.textContent = 'No further choices—add more nodes to continue the arc.';
      choiceBox.appendChild(empty);
      return;
    }
    choices.forEach(choice => {
      const li = document.createElement('li');
      li.className = 'choice-item';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = choice.label;
      const requires = choice.requires_flags || node.requires_flags || [];
      const unlocked = checkRequirements(requires);
      if (unlocked) {
        button.addEventListener('click', () => moveTo(choice.to, choice.flags_set));
      } else {
        button.disabled = true;
        button.classList.add('choice-locked');
      }
      li.appendChild(button);
      if (requires.length) {
        const hint = document.createElement('span');
        hint.className = 'choice-hint';
        hint.textContent = unlocked
          ? `Requires: ${requires.join(', ')} (met)`
          : `Requires: ${requires.join(', ')}`;
        li.appendChild(hint);
      }
      list.appendChild(li);
    });
    choiceBox.appendChild(list);
  }

  function checkRequirements(requires = []) {
    if (!requires.length) return true;
    return requires.every(flag => state.flags.has(flag));
  }

  function moveTo(nodeId, extraFlags = []) {
    if (!nodesById.has(nodeId)) {
      showError(`Story node "${nodeId}" not found.`);
      return;
    }
    state.history = state.history.slice(0, state.index + 1);
    state.history.push(nodeId);
    state.index = state.history.length - 1;
    updateFlagsAfterMove(extraFlags);
    persistState();
    render();
    announce(`Moved to ${nodesById.get(nodeId).title}.`);
  }

  function updateFlagsAfterMove(extraFlags = []) {
    const node = nodesById.get(state.history[state.index]);
    const flags = new Set(state.flags);
    (node?.flags_set || []).forEach(flag => flags.add(flag));
    extraFlags?.forEach(flag => flags.add(flag));
    state.flags = flags;
  }

  function computeFlags(history, index) {
    const flags = new Set();
    for (let i = 0; i <= index; i++) {
      const node = nodesById.get(history[i]);
      (node?.flags_set || []).forEach(flag => flags.add(flag));
    }
    return flags;
  }

  function step(direction) {
    const nextIndex = state.index + direction;
    if (nextIndex < 0 || nextIndex >= state.history.length) return;
    state.index = nextIndex;
    state.flags = computeFlags(state.history, state.index);
    persistState();
    render();
    announce(direction < 0 ? 'Went back.' : 'Went forward.');
  }

  function resetAdventure() {
    if (!story?.start) return;
    state.history = [story.start];
    state.index = 0;
    state.flags = computeFlags(state.history, state.index);
    persistState();
    render();
    announce('Adventure reset.');
  }

  function updateFlags() {
    if (!state.flags.size) {
      flagsBox.textContent = 'Flags: none set yet.';
      return;
    }
    const chips = Array.from(state.flags).map(flag => `<span class="flag-chip">${escapeHtml(flag)}</span>`).join(' ');
    flagsBox.innerHTML = `Flags: ${chips}`;
  }

  function updateHistoryControls() {
    backBtn.disabled = state.index <= 0;
    forwardBtn.disabled = state.index >= state.history.length - 1;
  }

  function drawOracleAssist() {
    if (!deck.length) {
      announce('Oracle deck unavailable.');
      return;
    }
    const random = randomFloat();
    const card = deck[Math.floor(random * deck.length)];
    const reversed = randomFloat() < 0.5;
    const meaning = reversed ? card.reversed_meaning : card.upright_meaning;
    oracleOutput.innerHTML = `
      <div class="oracle-card-body">
        <h4>${escapeHtml(card.title)}</h4>
        <p class="orientation">${reversed ? 'Reversed' : 'Upright'}</p>
        <p>${escapeHtml(meaning)}</p>
        <p class="prompt"><span>Prompt:</span> ${escapeHtml(card.prompt_hook)}</p>
      </div>
    `;
    announce(`Oracle assist drew ${card.title}.`);
  }

  function buildExportMarkdown() {
    if (!state.history.length || !story) return '';
    const lines = [`# ${story.story_title || 'Nyssa Adventure'} — Path`, ''];
    for (let i = 0; i <= state.index; i++) {
      const nodeId = state.history[i];
      const node = nodesById.get(nodeId);
      if (!node) continue;
      lines.push(`## Step ${i + 1}: ${node.title}`);
      lines.push('');
      lines.push((node.prose || '').trim());
      lines.push('');
      if (i < state.index) {
        const nextId = state.history[i + 1];
        const choice = (node.choices || []).find(c => c.to === nextId);
        if (choice) {
          lines.push(`- Choice taken: ${choice.label}`);
          lines.push('');
        }
      }
    }
    lines.push(state.flags.size ? `Flags set: ${Array.from(state.flags).join(', ')}` : 'Flags set: none');
    lines.push('');
    return lines.join('\n');
  }

  function renderMarkdown(source) {
    if (typeof source !== 'string') return '<p></p>';
    const html = [];
    const lines = source.split('\n');
    let paragraph = [];
    let listItems = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      const text = paragraph.join(' ').trim();
      if (text) html.push(`<p>${applyInlineFormatting(escapeHtml(text))}</p>`);
      paragraph = [];
    };

    const flushList = () => {
      if (!listItems.length) return;
      const items = listItems.map(item => `<li>${applyInlineFormatting(escapeHtml(item))}</li>`).join('');
      html.push(`<ul>${items}</ul>`);
      listItems = [];
    };

    lines.forEach(line => {
      if (/^\s*[-*]\s+/.test(line)) {
        flushParagraph();
        listItems.push(line.replace(/^\s*[-*]\s+/, '').trim());
      } else if (!line.trim()) {
        flushList();
        flushParagraph();
      } else {
        paragraph.push(line.trim());
      }
    });

    flushList();
    flushParagraph();

    return html.join('') || `<p>${escapeHtml(source)}</p>`;
  }

  function applyInlineFormatting(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function copyText(text, button, successMessage) {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      flash(button);
      announce(successMessage);
    }).catch(() => {
      fallbackCopy(text, button, successMessage);
    });
  }

  function fallbackCopy(text, button, message) {
    try {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'absolute';
      temp.style.left = '-9999px';
      temp.setAttribute('readonly', 'readonly');
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      flash(button);
      announce(message);
    } catch (error) {
      announce('Copy not supported—select text manually.');
    }
  }

  function flash(button) {
    if (!button) return;
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 600);
  }

  function randomFloat() {
    if (window.crypto?.getRandomValues) {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      return buffer[0] / 4294967296;
    }
    return Math.random();
  }

  function announce(message) {
    if (feedback) feedback.textContent = message || '';
  }

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = !message;
    announce(message);
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setLoading(isLoading) {
    if (isLoading) {
      app.setAttribute('data-loading', 'true');
      announce('Loading adventure…');
    } else {
      app.removeAttribute('data-loading');
    }
  }
}
