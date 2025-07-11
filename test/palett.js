const baseColors = ['tangerine', 'orchid', 'harbor', 'pool', 'admiral', 'lime', 'gray'];

const tints = ['10', '25', '50', '75'];
const shades = ['10', '25', '50', '75'];

function rgbToHex(rgb) {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  if (!result) return rgb; // fallback if not rgb format
  const r = parseInt(result[1]).toString(16).padStart(2, '0');
  const g = parseInt(result[2]).toString(16).padStart(2, '0');
  const b = parseInt(result[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function createSwatch(className, labelText) {
  const swatch = document.createElement('div');
  swatch.className = 'swatch';

  // Color box
  const colorBox = document.createElement('div');
  colorBox.className = `color-box bg-${className}`;
  colorBox.textContent = labelText;
  swatch.appendChild(colorBox);

  // Hex wrapper and children
  const hexWrapper = document.createElement('div');
  hexWrapper.className = 'hex-wrapper';

  const hexDiv = document.createElement('span');
  hexDiv.className = 'hex-code';
  hexDiv.textContent = '...'; // placeholder
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

  setTimeout(() => {
    const bgColor = getComputedStyle(colorBox).backgroundColor;
    const hex = rgbToHex(bgColor);
    hexDiv.textContent = hex;

    // Copy function
    function copyHex() {
      navigator.clipboard.writeText(hex).then(() => {
        copiedMsg.classList.add('visible');
        setTimeout(() => copiedMsg.classList.remove('visible'), 1500);
      });
    }

    // Add click handlers to both color box and hex wrapper
    colorBox.addEventListener('click', copyHex);
    hexWrapper.addEventListener('click', copyHex);

    // Also set cursor pointer on colorBox and hexWrapper for clarity
    colorBox.style.cursor = 'pointer';
    hexWrapper.style.cursor = 'pointer';
  }, 0);

  return swatch;
}

function createRow(colorName) {
  const row = document.createElement('div');
  row.className = 'palette-row';

  const swatches = document.createElement('div');
  swatches.className = 'swatches';

  const label = document.createElement('h3');
  label.textContent = colorName.charAt(0).toUpperCase() + colorName.slice(1);
  row.appendChild(label);

  const logEntry = {};

  tints.forEach(pct => {
    const className = `${colorName}-tint-${pct}`;
    const swatch = createSwatch(className, `${pct}% Tint`);
    swatches.appendChild(swatch);

    setTimeout(() => {
      const bgColor = getComputedStyle(swatch.querySelector('.color-box')).backgroundColor;
      logEntry[`tint${pct}`] = rgbToHex(bgColor);
    }, 0);
  });

  const baseSwatch = createSwatch(colorName, 'Base');
  swatches.appendChild(baseSwatch);

  setTimeout(() => {
    const bgColor = getComputedStyle(baseSwatch.querySelector('.color-box')).backgroundColor;
    logEntry['base'] = rgbToHex(bgColor);
  }, 0);

  shades.forEach(pct => {
    const className = `${colorName}-shade-${pct}`;
    const swatch = createSwatch(className, `${pct}% Shade`);
    swatches.appendChild(swatch);

    setTimeout(() => {
      const bgColor = getComputedStyle(swatch.querySelector('.color-box')).backgroundColor;
      logEntry[`shade${pct}`] = rgbToHex(bgColor);
    }, 0);
  });

  row.appendChild(swatches);

  return row;
}

function renderPalette() {
  const container = document.getElementById('palette');
  baseColors.forEach(color => {
    container.appendChild(createRow(color));
  });
}

document.addEventListener('DOMContentLoaded', renderPalette);
