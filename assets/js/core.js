export const baseColors = {
  tangerine: '#fbaf45',
  orchid: '#bf4097',
  harbor: '#0d84c7',
  pool: '#42c4dd',
  admiral: '#4d4c68',
  lime: '#c0d730',
  gray: '#4d4d4d',
};

export const tints = [10, 25, 50, 75];
export const shades = [10, 25, 50, 75];

export function hexToRgba(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b, a: 1 };
}

export function rgbaToHex({ r, g, b }) {
  const toHex = n => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function sassColorMix(color1, color2, weightPercent) {
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
