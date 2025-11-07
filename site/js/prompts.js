const app = document.querySelector('.prompts-app');

if (!app) {
  console.warn('Prompt module container not found.');
} else {
  const sourceInput = app.querySelector('#prompts-source');
  const generateButton = app.querySelector('#prompts-generate');
  const clearButton = app.querySelector('#prompts-clear');
  const bundleButton = app.querySelector('[data-copy-bundle]');
  const promptCards = Array.from(app.querySelectorAll('.prompt-card'));

  init();

  function init() {
    generateButton.addEventListener('click', () => updatePrompts(sourceInput.value, { silent: false }));
    sourceInput.addEventListener('input', event => updatePrompts(event.target.value, { silent: true }));
    sourceInput.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        updatePrompts(sourceInput.value, { silent: false });
      }
    });
    clearButton.addEventListener('click', () => {
      sourceInput.value = '';
      updatePrompts('', { silent: true });
      announce('Input cleared.');
      sourceInput.focus();
    });

    promptCards.forEach(card => {
      const button = card.querySelector('[data-copy-target]');
      button.addEventListener('click', () => copyPrompt(card));
    });

    bundleButton.addEventListener('click', () => {
      const prompts = promptCards
        .map(card => card.querySelector('[data-text]').textContent.trim())
        .filter(text => text && !text.startsWith('Enter an idea'));
      if (!prompts.length) return;
      copyText(prompts.join('\n\n'), bundleButton, 'Prompt bundle copied.');
    });

    updatePrompts('', { silent: true });
  }

  function updatePrompts(rawIdea, options = {}) {
    const idea = String(rawIdea || '').trim();
    const hasIdea = idea.length > 0;
    promptCards.forEach(card => {
      const type = card.dataset.output;
      const textNode = card.querySelector('[data-text]');
      const prompt = hasIdea ? buildPrompt(type, idea) : 'Enter an idea to generate a prompt.';
      textNode.textContent = prompt;
    });
    bundleButton.disabled = !hasIdea;
    if (!options.silent) {
      announce(hasIdea ? 'Prompt bundle refreshed.' : 'Waiting for an idea.');
    }
  }

  function buildPrompt(type, idea) {
    switch (type) {
      case 'brainstorm':
        return `List five unexpected directions this idea could take, especially where "${idea}" meets a contrasting influence.`;
      case 'reframe':
        return `Recast "${idea}" from the viewpoint of someone who misunderstands it at first—what changes their mind?`;
      case 'constraint':
        return `Write a scene about "${idea}" using only two locations, a ten-minute window, and a single sensory motif.`;
      case 'playful':
        return `Turn "${idea}" into a playful challenge or game the characters invent together.`;
      default:
        return idea;
    }
  }

  function copyPrompt(card) {
    const text = card.querySelector('[data-text]').textContent;
    if (!text || /Enter an idea/.test(text)) return;
    const button = card.querySelector('[data-copy-target]');
    copyText(text, button, `${card.querySelector('h3').textContent} copied.`);
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
      announce('Copy not supported. Select the text manually.');
    }
  }

  function flash(button) {
    if (!button) return;
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 600);
  }

  function announce(message) {
    const status = app.querySelector('[data-feedback]');
    if (status) status.textContent = message || '';
  }
}
