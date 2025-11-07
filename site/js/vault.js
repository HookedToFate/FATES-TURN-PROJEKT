const app = document.querySelector('.vault-app');

if (!app) {
  console.warn('Vault app container missing.');
} else {
  const searchInput = app.querySelector('#vault-search');
  const typeSelect = app.querySelector('#vault-type');
  const tagSelect = app.querySelector('#vault-tag');
  const startInput = app.querySelector('#vault-date-start');
  const endInput = app.querySelector('#vault-date-end');
  const resultsList = app.querySelector('[data-results]');
  const feedback = app.querySelector('[data-feedback]');
  const activeTags = app.querySelector('[data-active-tags]');
  const refreshButton = app.querySelector('[data-refresh]');
  const generatorForm = app.querySelector('#generator-form');
  const clearButton = app.querySelector('[data-clear]');
  const outputTextarea = app.querySelector('#note-output');
  const copyButton = app.querySelector('[data-copy]');

  let index = [];
  let availableTags = [];

  init();

  async function init() {
    bindEvents();
    await loadIndex();
    render();
  }

  function bindEvents() {
    searchInput.addEventListener('input', render);
    typeSelect.addEventListener('change', render);
    tagSelect.addEventListener('change', render);
    startInput.addEventListener('change', render);
    endInput.addEventListener('change', render);
    refreshButton.addEventListener('click', async () => {
      await loadIndex(true);
      render();
    });

    generatorForm.addEventListener('submit', handleGenerate);
    clearButton.addEventListener('click', () => {
      generatorForm.reset();
      outputTextarea.value = '';
      copyButton.disabled = true;
      announce('Generator form cleared.');
    });

    copyButton.addEventListener('click', () => {
      copyText(outputTextarea.value, copyButton, 'Note Markdown copied.');
    });
  }

  async function loadIndex(force = false) {
    feedback.textContent = 'Loading notes…';
    try {
      const response = await fetch('../data/vault_index.json' + (force ? `?ts=${Date.now()}` : ''), { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Index request failed: ${response.status}`);
      }
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.notes)) {
        throw new Error('Index missing "notes" array.');
      }
      index = payload.notes;
      availableTags = Array.from(new Set(index.flatMap(note => note.tags ?? []))).sort((a, b) => a.localeCompare(b));
      populateTagOptions();
      announce(`Loaded ${index.length} notes.`);
    } catch (error) {
      index = [];
      availableTags = [];
      populateTagOptions();
      showError(`Could not load vault index: ${error.message}`);
    }
  }

  function populateTagOptions() {
    tagSelect.innerHTML = '<option value="">All tags</option>';
    availableTags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagSelect.append(option);
    });
  }

  function render() {
    if (!index.length) {
      resultsList.innerHTML = '<li class="empty-state">No notes available yet.</li>';
      updateActiveTags();
      return;
    }

    const filters = {
      text: searchInput.value.trim().toLowerCase(),
      type: typeSelect.value,
      tag: tagSelect.value,
      start: startInput.value,
      end: endInput.value
    };

    const filtered = index.filter(note => {
      if (filters.type && note.type !== filters.type) return false;
      if (filters.tag && !(note.tags || []).includes(filters.tag)) return false;
      if (filters.start && note.date < filters.start) return false;
      if (filters.end && note.date > filters.end) return false;
      if (filters.text) {
        const haystack = [note.title, note.excerpt, (note.tags || []).join(' ')].join(' ').toLowerCase();
        if (!haystack.includes(filters.text)) return false;
      }
      return true;
    });

    resultsList.innerHTML = '';
    if (!filtered.length) {
      resultsList.innerHTML = '<li class="empty-state">No matching notes. Adjust filters.</li>';
      updateActiveTags(filters, 0);
      return;
    }

    filtered.sort((a, b) => b.date.localeCompare(a.date));
    filtered.forEach(note => {
      resultsList.appendChild(renderNote(note));
    });
    updateActiveTags(filters, filtered.length);
  }

  function renderNote(note) {
    const item = document.createElement('li');
    item.className = 'note-card';
    item.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p class="note-meta">${escapeHtml(note.date)} · ${escapeHtml(note.type)} · ${escapeHtml(note.path)}</p>
      <p class="note-excerpt">${escapeHtml(note.excerpt ?? '')}</p>
      <div class="note-tags">${renderTags(note.tags)}</div>
    `;
    return item;
  }

  function renderTags(tags) {
    if (!tags || !tags.length) return '';
    return tags.map(tag => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('');
  }

  function updateActiveTags(filters = {}, count = index.length) {
    const badges = [];
    if (filters.type) badges.push(makeBadge(`Type: ${filters.type}`, () => { typeSelect.value = ''; render(); }));
    if (filters.tag) badges.push(makeBadge(`Tag: ${filters.tag}`, () => { tagSelect.value = ''; render(); }));
    if (filters.start) badges.push(makeBadge(`From: ${filters.start}`, () => { startInput.value = ''; render(); }));
    if (filters.end) badges.push(makeBadge(`To: ${filters.end}`, () => { endInput.value = ''; render(); }));
    if (filters.text) badges.push(makeBadge(`Search: "${filters.text}"`, () => { searchInput.value = ''; render(); }));

    if (!badges.length) {
      activeTags.innerHTML = `<span class="tag-chip">${count} note${count === 1 ? '' : 's'} indexed</span>`;
    } else {
      activeTags.innerHTML = '';
      badges.forEach(badge => activeTags.appendChild(badge));
      const countBadge = document.createElement('span');
      countBadge.className = 'tag-chip';
      countBadge.textContent = `${count} result${count === 1 ? '' : 's'}`;
      activeTags.prepend(countBadge);
    }
  }

  function makeBadge(label, onClear) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${label} ✕`;
    button.addEventListener('click', onClear);
    return button;
  }

  function handleGenerate(event) {
    event.preventDefault();
    const formData = new FormData(generatorForm);
    const title = formData.get('title').trim();
    const date = formData.get('date');
    const type = formData.get('type');
    const mood = formData.get('mood').trim();
    const people = parseList(formData.get('people'));
    const place = formData.get('place').trim();
    const tags = parseList(formData.get('tags'));
    const body = formData.get('body').trim();

    if (!title || !date || !type || !body) {
      announce('Please complete required fields.');
      return;
    }

    const slug = slugify(`${date}-${title}`);
    const frontmatter = buildFrontmatter({ title, date, type, mood, people, place, tags });
    const output = `${frontmatter}\n${body}\n`;
    outputTextarea.value = output;
    copyButton.disabled = false;
    announce(`Note ready. Save as data/vault/${slug}.md`);
  }

  function buildFrontmatter({ title, date, type, mood, people, place, tags }) {
    const lines = ['---'];
    lines.push(`title: ${escapeYaml(title)}`);
    lines.push(`date: ${date}`);
    lines.push(`type: ${type}`);
    if (mood) lines.push(`mood: ${escapeYaml(mood)}`);
    if (people.length) lines.push(`people: [${people.map(escapeYaml).join(', ')}]`);
    if (place) lines.push(`place: ${escapeYaml(place)}`);
    if (tags.length) lines.push(`tags: [${tags.map(escapeYaml).join(', ')}]`);
    lines.push('---');
    lines.push('');
    return lines.join('\n');
  }

  function parseList(value) {
    return String(value || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeYaml(value) {
    if (/[:\-?@\[\],{}#&*!\n]/.test(value)) {
      return `'${value.replace(/'/g, "''")}'`;
    }
    return value;
  }

  function copyText(text, button, message) {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      flash(button);
      announce(message);
    }).catch(() => fallbackCopy(text, button, message));
  }

  function fallbackCopy(text, button, message) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', 'readonly');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
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

  function announce(message) {
    if (feedback) feedback.textContent = message || '';
  }

  function showError(message) {
    resultsList.innerHTML = `<li class="empty-state">${escapeHtml(message)}</li>`;
    announce(message);
  }
}
