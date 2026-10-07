// Local preview: renders the theme with LiquidJS and mock Shopify data (no store needed).
const { Liquid, Tag } = require('liquidjs');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const engine = new Liquid({ root: [path.join(root, 'snippets'), path.join(root, 'sections')], extname: '.liquid', jsTruthy: false, ownPropertyOnly: false, outputEscape: undefined });

const schemaOf = name => { const s = read(`sections/${name}.liquid`); const m = s.match(/{% schema %}([\s\S]*?){% endschema %}/); return JSON.parse(m[1]); };
const defaultsOf = list => Object.fromEntries((list || []).filter(x => x.id).map(x => [x.id, x.default !== undefined ? x.default : (['checkbox'].includes(x.type) ? false : (x.type === 'range' ? 0 : ''))]));

// ---- custom tags ----
engine.registerTag('schema', { parse(tag, toks) { const stream = this.liquid.parser.parseStream(toks).on('tag:endschema', () => stream.stop()).on('template', () => {}).on('end', () => { }); stream.start(); }, render() { return ''; } });
engine.registerTag('form', {
  parse(tag, toks) { this.args = tag.args; this.tpls = []; const stream = this.liquid.parser.parseStream(toks).on('tag:endform', () => stream.stop()).on('template', t => this.tpls.push(t)).on('end', () => { throw new Error('form not closed'); }); stream.start(); },
  *render(ctx, emitter) {
    const type = (this.args.match(/'([^']+)'/) || [])[1];
    const action = type === 'product' ? '/cart/add' : type === 'customer' ? '/contact#contact_form' : '/';
    const idm = this.args.match(/id:\s*'([^']+)'/), cls = this.args.match(/class:\s*'([^']+)'/), ajax = /data-ajax-cart/.test(this.args);
    emitter.write(`<form method="post" action="${action}"${idm ? ` id="${idm[1]}"` : ''}${cls ? ` class="${cls[1]}"` : ''}${ajax ? ' data-ajax-cart' : ''} novalidate>`);
    ctx.push({ form: { posted_successfully: ctx.environments.__posted === true, errors: false } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
    emitter.write('</form>');
  }
});
engine.registerTag('paginate', {
  parse(tag, toks) { this.tpls = []; const stream = this.liquid.parser.parseStream(toks).on('tag:endpaginate', () => stream.stop()).on('template', t => this.tpls.push(t)).on('end', () => { throw new Error('paginate not closed'); }); stream.start(); },
  *render(ctx, emitter) { yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); }
});
engine.registerTag('section', {
  parse(tag) { this.name = tag.args.trim().replace(/['"]/g, ''); },
  *render(ctx, emitter) { const html = yield renderSection(this.name, `${this.name}`, {}, [], ctx.environments); emitter.write(html); }
});

// ---- filters ----
const named = a => Object.fromEntries(a.filter(Array.isArray).map(([k, v]) => [k, v]));
engine.registerFilter('asset_url', f => `/assets/${f}`);
engine.registerFilter('image_url', (img, ...a) => (img && (img.src || img)) || '');
engine.registerFilter('image_tag', (src, ...a) => { const n = named(a); return `<img src="${src}"${n.class ? ` class="${n.class}"` : ''} alt="${(n.alt || '').toString().replace(/"/g, '&quot;')}"${n.loading ? ` loading="${n.loading}"` : ''}>`; });
engine.registerFilter('stylesheet_tag', u => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter('money', v => '$' + (v / 100).toFixed(2));
engine.registerFilter('money_without_trailing_zeros', v => '$' + (v / 100).toFixed(2).replace(/\.00$/, ''));
engine.registerFilter('default_errors', () => '');
engine.registerFilter('default_pagination', () => '');
engine.registerFilter('handleize', s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
const locale = JSON.parse(read('locales/en.default.json'));
engine.registerFilter('t', k => k.split('.').reduce((o, p) => (o || {})[p], locale) || k);

// ---- globals ----
const brand = defaultsOf(JSON.parse(read('config/settings_schema.json')).find(g => g.name === 'Brand').settings);
const products = [
  { handle: 'old-vine-shiraz', title: 'Old Vine Shiraz', price: 6800, type: 'Barossa Valley', description: '<p>Black plum, cracked pepper and cedar.</p>', featured_image: { src: '/assets/bottle-1.png', alt: 'Old Vine Shiraz' }, has_only_default_variant: true, variants: [{ id: 1, title: 'Default', price: 6800, available: true }], selected_or_first_available_variant: { id: 1, title: 'Default', price: 6800, available: true } },
  { handle: 'eden-riesling', title: 'Eden Riesling', price: 3400, type: 'Eden Valley', description: '', featured_image: { src: '/assets/bottle-2.png', alt: 'Eden Riesling' }, has_only_default_variant: true, variants: [{ id: 2, title: 'Default', price: 3400, available: true }], selected_or_first_available_variant: { id: 2, title: 'Default', price: 3400, available: true } },
  { handle: 'ridge-grenache', title: 'Ridge Grenache', price: 5200, type: 'Barossa Ranges', description: '', featured_image: { src: '/assets/bottle-3.png', alt: 'Ridge Grenache' }, has_only_default_variant: true, variants: [{ id: 3, title: 'Default', price: 5200, available: false }], selected_or_first_available_variant: { id: 3, title: 'Default', price: 5200, available: false } }
];
const globalsBase = {
  settings: brand, shop: { name: 'Marlow Vale Estate' }, routes: { root_url: '/', cart_url: '/cart', all_products_collection_url: '/collections/all' },
  cart: { item_count: 2, total_price: 10200, items: [{ image: { src: '/assets/bottle-1.png' }, product: products[0], variant: { title: 'Default' }, url: '/products/old-vine-shiraz', price: 6800, quantity: 1, line_price: 6800 }, { image: { src: '/assets/bottle-2.png' }, product: products[1], variant: { title: 'Default' }, url: '/products/eden-riesling', price: 3400, quantity: 1, line_price: 3400 }] },
  request: { locale: { iso_code: 'en' } }, canonical_url: '', content_for_header: '', page: { handle: 'club', title: 'About', content: '<p>Sample page text.</p>' },
  product: products[0], collection: { title: 'All wines', description: '', products }, paginate: { pages: 1 }
};

async function renderSection(name, id, settingsOverride, blocksIn, env) {
  const schema = schemaOf(name);
  const settings = Object.assign(defaultsOf(schema.settings), settingsOverride || {});
  const blockDefs = Object.fromEntries((schema.blocks || []).map(b => [b.type, defaultsOf(b.settings)]));
  const blocks = (blocksIn || []).map((b, i) => ({ id: `b${i}`, type: b.type, shopify_attributes: '', settings: Object.assign({}, blockDefs[b.type] || {}, b.settings || {}) }));
  // resolve product pickers to real mock products when wanted via settings.__products
  if (env.__withProducts) blocks.forEach((b, i) => { if ('product' in b.settings) b.settings.product = products[i % 3]; });
  const html = await engine.renderFile(`../sections/${name}`, Object.assign({}, globalsBase, env, { section: { id, settings, blocks, shopify_attributes: '' } }));
  return html;
}
async function renderTemplate(file, env = {}) {
  const t = JSON.parse(read(file)); let body = '';
  for (const sid of t.order) {
    const s = t.sections[sid]; const blocks = (s.block_order || []).map(k => s.blocks[k]);
    body += await renderSection(s.type, sid, s.settings, blocks, env);
  }
  const page = await engine.parseAndRender(read('layout/theme.liquid'), Object.assign({}, globalsBase, env, { content_for_layout: body, page_title: env.title || 'Marlow Vale' }));
  return page;
}
(async () => {
  const out = path.join(__dirname, 'dist'); fs.mkdirSync(out, { recursive: true });
  const link = path.join(out, 'assets'); try { fs.rmSync(link, { recursive: true, force: true }); } catch (e) { }
  fs.symlinkSync(path.join(root, 'assets'), link);
  const pages = { 'index.html': ['templates/index.json', {}], 'club.html': ['templates/page.club.json', { __posted: false }], 'club-live.html': ['templates/page.club.json', { __withProducts: true }], 'live.html': ['templates/index.json', { __withProducts: true }], 'product.html': ['templates/product.json', {}], 'collection.html': ['templates/collection.json', {}], 'cart.html': ['templates/cart.json', {}], '404.html': ['templates/404.json', {}] };
  for (const [f, [tpl, env]] of Object.entries(pages)) { fs.writeFileSync(path.join(out, f), await renderTemplate(tpl, env)); console.log('rendered', f); }
})().catch(e => { console.error('RENDER ERROR', e.message); process.exit(1); });
