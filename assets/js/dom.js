import { tints, shades, hexToRgba, sassColorMix, baseColors } from './core.js';

export function createSwatch(colorHex, labelText) {
  const swatch = document.createElement('div');
  swatch.className = 'swatch';

  const colorBox = document.createElement('div');
  colorBox.className = 'color-box';
  colorBox.textContent = labelText;
  colorBox.style.backgroundColor = colorHex;
  swatch.appendChild(colorBox);

  const hexWrapper = document.createElement('div');
  hexWrapper.className = 'hex-wrapper';

  const hexDiv = document.createElement('span');
  hexDiv.className = 'hex-code';
  hexDiv.textContent = colorHex;
  hexWrapper.appendChild(hexDiv);

  const copyIcon = document.createElement('span');
  copyIcon.className = 'copy-icon';
  copyIcon.textContent = '📋';
  hexWrapper.appendChild(copyIcon);

  const copiedMsg = document.createElement('span');
  copiedMsg.className = 'copied-message';
  copiedMsg.textContent = 'Copied!';
  hexWrapper.appendChild(copiedMsg);

  swatch.appendChild(hexWrapper);

  function copyHex() {
    navigator.clipboard.writeText(colorHex).then(() => {
      copiedMsg.classList.add('visible');
      setTimeout(() => copiedMsg.classList.remove('visible'), 1500);
    });
  }

  colorBox.addEventListener('click', copyHex);
  hexWrapper.addEventListener('click', copyHex);
  colorBox.style.cursor = 'pointer';
  hexWrapper.style.cursor = 'pointer';

  return swatch;
}

export function createRow(colorName, baseHex, container) {
  const row = document.createElement('div');
  row.className = 'palette-row';

  const label = document.createElement('h3');
  label.style.position = 'relative';
  label.textContent = colorName.charAt(0).toUpperCase() + colorName.slice(1);

  const delBtn = document.createElement('button');
  delBtn.textContent = '×';
  delBtn.title = 'Delete color';
  Object.assign(delBtn.style, {
    position: 'absolute', right: '0', top: '0', border: 'none',
    background: 'transparent', color: '#999', fontSize: '1.2rem',
    cursor: 'pointer', userSelect: 'none', padding: '0 6px',
    lineHeight: '1', fontWeight: 'bold'
  });

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Delete the color "${colorName}"?`)) {
      delete baseColors[colorName];
      renderPalette(container);
    }
  });

  label.appendChild(delBtn);
  row.appendChild(label);

  const swatches = document.createElement('div');
  swatches.className = 'swatches';

  const baseColorRgba = hexToRgba(baseHex);
  const white = { r: 255, g: 255, b: 255, a: 1 };
  const black = { r: 0, g: 0, b: 0, a: 1 };

  const logEntry = {};

  tints.forEach(p => {
    const pct = Math.round(100 - p);
    const color = sassColorMix(baseColorRgba, white, pct);
    const label = `${p}% Tint`;
    logEntry[`tint${p}`] = color;
    swatches.appendChild(createSwatch(color, label));
  });

  logEntry['base'] = baseHex;
  swatches.appendChild(createSwatch(baseHex, 'Base'));

  shades.forEach(p => {
    const pct = Math.round(p);
    const color = sassColorMix(baseColorRgba, black, pct);
    const label = `${pct}% Shade`;
    logEntry[`shade${pct}`] = color;
    swatches.appendChild(createSwatch(color, label));
  });

  console.log(`${colorName} =`, logEntry);

  row.appendChild(swatches);
  return row;
}

export function createModal() {
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: '1000'
  });

  const modal = document.createElement('div');
  modal.id = 'modal-box';
  Object.assign(modal.style, {
    backgroundColor: 'white', padding: '1.5rem 2rem',
    borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    minWidth: '280px', maxWidth: '90vw', textAlign: 'center'
  });

  const promptLabel = document.createElement('label');
  promptLabel.htmlFor = 'color-name-input';
  promptLabel.textContent = 'Enter Color Name:';
  Object.assign(promptLabel.style, {
    display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'
  });

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'color-name-input';
  Object.assign(input.style, {
    width: '100%', padding: '0.4rem 0.6rem',
    fontSize: '1rem', marginBottom: '1rem'
  });

  const btnWrapper = document.createElement('div');
  btnWrapper.style.display = 'flex';
  btnWrapper.style.justifyContent = 'space-between';

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  Object.assign(okBtn.style, {
    flex: '1', marginRight: '0.5rem', padding: '0.5rem',
    fontWeight: 'bold', cursor: 'pointer'
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  Object.assign(cancelBtn.style, {
    flex: '1', padding: '0.5rem', cursor: 'pointer'
  });

  btnWrapper.appendChild(okBtn);
  btnWrapper.appendChild(cancelBtn);

  modal.appendChild(promptLabel);
  modal.appendChild(input);
  modal.appendChild(btnWrapper);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  return { overlay, modal, input, okBtn, cancelBtn };
}

export function renderPalette(container) {
  container.innerHTML = '';
  Object.entries(baseColors).forEach(([name, hex]) => {
    container.appendChild(createRow(name, hex, container));
  });
}
