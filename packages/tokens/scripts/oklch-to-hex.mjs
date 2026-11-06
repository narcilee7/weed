/**
 * OKLCH → hex converter. The inverse of hex-to-oklch.mjs.
 * Usage: node scripts/oklch-to-hex.mjs 'oklch(0.145 0.004 67.5)' 'oklch(0.31 0.012 252)'
 *
 * Used to keep the anchor hex in tokens.json truthful: design in hex,
 * store in OKLCH, never lose the trace back to the design tool.
 */
function oklchToHex(input) {
  const m = input.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i
  );
  if (!m) throw new Error(`not an oklch() value: ${input}`);

  const pct = (v) => (v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v));
  const L = pct(m[1]);
  const C = parseFloat(m[2]);
  const H = (parseFloat(m[3]) * Math.PI) / 180;
  const alpha = m[4] === undefined ? 1 : pct(m[4]);

  const a = C * Math.cos(H);
  const bb = C * Math.sin(H);

  const l_ = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;

  const r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  const enc = (v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, c)) * 255);
  };

  const hex = `#${[r, g, b].map((v) => enc(v).toString(16).padStart(2, "0")).join("")}`;
  return alpha === 1 ? hex : `${hex} / ${alpha}`;
}

for (const value of process.argv.slice(2)) {
  console.log(`${value}  →  ${oklchToHex(value)}`);
}
