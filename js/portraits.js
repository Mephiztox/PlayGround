/* ============================================================
   Sakura House — anime portrait generator
   Layered SVG "bust" portraits with customization support.
   ============================================================ */

let UID = 0;

const SKIN = { base: '#ffe3d3', shade: '#f4c3ad', line: '#d99a84' };

export const HAIR_COLORS = [
  { id: 'strawberry', name: 'Strawberry', base: '#f0a08a', dark: '#cf7460', light: '#ffd2bd' },
  { id: 'honey', name: 'Honey', base: '#d9a25f', dark: '#b0763b', light: '#f7d7a6' },
  { id: 'sakura', name: 'Sakura', base: '#f3a9c4', dark: '#cf7c9d', light: '#ffd6e5' },
  { id: 'midnight', name: 'Midnight', base: '#3b3355', dark: '#241f3a', light: '#6d6194' },
  { id: 'ink', name: 'Ink', base: '#2a2438', dark: '#171226', light: '#5c5378' },
  { id: 'silver', name: 'Silver', base: '#d8d9e8', dark: '#a9abc4', light: '#ffffff' },
  { id: 'mint', name: 'Mint', base: '#8dd6bf', dark: '#5cab95', light: '#c8f5e6' },
  { id: 'violet', name: 'Violet', base: '#a98ee0', dark: '#7f62b8', light: '#d5c4ff' },
  { id: 'chestnut', name: 'Chestnut', base: '#8b5e4a', dark: '#68402f', light: '#b98368' },
  { id: 'sky', name: 'Sky', base: '#8db8e8', dark: '#5f8ec4', light: '#c9e3ff' },
];

export const EYE_COLORS = [
  { id: 'ruby', name: 'Ruby', base: '#e0506e', dark: '#8e2440', light: '#ff9aa8' },
  { id: 'emerald', name: 'Emerald', base: '#3fa87c', dark: '#1d6a4a', light: '#9ef0c8' },
  { id: 'violet', name: 'Violet', base: '#8a68d8', dark: '#4b3291', light: '#cbb3ff' },
  { id: 'amber', name: 'Amber', base: '#e0a23c', dark: '#9b6016', light: '#ffdc94' },
  { id: 'ocean', name: 'Ocean', base: '#3f8fd4', dark: '#1c568c', light: '#a5dcff' },
  { id: 'teal', name: 'Teal', base: '#2fa8a8', dark: '#116a6d', light: '#8fe8e0' },
  { id: 'rose', name: 'Rose', base: '#e07a9e', dark: '#95405f', light: '#ffc2d6' },
  { id: 'gold', name: 'Gold', base: '#d8b24a', dark: '#8f6d13', light: '#ffe9a0' },
];

export const OUTFIT_COLORS = [
  { id: 'navy', name: 'Navy', base: '#2e3a5c', dark: '#1d2540', light: '#5b6b98' },
  { id: 'blush', name: 'Blush', base: '#e88ba8', dark: '#bc5d7c', light: '#ffc4d4' },
  { id: 'cream', name: 'Cream', base: '#f3e6d0', dark: '#d3c2a7', light: '#fffaf0' },
  { id: 'forest', name: 'Forest', base: '#3f7357', dark: '#264a38', light: '#79b394' },
  { id: 'plum', name: 'Plum', base: '#5e3d63', dark: '#422846', light: '#9a72a0' },
  { id: 'charcoal', name: 'Charcoal', base: '#3a3a46', dark: '#26262f', light: '#6f6f80' },
  { id: 'coral', name: 'Coral', base: '#e8776a', dark: '#b94c43', light: '#ffb2a6' },
  { id: 'sky', name: 'Sky', base: '#7fb4dd', dark: '#5488b4', light: '#c3e5ff' },
];

export const HAIR_STYLES = [
  { id: 'twintails', name: 'Twin tails' },
  { id: 'long', name: 'Long flow' },
  { id: 'bob', name: 'Soft bob' },
  { id: 'ponytail', name: 'Ponytail' },
  { id: 'short', name: 'Short & messy' },
  { id: 'wavy', name: 'Wavy waves' },
];

export const OUTFITS = [
  { id: 'sailor', name: 'Sailor' },
  { id: 'hoodie', name: 'Hoodie' },
  { id: 'dress', name: 'Sundress' },
  { id: 'jacket', name: 'Sporty' },
  { id: 'kimono', name: 'Kimono' },
];

export const ACCESSORIES = [
  { id: 'none', name: 'None' },
  { id: 'ribbon', name: 'Ribbon' },
  { id: 'flower', name: 'Flower' },
  { id: 'clip', name: 'Hair clip' },
  { id: 'cat', name: 'Cat ears' },
  { id: 'glasses', name: 'Glasses' },
];

const hairById = (id) => HAIR_COLORS.find((c) => c.id === id) || HAIR_COLORS[0];
const eyeById = (id) => EYE_COLORS.find((c) => c.id === id) || EYE_COLORS[0];
const outfitById = (id) => OUTFIT_COLORS.find((c) => c.id === id) || OUTFIT_COLORS[0];

/* ---- hair back silhouettes ---- */
function hairBack(style, hair, u) {
  const g = `url(#hair${u})`;
  const dark = hair.dark;
  switch (style) {
    case 'long':
      return `
        <path d="M150 50 C102 50 76 88 78 140 C80 174 72 222 62 296 C70 330 96 352 118 380 L182 380 C204 352 230 330 238 296 C228 222 220 174 222 140 C224 88 198 50 150 50 Z" fill="${g}"/>
        <path d="M86 150 C82 210 78 268 74 330" stroke="${dark}" stroke-width="7" opacity=".35" fill="none" stroke-linecap="round"/>
        <path d="M214 150 C218 210 222 268 226 330" stroke="${dark}" stroke-width="7" opacity=".35" fill="none" stroke-linecap="round"/>`;
    case 'twintails':
      return `
        <path d="M150 52 C108 52 84 86 84 136 C84 172 92 198 104 218 C118 228 132 232 150 232 C168 232 182 228 196 218 C208 198 216 172 216 136 C216 86 192 52 150 52 Z" fill="${g}"/>
        <path d="M92 112 C70 150 54 216 60 286 C62 306 76 314 88 302 C104 286 104 240 112 200 C118 168 120 138 116 116 Z" fill="${g}"/>
        <path d="M208 112 C230 150 246 216 240 286 C238 306 224 314 212 302 C196 286 196 240 188 200 C182 168 180 138 184 116 Z" fill="${g}"/>
        <path d="M76 176 C70 220 66 262 70 296" stroke="${dark}" stroke-width="6" opacity=".3" fill="none" stroke-linecap="round"/>
        <path d="M224 176 C230 220 234 262 230 296" stroke="${dark}" stroke-width="6" opacity=".3" fill="none" stroke-linecap="round"/>
        <path d="M104 106 q-18 2 -14 14 q4 10 16 4 Z" fill="${hair.light}" opacity=".25"/>
        <path d="M196 106 q18 2 14 14 q-4 10 -16 4 Z" fill="${hair.light}" opacity=".25"/>`;
    case 'bob':
      return `
        <path d="M150 50 C106 50 82 86 82 138 C82 174 88 206 100 232 C114 244 132 248 150 248 C168 248 186 244 200 232 C212 206 218 174 218 138 C218 86 194 50 150 50 Z" fill="${g}"/>
        <path d="M88 180 C86 204 90 222 100 234" stroke="${dark}" stroke-width="7" opacity=".3" fill="none" stroke-linecap="round"/>
        <path d="M212 180 C214 204 210 222 200 234" stroke="${dark}" stroke-width="7" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'ponytail':
      return `
        <path d="M150 52 C106 52 82 88 84 138 C86 174 94 200 108 218 C124 228 136 232 150 232 C166 232 182 228 196 216 C208 198 214 174 214 138 C214 88 194 52 150 52 Z" fill="${g}"/>
        <path d="M202 96 C236 110 254 160 250 216 C248 264 232 306 206 340 C226 300 232 256 224 214 C218 180 204 152 188 128 Z" fill="${g}"/>
        <path d="M214 138 C230 186 230 254 216 306" stroke="${dark}" stroke-width="7" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'short':
      return `
        <path d="M150 50 C108 52 84 84 84 132 C84 162 90 186 100 202 C114 212 132 214 150 214 C170 214 186 212 198 200 C208 184 216 160 216 132 C216 84 192 50 150 50 Z" fill="${g}"/>
        <path d="M92 170 C96 188 104 200 116 208" stroke="${dark}" stroke-width="6" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'wavy':
      return `
        <path d="M150 50 C102 50 76 88 78 138 C80 168 68 190 76 216 C60 242 76 268 66 296 C64 328 90 350 118 380 L182 380 C210 350 236 328 234 296 C224 268 240 242 224 216 C232 190 220 168 222 138 C224 88 198 50 150 50 Z" fill="${g}"/>
        <path d="M88 190 C98 210 82 230 92 250 C100 266 86 286 94 308" stroke="${dark}" stroke-width="6" opacity=".3" fill="none" stroke-linecap="round"/>
        <path d="M212 190 C202 210 218 230 208 250 C200 266 214 286 206 308" stroke="${dark}" stroke-width="6" opacity=".3" fill="none" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

/* ---- front bangs ---- */
function bangs(style, hair) {
  const g = `url(#hair${hair.u})`;
  const shine = hair.light;
  switch (style) {
    case 'twintails':
      return `
        <path d="M97 128 C95 86 118 58 150 58 C182 58 205 86 203 128
          C199 120 195 114 190 110 C188 122 184 130 178 134
          C174 124 170 116 166 110 C162 124 158 132 152 136
          C148 126 144 118 140 112 C136 124 130 132 124 136
          C120 124 114 116 108 110 C104 118 100 124 97 128 Z" fill="${g}"/>
        <path d="M118 84 C132 70 152 66 168 72" stroke="${shine}" stroke-width="6" opacity=".35" fill="none" stroke-linecap="round"/>`;
    case 'long':
      return `
        <path d="M96 130 C94 84 118 56 150 56 C184 56 207 88 204 132
          C198 122 194 114 189 108 C186 124 181 136 175 142
          C171 128 167 118 162 112 C159 128 155 138 150 144
          C145 130 141 120 136 114 C133 128 128 138 123 144
          C119 130 113 120 107 114 C103 122 99 126 96 130 Z" fill="${g}"/>
        <path d="M128 74 C138 66 154 64 166 70" stroke="${shine}" stroke-width="5" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'bob':
      return `
        <path d="M96 132 C94 86 118 58 150 58 C182 58 206 86 204 132
          C200 122 196 116 192 112 C190 126 186 136 180 142
          C176 130 172 122 168 116 C164 128 160 136 154 140
          C150 128 146 120 142 116 C138 128 132 136 126 140
          C122 128 116 120 110 114 C104 122 99 126 96 132 Z" fill="${g}"/>
        <path d="M150 58 C130 58 114 68 106 86" stroke="${shine}" stroke-width="5" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'ponytail':
      return `
        <path d="M150 58 C118 60 97 84 96 122 C96 132 99 138 103 142
          C106 124 112 110 122 100 C134 110 148 116 162 118
          C154 104 151 82 156 64 C154 60 152 58 150 58 Z" fill="${g}"/>
        <path d="M158 66 C186 70 202 94 202 122 C202 132 199 138 195 142
          C192 126 186 114 178 106 C172 116 164 122 156 126
          C160 108 162 84 158 66 Z" fill="${g}"/>
        <path d="M118 78 C130 68 146 64 158 68" stroke="${shine}" stroke-width="5" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'short':
      return `
        <path d="M150 56 C118 56 96 82 96 118 L102 128 L110 108 L114 128 L124 104 L128 128 L138 102 L142 126 L150 100 L158 126 L164 102 L170 128 L180 106 L184 128 L192 110 L198 126 C202 88 182 56 150 56 Z" fill="${g}"/>
        <path d="M122 82 C134 70 148 66 162 70" stroke="${shine}" stroke-width="5" opacity=".3" fill="none" stroke-linecap="round"/>`;
    case 'wavy':
      return `
        <path d="M96 132 C94 84 118 56 150 56 C184 56 207 88 204 132
          C200 120 195 112 189 106 C188 124 183 138 176 146
          C174 132 170 122 165 114 C162 132 157 142 151 148
          C147 134 143 124 138 118 C134 134 128 142 122 146
          C120 132 114 122 108 116 C102 122 99 128 96 132 Z" fill="${g}"/>
        <path d="M126 76 C140 66 156 64 170 72" stroke="${shine}" stroke-width="5" opacity=".3" fill="none" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function sideLocks(style, hair) {
  if (!['long', 'wavy', 'twintails', 'ponytail'].includes(style)) return '';
  const g = `url(#hair${hair.u})`;
  const dark = hair.dark;
  return `
    <path d="M97 116 C88 150 87 196 92 244 C94 252 102 252 105 244 C101 198 103 156 110 124 Z" fill="${g}"/>
    <path d="M203 116 C212 150 213 196 208 244 C206 252 198 252 195 244 C199 198 197 156 190 124 Z" fill="${g}"/>
    <path d="M96 170 C93 196 94 222 96 240" stroke="${dark}" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/>
    <path d="M204 170 C207 196 206 222 204 240" stroke="${dark}" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/>`;
}

/* ---- outfit ---- */
function outfit(style, color, u) {
  const g = `url(#fit${u})`;
  const dark = color.dark;
  const light = color.light;
  switch (style) {
    case 'sailor':
      return `
        <path d="M36 380 C42 322 82 284 128 266 C136 274 143 280 150 284 C157 280 164 274 172 266 C218 284 258 322 264 380 Z" fill="${g}"/>
        <path d="M118 268 C126 280 138 288 150 294 C162 288 174 280 182 268 L196 276 C184 306 168 322 150 330 C132 322 116 306 104 276 Z" fill="#fdf6ee"/>
        <path d="M150 294 L136 310 L150 318 L164 310 Z" fill="${color.dark}"/>
        <path d="M150 296 L144 312 L150 328 L156 312 Z" fill="#e2687c"/>
        <path d="M126 300 C136 312 142 320 150 330" stroke="${dark}" stroke-width="3" opacity=".35" fill="none"/>
        <path d="M174 300 C164 312 158 320 150 330" stroke="${dark}" stroke-width="3" opacity=".35" fill="none"/>
        <path d="M52 356 C76 336 100 320 122 310" stroke="${light}" stroke-width="3" opacity=".25" fill="none"/>`;
    case 'hoodie':
      return `
        <path d="M36 380 C42 322 82 284 128 266 C136 274 143 280 150 284 C157 280 164 274 172 266 C218 284 258 322 264 380 Z" fill="${g}"/>
        <path d="M104 268 C112 246 130 238 150 238 C170 238 188 246 196 268 C180 278 166 284 150 284 C134 284 120 278 104 268 Z" fill="${dark}"/>
        <path d="M108 270 C120 258 134 252 150 252 C166 252 180 258 192 270" stroke="${light}" stroke-width="3" opacity=".4" fill="none"/>
        <path d="M138 292 L136 348" stroke="${light}" stroke-width="4" opacity=".8" stroke-linecap="round"/>
        <path d="M162 292 L164 348" stroke="${light}" stroke-width="4" opacity=".8" stroke-linecap="round"/>
        <circle cx="136" cy="350" r="4" fill="${light}"/>
        <circle cx="164" cy="350" r="4" fill="${light}"/>
        <path d="M118 332 C132 342 168 342 182 332 L184 380 L116 380 Z" fill="${dark}" opacity=".35"/>`;
    case 'dress':
      return `
        <path d="M36 380 C42 322 82 284 128 266 C136 274 143 280 150 284 C157 280 164 274 172 266 C218 284 258 322 264 380 Z" fill="${g}"/>
        <path d="M110 270 C122 286 136 296 150 300 C164 296 178 286 190 270 C204 278 214 288 222 300 C210 316 190 326 150 326 C110 326 90 316 78 300 C86 288 96 278 110 270 Z" fill="${color.base}"/>
        <path d="M96 300 C108 312 126 320 150 322 C174 320 192 312 204 300" stroke="${light}" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round" fill="none" opacity=".8"/>
        <path d="M138 300 C142 294 146 294 150 300 C154 294 158 294 162 300 C158 308 142 308 138 300 Z" fill="${light}" opacity=".85"/>
        <circle cx="150" cy="304" r="4" fill="${dark}"/>`;
    case 'jacket':
      return `
        <path d="M36 380 C42 322 82 284 128 266 C136 274 143 280 150 284 C157 280 164 274 172 266 C218 284 258 322 264 380 Z" fill="${g}"/>
        <path d="M118 268 L150 286 L182 268 L196 274 L186 306 L150 322 L114 306 L104 274 Z" fill="${dark}"/>
        <path d="M150 286 L150 344" stroke="${light}" stroke-width="3" opacity=".75"/>
        <path d="M112 286 L104 276 L108 266" stroke="${light}" stroke-width="3" opacity=".5" fill="none"/>
        <path d="M188 286 L196 276 L192 266" stroke="${light}" stroke-width="3" opacity=".5" fill="none"/>
        <circle cx="150" cy="300" r="3.5" fill="${light}"/>
        <circle cx="150" cy="320" r="3.5" fill="${light}"/>
        <path d="M52 356 C76 336 100 320 122 310" stroke="${light}" stroke-width="3" opacity=".2" fill="none"/>`;
    case 'kimono':
      return `
        <path d="M36 380 C42 322 82 284 128 266 C136 274 143 280 150 284 C157 280 164 274 172 266 C218 284 258 322 264 380 Z" fill="${g}"/>
        <path d="M122 270 L150 300 L178 270 L190 278 L150 322 L110 278 Z" fill="#fdf6ee"/>
        <path d="M150 300 L136 330 L150 342 L164 330 Z" fill="${dark}" opacity=".55"/>
        <path d="M132 296 C140 310 146 320 150 330" stroke="${dark}" stroke-width="3" opacity=".4" fill="none"/>
        <path d="M168 296 C160 310 154 320 150 330" stroke="${dark}" stroke-width="3" opacity=".4" fill="none"/>
        <path d="M56 362 C82 338 104 318 120 304" stroke="${light}" stroke-width="3" opacity=".25" fill="none"/>`;
    default:
      return '';
  }
}

function accessory(kind, hair, eye, u) {
  const shine = hair.light;
  switch (kind) {
    case 'ribbon':
      return `
        <g transform="translate(196 84) rotate(12)">
          <path d="M0 0 C-18 -14 -32 -6 -30 8 C-28 22 -12 22 0 8 Z" fill="#e2687c"/>
          <path d="M0 0 C18 -14 32 -6 30 8 C28 22 12 22 0 8 Z" fill="#e2687c"/>
          <path d="M-26 -2 C-16 -6 -8 -2 -2 4" stroke="#ffb3c2" stroke-width="3" opacity=".6" fill="none"/>
          <circle cx="0" cy="4" r="7" fill="#c84f66"/>
          <path d="M-2 9 C-8 22 -12 30 -16 38" stroke="#e2687c" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M3 9 C8 22 12 28 17 35" stroke="#e2687c" stroke-width="5" stroke-linecap="round" fill="none"/>
        </g>`;
    case 'flower':
      return `
        <g transform="translate(203 100)">
          ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-11" rx="7" ry="11" fill="#ffe1ee" transform="rotate(${a})" opacity=".95"/>`).join('')}
          <circle r="5" fill="#f5b955"/>
          <circle r="2.4" fill="#fff1c9"/>
        </g>`;
    case 'clip':
      return `
        <g transform="translate(94 106) rotate(-18)">
          <rect x="-18" y="-5" width="36" height="10" rx="5" fill="#f5c56b"/>
          <rect x="-14" y="-2" width="28" height="4" rx="2" fill="#ffe8b0"/>
          <circle cx="-16" cy="0" r="4" fill="#e2687c"/>
          <circle cx="16" cy="0" r="3" fill="#e2687c"/>
        </g>`;
    case 'cat':
      return `
        <g>
          <path d="M96 76 L88 38 L124 58 Z" fill="url(#hair${u})"/>
          <path d="M104 70 L98 48 L118 60 Z" fill="#f3a9c4" opacity=".85"/>
          <path d="M204 76 L212 38 L176 58 Z" fill="url(#hair${u})"/>
          <path d="M196 70 L202 48 L182 60 Z" fill="#f3a9c4" opacity=".85"/>
        </g>`;
    case 'glasses':
      return `
        <g fill="none" stroke="#c9a86a" stroke-width="2.5" opacity=".9">
          <rect x="103" y="142" width="44" height="40" rx="14"/>
          <rect x="153" y="142" width="44" height="40" rx="14"/>
          <path d="M147 158 L153 158"/>
          <path d="M103 154 L94 150"/>
          <path d="M197 154 L206 150"/>
        </g>
        <rect x="107" y="146" width="14" height="10" rx="6" fill="#fff" opacity=".18"/>
        <rect x="157" y="146" width="14" height="10" rx="6" fill="#fff" opacity=".18"/>`;
    default:
      return '';
  }
}

/* ---- eyes / face ---- */
function eyes(expr, eyeId, u, dir = 1) {
  const e = eyeById(eyeId);
  const closed = expr === 'wink' || expr === 'sleepy';
  const lash = '#3a2438';
  const lid = (cx) =>
    `<path d="M${cx - 21} 154 C${cx - 16} 139 ${cx + 1} 135 ${cx + 14} 142" stroke="${lash}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
  const lower = (cx) => `<path d="M${cx - 15} 172 C${cx - 7} 178 ${cx + 4} 178 ${cx + 13} 170" stroke="${lash}" stroke-width="1.8" opacity=".35" fill="none" stroke-linecap="round"/>`;
  const openEye = (cx, flip) => `
    <g ${flip ? `transform="translate(${cx * 2} 0) scale(-1 1)"` : ''}>
      <path d="M${cx - 20} 158 C${cx - 20} 144 ${cx - 6} 136 ${cx + 6} 140 C${cx + 16} 143 ${cx + 17} 158 ${cx + 10} 169 C${cx + 1} 180 ${cx - 17} 173 ${cx - 20} 158 Z" fill="#fffaf8"/>
      <circle cx="${cx - 1}" cy="158" r="14" fill="url(#iris${u})"/>
      <circle cx="${cx - 1}" cy="158" r="13" fill="none" stroke="${e.dark}" stroke-width="2.6" opacity=".55"/>
      <circle cx="${cx - 1}" cy="159" r="6.5" fill="#201626"/>
      <circle cx="${cx + 4}" cy="150" r="4.6" fill="#fff" opacity=".96"/>
      <circle cx="${cx - 8}" cy="166" r="2.5" fill="#fff" opacity=".55"/>
      <path d="M${cx - 18} 168 C${cx - 10} 175 ${cx + 2} 176 ${cx + 11} 168" stroke="${e.light}" stroke-width="2.4" opacity=".85" fill="none"/>
      ${lid(cx)}
      <path d="M${cx - 22} 151 C${cx - 29} 148 ${cx - 28} 142 ${cx - 22} 141 C${cx - 25} 146 ${cx - 23} 149 ${cx - 18} 152 Z" fill="${lash}" opacity=".85"/>
      ${lower(cx)}
    </g>`;
  const shutEye = (cx) => `
    <g>
      <path d="M${cx - 18} 160 C${cx - 8} 152 ${cx + 6} 152 ${cx + 16} 160" stroke="${lash}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M${cx + 16} 160 l7 4 M${cx + 16} 160 l7 -4" stroke="${lash}" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  if (closed) {
    return `${shutEye(124)}${expr === 'wink' ? openEye(176, true) : shutEye(176)}`;
  }
  return `${openEye(124, false)}${openEye(176, true)}`;
}

function mouth(expr) {
  const line = '#b25463';
  switch (expr) {
    case 'happy':
      return `<path d="M138 194 C144 206 156 206 162 194 C155 199 145 199 138 194 Z" fill="${line}"/><path d="M143 201 C147 204 153 204 157 201" stroke="#ff9fae" stroke-width="2" fill="none"/>`;
    case 'pout':
      return `<path d="M142 199 C146 194 154 194 158 199" stroke="${line}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'sleepy':
      return `<path d="M145 198 C148 200 152 200 155 198" stroke="${line}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    case 'blush':
    case 'smile':
    default:
      return `<path d="M141 194 C146 201 154 201 159 194" stroke="${line}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
  }
}

/* ---- main export ---- */
export function portraitSVG(char, opts = {}) {
  const u = ++UID;
  const style = (char.style || {});
  const hair = hairById(style.hairColor);
  const eye = eyeById(style.eyeColor);
  const fit = outfitById(style.outfitColor);
  const hairStyle = style.hairStyle || 'long';
  const outfitStyle = style.outfit || 'sailor';
  const acc = style.accessory || 'none';
  const expr = opts.expression || 'smile';
  const mood = opts.mood ?? 70;
  const aff = opts.affection ?? 20;

  let expression = expr;
  if (!opts.expression) {
    if (mood < 32) expression = 'pout';
    else if (mood < 45) expression = 'sleepy';
    else if (aff >= 55) expression = 'blush';
    else if (mood >= 70) expression = 'smile';
    else expression = 'sleepy';
  }

  const e = eye;
  const blushStrong = expression === 'blush' || aff >= 75;

  return `
<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeAttr(char.name || 'resident')} portrait" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="bg${u}" cx="50%" cy="34%" r="72%">
      <stop offset="0%" stop-color="${hair.light}" stop-opacity=".42"/>
      <stop offset="52%" stop-color="#2c2147" stop-opacity=".18"/>
      <stop offset="100%" stop-color="#171128"/>
    </radialGradient>
    <linearGradient id="hair${u}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${hair.light}"/>
      <stop offset="34%" stop-color="${hair.base}"/>
      <stop offset="100%" stop-color="${hair.dark}"/>
    </linearGradient>
    <linearGradient id="skin${u}" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="#fff0e5"/>
      <stop offset="100%" stop-color="${SKIN.base}"/>
    </linearGradient>
    <linearGradient id="fit${u}" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${fit.light}"/>
      <stop offset="42%" stop-color="${fit.base}"/>
      <stop offset="100%" stop-color="${fit.dark}"/>
    </linearGradient>
    <radialGradient id="iris${u}" cx="48%" cy="30%" r="72%">
      <stop offset="0%" stop-color="${e.light}"/>
      <stop offset="55%" stop-color="${e.base}"/>
      <stop offset="100%" stop-color="${e.dark}"/>
    </radialGradient>
    <linearGradient id="fade${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f0b1f" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0f0b1f" stop-opacity=".55"/>
    </linearGradient>
    <clipPath id="faceClip${u}">
      <path d="M150 68 C112 68 93 97 93 136 C93 177 116 214 150 225 C184 214 207 177 207 136 C207 97 188 68 150 68 Z"/>
    </clipPath>
  </defs>

  <rect width="300" height="380" fill="url(#bg${u})"/>
  <circle cx="150" cy="158" r="112" fill="${hair.base}" opacity=".12"/>
  <circle cx="150" cy="158" r="88" fill="none" stroke="${hair.light}" stroke-width="1" opacity=".22"/>
  <g opacity=".5">
    <path d="M56 96 q6 -10 12 0 q-6 10 -12 0" fill="${hair.light}" opacity=".5"/>
    <path d="M246 74 q5 -9 10 0 q-5 9 -10 0" fill="${hair.light}" opacity=".4"/>
    <path d="M236 186 q4 -7 8 0 q-4 7 -8 0" fill="${hair.light}" opacity=".35"/>
    <path d="M48 206 q4 -7 8 0 q-4 7 -8 0" fill="${hair.light}" opacity=".3"/>
    <circle cx="70" cy="62" r="2" fill="#fff" opacity=".5"/>
    <circle cx="238" cy="120" r="1.6" fill="#fff" opacity=".45"/>
    <circle cx="222" cy="248" r="2" fill="#fff" opacity=".3"/>
  </g>

  ${hairBack(hairStyle, hair, u)}
  ${outfit(outfitStyle, fit, u)}

  <rect x="132" y="198" width="36" height="60" rx="15" fill="${SKIN.shade}"/>
  <path d="M132 208 C140 224 160 224 168 208 L168 218 C158 230 142 230 132 218 Z" fill="${SKIN.line}" opacity=".28"/>

  <path d="M150 68 C112 68 93 97 93 136 C93 177 116 214 150 225 C184 214 207 177 207 136 C207 97 188 68 150 68 Z" fill="url(#skin${u})"/>
  <ellipse cx="94" cy="158" rx="9" ry="14" fill="${SKIN.base}"/>
  <ellipse cx="206" cy="158" rx="9" ry="14" fill="${SKIN.base}"/>
  <ellipse cx="94" cy="159" rx="4" ry="8" fill="${SKIN.shade}" opacity=".6"/>
  <ellipse cx="206" cy="159" rx="4" ry="8" fill="${SKIN.shade}" opacity=".6"/>
  <g clip-path="url(#faceClip${u})">
    <path d="M93 140 C120 150 180 150 207 140 L207 90 L93 90 Z" fill="${SKIN.line}" opacity=".14"/>
    <ellipse cx="108" cy="188" rx="17" ry="8" fill="#ff8fa8" opacity="${blushStrong ? 0.5 : 0.28}"/>
    <ellipse cx="192" cy="188" rx="17" ry="8" fill="#ff8fa8" opacity="${blushStrong ? 0.5 : 0.28}"/>
    <path d="M102 186 l8 -5 M108 189 l8 -5 M110 193 l8 -5" stroke="#ff7d99" stroke-width="1.4" opacity="${blushStrong ? 0.65 : 0.35}" stroke-linecap="round"/>
    <path d="M198 186 l-8 -5 M192 189 l-8 -5 M190 193 l-8 -5" stroke="#ff7d99" stroke-width="1.4" opacity="${blushStrong ? 0.65 : 0.35}" stroke-linecap="round"/>
  </g>

  <path d="M107 133 C116 127 130 127 138 132" stroke="${hair.dark}" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M162 132 C170 127 184 127 193 133" stroke="${hair.dark}" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".9"/>

  ${eyes(expression, style.eyeColor, u)}
  <path d="M149 176 C146 181 147 184 151 185" stroke="${SKIN.line}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
  ${mouth(expression)}
  ${bangs(hairStyle, hair)}
  ${sideLocks(hairStyle, hair)}
  ${accessory(acc, { ...hair, u }, eye, u)}

  <path d="M0 320 L300 320 L300 380 L0 380 Z" fill="url(#fade${u})"/>
</svg>`;
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function portraitDataURL(char, opts) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(portraitSVG(char, opts));
}
