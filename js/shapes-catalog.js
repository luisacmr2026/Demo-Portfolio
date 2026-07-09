const HD_SIZE = 2048;

function slugify(token) {
  return token
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match) return '#000000';
  return `#${match.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`;
}

function prepareSvg(svg, color) {
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const viewBox = clone.getAttribute('viewBox');
  if (viewBox) {
    const [, , w, h] = viewBox.split(/\s+/).map(Number);
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));
  }

  clone.querySelectorAll('path, circle, rect, polygon, line').forEach((el) => {
    if (el.classList.contains('shape-stroke')) {
      el.setAttribute('stroke', color);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      return;
    }

    if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
      return;
    }

    if (el.tagName.toLowerCase() === 'line') {
      return;
    }

    el.setAttribute('fill', color);
    el.removeAttribute('stroke');
  });

  return clone;
}

function serializeSvg(svg) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svg)}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getCardFilename(card) {
  const token = card.querySelector('.shape-card__token')?.textContent.trim() || 'shape';
  return slugify(token);
}

async function loadExternalSvg(lib) {
  const response = await fetch(lib.dataset.svgSrc);
  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  return doc.documentElement;
}

async function getPreparedSvg(card) {
  const lib = card.querySelector('.shape-lib');
  if (!lib) return null;

  if (lib.dataset.svgSrc) {
    return loadExternalSvg(lib);
  }

  const svg = lib.querySelector('svg');
  if (!svg) return null;

  const color = rgbToHex(getComputedStyle(lib).color);
  return prepareSvg(svg, color);
}

async function downloadRaster(card, src) {
  const response = await fetch(src);
  const blob = await response.blob();
  downloadBlob(blob, `${getCardFilename(card)}.png`);
}

async function downloadSvg(card) {
  const lib = card.querySelector('.shape-lib');
  if (!lib) return;

  if (lib.dataset.imgSrc) {
    return;
  }

  if (lib.dataset.svgSrc) {
    const response = await fetch(lib.dataset.svgSrc);
    const blob = await response.blob();
    downloadBlob(blob, `${getCardFilename(card)}.svg`);
    return;
  }

  const svg = lib.querySelector('svg');
  if (!svg) return;

  const color = rgbToHex(getComputedStyle(lib).color);
  const prepared = prepareSvg(svg, color);
  const blob = new Blob([serializeSvg(prepared)], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, `${getCardFilename(card)}.svg`);
}

async function downloadPng(card) {
  const lib = card.querySelector('.shape-lib');
  if (!lib) return;

  if (lib.dataset.imgSrc) {
    await downloadRaster(card, lib.dataset.imgSrc);
    return;
  }

  const prepared = await getPreparedSvg(card);
  if (!prepared) return;

  const svgString = serializeSvg(prepared);
  const viewBox = prepared.viewBox.baseVal;
  const aspect = viewBox.width / viewBox.height;

  let width;
  let height;
  if (aspect >= 1) {
    width = HD_SIZE;
    height = Math.round(HD_SIZE / aspect);
  } else {
    height = HD_SIZE;
    width = Math.round(HD_SIZE * aspect);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));

  image.onload = () => {
    ctx.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${getCardFilename(card)}-hd.png`);
    }, 'image/png');
  };

  image.src = url;
}

document.querySelectorAll('.shape-card').forEach((card) => {
  const meta = card.querySelector('.shape-card__meta');
  if (!meta) return;

  const lib = card.querySelector('.shape-lib');
  const isRaster = Boolean(lib?.dataset.imgSrc);

  const actions = document.createElement('div');
  actions.className = 'shape-card__actions';
  actions.innerHTML = isRaster
    ? '<button type="button" class="btn btn--ghost btn--sm shape-card__download" data-format="png">PNG · HD</button>'
    : `
    <button type="button" class="btn btn--ghost btn--sm shape-card__download" data-format="png">PNG · HD</button>
    <button type="button" class="btn btn--ghost btn--sm shape-card__download" data-format="svg">SVG</button>
  `;
  meta.appendChild(actions);

  actions.querySelectorAll('.shape-card__download').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.format === 'svg') downloadSvg(card);
      else downloadPng(card);
    });
  });
});
