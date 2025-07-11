const baseColors = {
  tangerine: '#fbaf45',
  orchid: '#bf4097',
  harbor: '#0d84c7',
  pool: '#42c4dd',
  admiral: '#4d4c68',
  lime: '#c0d730',
  gray: '#4d4d4d'
};

const tints = [10, 25, 50, 75];
const shades = [10, 25, 50, 75];

function hexToRgba(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b, a: 1 };
}

function rgbaToHex({ r, g, b }) {
  const toHex = n => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function sassColorMix(color1, color2, weightPercent) {
  const p = weightPercent / 100;
  const w = p * 2 - 1;
  const a = color2.a - color1.a;
  const w1 = ((w * a === -1) ? w : (w + a) / (1 + w * a) + 1) / 2;
  const w2 = 1 - w1;

  const r = Math.round(color2.r * w1 + color1.r * w2);
  const g = Math.round(color2.g * w1 + color1.g * w2);
  const b = Math.round(color2.b * w1 + color1.b * w2);
  const alpha = color1.a * (1 - p) + color2.a * p;

  return rgbaToHex({ r, g, b, a: alpha });
}

let paletteContainer, checkerContainer, hexInput;

function renderPalette() {
  paletteContainer.innerHTML = '';
  Object.entries(baseColors).forEach(([name, hex]) => {
    paletteContainer.appendChild(createRow(name, hex));
  });
}

function createSwatch(colorHex, labelText) {
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

function createRow(colorName, baseHex) {
  const row = document.createElement('div');
  row.className = 'palette-row';

  const label = document.createElement('h3');
  label.style.position = 'relative';
  label.textContent = colorName.charAt(0).toUpperCase() + colorName.slice(1);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = '×';
  delBtn.title = 'Delete color';
  delBtn.style.position = 'absolute';
  delBtn.style.right = '0';
  delBtn.style.top = '0';
  delBtn.style.border = 'none';
  delBtn.style.background = 'transparent';
  delBtn.style.color = '#999';
  delBtn.style.fontSize = '1.2rem';
  delBtn.style.cursor = 'pointer';
  delBtn.style.userSelect = 'none';
  delBtn.style.padding = '0 6px';
  delBtn.style.lineHeight = '1';
  delBtn.style.fontWeight = 'bold';

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Delete the color "${colorName}"?`)) {
      delete baseColors[colorName];
      renderPalette();
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

function createModal() {
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  const modal = document.createElement('div');
  modal.id = 'modal-box';
  modal.style.backgroundColor = 'white';
  modal.style.padding = '1.5rem 2rem';
  modal.style.borderRadius = '6px';
  modal.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  modal.style.minWidth = '280px';
  modal.style.maxWidth = '90vw';
  modal.style.textAlign = 'center';

  const promptLabel = document.createElement('label');
  promptLabel.htmlFor = 'color-name-input';
  promptLabel.textContent = 'Enter Color Name:';
  promptLabel.style.display = 'block';
  promptLabel.style.marginBottom = '0.5rem';
  promptLabel.style.fontWeight = 'bold';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'color-name-input';
  input.style.width = '100%';
  input.style.padding = '0.4rem 0.6rem';
  input.style.fontSize = '1rem';
  input.style.marginBottom = '1rem';
  input.autocomplete = 'off';

  const btnWrapper = document.createElement('div');
  btnWrapper.style.display = 'flex';
  btnWrapper.style.justifyContent = 'space-between';

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.style.flex = '1';
  okBtn.style.marginRight = '0.5rem';
  okBtn.style.padding = '0.5rem';
  okBtn.style.fontWeight = 'bold';
  okBtn.style.cursor = 'pointer';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.flex = '1';
  cancelBtn.style.padding = '0.5rem';
  cancelBtn.style.cursor = 'pointer';

  btnWrapper.appendChild(okBtn);
  btnWrapper.appendChild(cancelBtn);

  modal.appendChild(promptLabel);
  modal.appendChild(input);
  modal.appendChild(btnWrapper);
  overlay.appendChild(modal);

  document.body.appendChild(overlay);

  return { overlay, modal, input, okBtn, cancelBtn };
}

document.addEventListener('DOMContentLoaded', () => {
  paletteContainer = document.getElementById('palette');
  checkerContainer = document.getElementById('color-checker');
  const checkBtn = document.querySelector('.btn-check');
  const addBtn = document.querySelector('.btn-add');
  hexInput = document.getElementById('hex-code');
  const colorPicker = document.getElementById('color-picker');

  // Trigger check on Enter key
  hexInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkBtn.click();
    }
  });

  // *** Added: When user selects a color from the color picker ***
  colorPicker.addEventListener('input', () => {
    const hex = colorPicker.value;
    hexInput.value = hex;
    checkBtn.click();
  });

  checkBtn.addEventListener('click', () => {
    const input = hexInput.value.trim();
    const hex = input.startsWith('#') ? input : `#${input}`;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      alert('Please enter a valid 6-digit hex color.');
      return;
    }

    checkerContainer.innerHTML = '';
    checkerContainer.appendChild(createRow('Preview', hex));
  });

  addBtn.addEventListener('click', () => {
    const input = hexInput.value.trim();
    const hex = input.startsWith('#') ? input : `#${input}`;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      alert('Please enter a valid 6-digit hex color.');
      return;
    }

    const { overlay, input: modalInput, okBtn, cancelBtn } = createModal();

    modalInput.value = '';
    modalInput.focus();

    function cleanUp() {
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      document.body.removeChild(overlay);
    }

    function onOk() {
      const name = modalInput.value.trim();
      if (!name) {
        alert('Please enter a valid color name.');
        return;
      }
      let keyName = name.toLowerCase().replace(/\s+/g, '-');
      let originalKey = keyName;
      let counter = 1;
      while (baseColors.hasOwnProperty(keyName)) {
        keyName = `${originalKey}-${counter++}`;
      }
      baseColors[keyName] = hex;
      renderPalette();
      checkerContainer.innerHTML = '';
      hexInput.value = '';
      cleanUp();
    }

    function onCancel() {
      cleanUp();
    }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
  });

  renderPalette();
});
