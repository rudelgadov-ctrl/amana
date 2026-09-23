export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Plain-text admin compose box → safe paragraph HTML (one <p> per blank-line-separated block,
// single newlines within a block become <br/>).
export const textToHtml = (text: string): string =>
  text
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 16px;">${escapeHtml(block).replace(/\n/g, '<br/>')}</p>`)
    .join('');
