const MAIL = '<a href="mailto:hello@narido.eu">hello@narido.eu</a>';

const EMAIL_PLACEHOLDERS = [
  "[YOUR CONTACT ADDRESS]",
  "[VOTRE ADRESSE DE CONTACT]",
  "[JOUW CONTACTADRES]",
  "[YOUR SUPPORT EMAIL]",
  "[VOTRE ADRESSE D'ASSISTANCE]",
  "[JOUW SUPPORTADRES]",
];

const PRIVACY_PLACEHOLDERS = [
  "[LINK TO YOUR PRIVACY POLICY PAGE]",
  "[LIEN VERS VOTRE PAGE DE CONFIDENTIALITÉ]",
  "[LINK NAAR JE PRIVACYPAGINA]",
];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inline(value: string, tokens: string[]): string {
  const withTokens = escapeHtml(value).replaceAll(/%%SPL(\d+)%%/g, (_, index: string) => tokens[Number(index)] ?? "");
  return withTokens.replaceAll(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function formatLine(line: string, tokens: string[]): string {
  const italic = line.match(/^_(.*)_$/);
  const html = inline(italic ? italic[1] : line, tokens);
  return italic ? `<em>${html}</em>` : html;
}

export function renderSplatMarkdown(markdown: string, privacyHref?: string, privacyLabel?: string): string {
  let text = markdown.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  const tokens: string[] = [];

  const swap = (placeholder: string, html: string) => {
    if (!text.includes(placeholder)) return;
    const token = `%%SPL${tokens.length}%%`;
    tokens.push(html);
    text = text.split(placeholder).join(token);
  };

  for (const placeholder of EMAIL_PLACEHOLDERS) swap(placeholder, MAIL);
  if (privacyHref && privacyLabel) {
    const link = `<a href="${escapeHtml(privacyHref)}">${escapeHtml(privacyLabel)}</a>`;
    for (const placeholder of PRIVACY_PLACEHOLDERS) swap(placeholder, link);
  }

  const leftover = text.match(/\[[A-Z][^\]]+\]/);
  if (leftover) throw new Error(`Unresolved SplatDuo placeholder: ${leftover[0]}`);

  const out: string[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (list.length === 0) return;
    out.push(`<ul>${list.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    list = [];
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("# ")) {
      flushList();
      out.push(`<h1>${formatLine(line.slice(2), tokens)}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      out.push(`<h2>${formatLine(line.slice(3), tokens)}</h2>`);
      continue;
    }
    if (line.startsWith("- ")) {
      list.push(formatLine(line.slice(2), tokens));
      continue;
    }
    flushList();
    out.push(`<p>${formatLine(line, tokens)}</p>`);
  }
  flushList();
  return out.join("");
}
