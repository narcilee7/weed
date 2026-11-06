/**
 * hex → OKLCH converter. Source of truth for the OKLCH values in tokens.css.
 * Usage: node scripts/hex-to-oklch.mjs '#13110f' '#252f3d' ...
 */
const m = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToOklch(hex) {
  const h = hex.replace('#', '');
  const r = srgbToLinear(parseInt(h.slice(0, 2), 16));
  const g = srgbToLinear(parseInt(h.slice(2, 4), 16));
  const b = srgbToLinear(parseInt(h.slice(4, 6), 16));
  const l = 0.2104542553 * (m[0][0] * r + m[0][1] * g + m[0][2] * b) ** (1 / 3)
    + 0.7936177850 * (m[1][0] * r + m[1][1] * g + m[1][2] * b) ** (1 / 3)
    - 0.0040720468 * (m[2][0] * r + m[2][1] * g + m[2][2] * b) ** (1 / 3);
  const a = 1.9779984951 * (m[0][0] * r + m[0][1] * g + m[0][2] * b) ** (1 / 3)
    - 2.4285922050 * (m[1][0] * r + m[1][1] * g + m[1][2] * b) ** (1 / 3)
    + 0.4505937099 * (m[2][0] * r + m[2][1] * g + m[2][2] * b) ** (1 / 3);
  const bb = 0.0259040371 * (m[0][0] * r + m[0][1] * g + m[0][2] * b) ** (1 / 3)
    + 0.7827717662 * (m[1][0] * r + m[1][1] * g + m[1][2] * b) ** (1 / 3)
    - 0.8086757660 * (m[2][0] * r + m[2][1] * g + m[2][2] * b) ** (1 / 3);
  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `${hex}  oklch(${l.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

for (const hex of process.argv.slice(2)) {
  console.log(hexToOklch(hex));
}
