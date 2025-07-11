import { baseColors } from './core.js';
import { renderPalette, createRow, createModal } from './dom.js';

export function registerEvents() {
  const paletteContainer = document.getElementById('palette');
  const checkerContainer = document.getElementById('color-checker');
  const checkBtn = document.querySelector('.btn-check');
  const addBtn = document.querySelector('.btn-add');
  const hexInput = document.getElementById('hex-code');
  const colorPicker = document.getElementById('color-picker');
  const emailBtn = document.querySelector('.btn-email');

  renderPalette(paletteContainer);

  hexInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkBtn.click();
  });

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
      renderPalette(paletteContainer);
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

  emailBtn.addEventListener('click', () => {
    const email = 'dyates@greenvillelibrary.org';
    const subject = encodeURIComponent('Color Test - new hex codes');

    const bodyLines = ['New Hex Codes for the Public Website'];
    for (const [name, hex] of Object.entries(baseColors)) {
      bodyLines.push(`${name}: ${hex}`);
    }
    const body = encodeURIComponent(bodyLines.join('\n\n'));

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  });
}
