import { createHash } from 'node:crypto';

/**
 * Generated placeholder artwork. Every product can carry a real photograph via
 * `imageUrl`; until BJS supplies photography, this draws a metallic line study
 * of the right piece so the catalogue never shows an empty frame.
 */

export type Motif = 'necklace' | 'bangle' | 'earring' | 'ring' | 'pendant' | 'set';
export type Tone = 't1' | 't2' | 't3' | 'dark';

const TONES: Record<Tone, [string, string, string]> = {
  t1: ['#FCF6EA', '#EADCC2', '#DCC9A6'],
  t2: ['#FBF2EE', '#EDD9D1', '#E0C6BC'],
  t3: ['#F7F6F1', '#E4E1D8', '#D6D2C6'],
  dark: ['#2C2520', '#1E1815', '#151110'],
};

function bez(p0: number[], p1: number[], p2: number[], t: number): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

function jhumka(metal: string, gem: string, hair: string): string {
  let fringe = '';
  for (let i = 0; i < 9; i++) {
    const x = 128 + i * (144 / 8);
    const y = 230 + 13 * Math.sin((Math.PI * i) / 8);
    fringe += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${metal}"/>`;
  }
  return (
    `<path d="M200 84 C 176 96 172 116 178 132" fill="none" stroke="${metal}" stroke-width="3"/>` +
    `<circle cx="200" cy="148" r="20" fill="${metal}"/>` +
    `<circle cx="200" cy="148" r="11" fill="${gem}"/>` +
    `<path d="M126 228 C 132 168 268 168 274 228 Z" fill="${metal}"/>` +
    `<path d="M148 222 C 154 186 246 186 252 222 Z" fill="${gem}" fill-opacity=".55"/>` +
    `<path d="M200 174 L200 228 M166 200 L234 200" stroke="${hair}" stroke-opacity=".3" stroke-width="1"/>` +
    fringe
  );
}

function buildSvg(motif: Motif, tone: Tone, variant: number, uid: string): string {
  const tn = TONES[tone] ?? TONES.t1;
  const isDark = tone === 'dark';
  const metal = `url(#m${uid})`;
  const gem = `url(#s${uid})`;
  const hair = isDark ? '#7A6440' : '#A88A52';

  const defs =
    '<defs>' +
    `<radialGradient id="b${uid}" cx="34%" cy="22%" r="86%">` +
    `<stop offset="0%" stop-color="${tn[0]}"/><stop offset="58%" stop-color="${tn[1]}"/><stop offset="100%" stop-color="${tn[2]}"/>` +
    '</radialGradient>' +
    `<linearGradient id="m${uid}" x1="14%" y1="0%" x2="86%" y2="100%">` +
    '<stop offset="0%" stop-color="#F2DCAC"/><stop offset="26%" stop-color="#C9A45F"/>' +
    '<stop offset="58%" stop-color="#8E6E37"/><stop offset="80%" stop-color="#D9BE88"/>' +
    '<stop offset="100%" stop-color="#A98545"/>' +
    '</linearGradient>' +
    `<linearGradient id="s${uid}" x1="20%" y1="0%" x2="80%" y2="100%">` +
    '<stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>' +
    '<stop offset="45%" stop-color="#EFE3CE"/><stop offset="100%" stop-color="#C2A978"/>' +
    '</linearGradient></defs>';

  const bg =
    `<rect width="400" height="400" fill="url(#b${uid})"/>` +
    `<circle cx="200" cy="196" r="150" fill="none" stroke="${hair}" stroke-opacity=".16" stroke-width="1"/>` +
    `<circle cx="200" cy="196" r="128" fill="none" stroke="${hair}" stroke-opacity=".10" stroke-width="1"/>`;

  let body = '';

  if (motif === 'necklace' || motif === 'set') {
    const P0 = [74, 118];
    const P1 = [200, 306];
    const P2 = [326, 118];
    let chain = '';
    for (let i = 1; i <= 17; i++) {
      const t = i / 18;
      const [x, y] = bez(P0, P1, P2, t);
      const r = 3.1 + 4.2 * Math.sin(Math.PI * t);
      chain += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${metal}"/>`;
    }
    const [cx, cy] = bez(P0, P1, P2, 0.5);
    body =
      `<path d="M74 118 Q200 306 326 118" fill="none" stroke="${metal}" stroke-width="3.2" stroke-linecap="round"/>` +
      `<path d="M88 126 Q200 286 312 126" fill="none" stroke="${metal}" stroke-width="1.6" stroke-opacity=".62"/>` +
      chain +
      `<g transform="translate(${cx.toFixed(1)},${(cy + 6).toFixed(1)})">` +
      `<path d="M0 -4 C 26 10 26 46 0 62 C -26 46 -26 10 0 -4 Z" fill="${metal}"/>` +
      `<path d="M0 4 C 16 14 16 40 0 52 C -16 40 -16 14 0 4 Z" fill="${gem}"/>` +
      `<path d="M0 4 L0 52 M-15 28 L15 28" stroke="${hair}" stroke-opacity=".35" stroke-width="1"/>` +
      `<circle cx="0" cy="-10" r="5" fill="${metal}"/></g>`;

    if (motif === 'set') {
      body =
        `<g transform="translate(0,-46) scale(.9)" transform-origin="200 200">${body}</g>` +
        `<g transform="translate(-96,168) scale(.34)" transform-origin="200 200">${jhumka(metal, gem, hair)}</g>` +
        `<g transform="translate(96,168) scale(.34)" transform-origin="200 200">${jhumka(metal, gem, hair)}</g>` +
        `<g transform="translate(0,190) scale(.3)" transform-origin="200 200">` +
        `<path d="M200 150 L232 200 L200 250 L168 200 Z" fill="${metal}"/>` +
        `<circle cx="200" cy="200" r="15" fill="${gem}"/></g>`;
    }
  } else if (motif === 'bangle') {
    let dots = '';
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2 - Math.PI / 2;
      dots += `<circle cx="${(200 + 112 * Math.cos(a)).toFixed(1)}" cy="${(200 + 112 * Math.sin(a)).toFixed(1)}" r="${k % 3 === 0 ? 6.5 : 4}" fill="${metal}"/>`;
    }
    body =
      `<circle cx="200" cy="200" r="112" fill="none" stroke="${metal}" stroke-width="17"/>` +
      `<circle cx="200" cy="200" r="120" fill="none" stroke="${hair}" stroke-opacity=".3" stroke-width="1"/>` +
      `<circle cx="200" cy="200" r="104" fill="none" stroke="${hair}" stroke-opacity=".3" stroke-width="1"/>` +
      `<path d="M200 88 A112 112 0 0 1 312 200" fill="none" stroke="#FFF3DA" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>` +
      dots +
      `<circle cx="200" cy="200" r="76" fill="none" stroke="${metal}" stroke-width="5" stroke-opacity=".8"/>` +
      `<circle cx="200" cy="200" r="64" fill="none" stroke="${metal}" stroke-width="2.4" stroke-opacity=".55"/>`;
  } else if (motif === 'earring') {
    body =
      `<g transform="translate(-56,-14) scale(.84)" transform-origin="200 200">${jhumka(metal, gem, hair)}</g>` +
      `<g transform="translate(56,34) scale(.84)" transform-origin="200 200">${jhumka(metal, gem, hair)}</g>`;
  } else if (motif === 'ring') {
    let pave = '';
    for (let j = 0; j < 14; j++) {
      const a = Math.PI + (j / 13) * Math.PI;
      pave += `<circle cx="${(200 + 62 * Math.cos(a)).toFixed(1)}" cy="${(252 + 54 * Math.sin(a)).toFixed(1)}" r="3.4" fill="${gem}"/>`;
    }
    body =
      `<ellipse cx="200" cy="252" rx="82" ry="72" fill="none" stroke="${metal}" stroke-width="15"/>` +
      `<ellipse cx="200" cy="252" rx="90" ry="80" fill="none" stroke="${hair}" stroke-opacity=".28" stroke-width="1"/>` +
      pave +
      `<path d="M158 176 L200 108 L242 176 L200 212 Z" fill="${metal}"/>` +
      `<path d="M170 172 L200 124 L230 172 L200 198 Z" fill="${gem}"/>` +
      `<path d="M170 172 L230 172 M200 124 L200 198 M170 172 L200 150 L230 172" stroke="${hair}" stroke-opacity=".4" stroke-width="1" fill="none"/>` +
      `<circle cx="150" cy="196" r="6" fill="${metal}"/><circle cx="250" cy="196" r="6" fill="${metal}"/>`;
  } else {
    const C0 = [92, 86];
    const C1 = [200, 140];
    const C2 = [308, 86];
    let chain = '';
    for (let m = 1; m <= 13; m++) {
      const [x, y] = bez(C0, C1, C2, m / 14);
      chain += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${metal}"/>`;
    }
    body =
      chain +
      `<path d="M92 86 Q200 140 308 86" fill="none" stroke="${metal}" stroke-width="1.8" stroke-opacity=".7"/>` +
      `<circle cx="200" cy="152" r="14" fill="none" stroke="${metal}" stroke-width="5"/>` +
      `<path d="M200 176 C 250 210 254 268 200 302 C 146 268 150 210 200 176 Z" fill="${metal}"/>` +
      `<path d="M200 192 C 236 218 238 260 200 286 C 162 260 164 218 200 192 Z" fill="${gem}"/>` +
      `<path d="M200 192 L200 286 M166 240 L234 240 M176 214 L224 266 M224 214 L176 266" stroke="${hair}" stroke-opacity=".32" stroke-width="1" fill="none"/>`;
  }

  const transform =
    variant === 1
      ? 'rotate(-12 200 200) scale(1.1)'
      : variant === 2
        ? 'scale(.82)'
        : '';
  const frame =
    variant === 2
      ? `<rect x="42" y="42" width="316" height="316" fill="none" stroke="${hair}" stroke-opacity=".28" stroke-width="1"/>`
      : '';

  return (
    '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="presentation" preserveAspectRatio="xMidYMid slice">' +
    defs +
    bg +
    frame +
    `<g transform="${transform}" transform-origin="200 200">${body}</g>` +
    '</svg>'
  );
}

type Props = {
  motif?: string | null;
  tone?: string | null;
  variant?: number;
  /** Real photography wins whenever the shop has uploaded it. */
  imageUrl?: string | null;
  alt?: string;
  className?: string;
};

export function JewelArt({ motif, tone, variant = 0, imageUrl, alt = '', className }: Props) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={alt} className={className} />;
  }

  const safeMotif = (['necklace', 'bangle', 'earring', 'ring', 'pendant', 'set'] as const).includes(
    motif as Motif,
  )
    ? (motif as Motif)
    : 'necklace';
  const safeTone = (['t1', 't2', 't3', 'dark'] as const).includes(tone as Tone)
    ? (tone as Tone)
    : 't1';

  // Gradient ids must be unique per instance or the first one wins page-wide.
  const uid = createHash('sha1')
    .update(`${safeMotif}|${safeTone}|${variant}|${alt}`)
    .digest('hex')
    .slice(0, 8);

  // display:contents keeps the generated <svg> a direct child of .media for CSS.
  return (
    <span
      className={className}
      style={{ display: 'contents' }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: buildSvg(safeMotif, safeTone, variant, uid) }}
    />
  );
}
