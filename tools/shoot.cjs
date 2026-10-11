// Needs tools/serve.cjs running on port 8931. Saves a full-page screenshot of every screen at each width, and checks overflow and tap targets on each.
const { launch } = require('./cdp.cjs');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2];
const WIDTHS = (process.argv[3] || '320,768,1024,1280').split(',').map(Number);
fs.mkdirSync(OUT, { recursive: true });
const RUNS = [
  { tag: 'en-jordan', lang: 'en', hh: 0, picks: [1, 2, 1, 1, 1, 0, 1], reasons: [
    'I want a little saved in case something breaks this month.',
    'I wanted to keep cash for a few days before paying the big bill.',
    'Forty dollars still gets me texts and calls, and I save money.',
    'I can use my phone for internet and save sixty five dollars.',
    'Cooking most days is cheaper but I still want some takeout.',
    'I really love this band and my friends are all going.',
    'The kiosk was cheaper and I need the phone for work texts.'] },
  { tag: 'es-elena', lang: 'es', hh: 1, picks: [0, 0, 2, 0, 2, 2, 0], reasons: [
    'Necesito todo el dinero para pagar las cuentas primero.',
    'El alquiler es lo más importante y no quiero un recargo.',
    'Lo pago la próxima semana porque me falta dinero ahora.',
    'Mi hijo necesita internet para hacer la tarea.',
    'Trabajo muchas horas y no tengo tiempo para cocinar.',
    'Así le doy la bicicleta nueva sin pagar todo hoy.',
    'Los frenos son peligrosos y manejo todos los días al trabajo.'] },
  { tag: 'en-marcus', lang: 'en', hh: 2, picks: [2, 1, 1, 1, 0, 0, 2], reasons: [
    'Saving a lot early means I am ready for surprises.',
    'Insurance protects our things for only sixteen dollars.',
    'The prepaid lines are cheaper and we do not use much data.',
    'My mom can use my phone hotspot for her calls.',
    'Cooking at home is cheapest and my mom likes to cook.',
    'He is one of my best friends so I want to be there.',
    'It is probably just a sprain and ice should help it.'] }
];
async function metrics(b) {
  return b.evalJs(`(() => {
    const de = document.documentElement;
    const small = [];
    document.querySelectorAll('button, label.choice, textarea, summary, a').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.height < 44 || r.width < 44) small.push((el.id || el.className || el.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    const clipped = [];
    document.querySelectorAll('main *, header *, .progress *').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') clipped.push(el.tagName + '.' + el.className);
    });
    const wide = [];
    document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > de.clientWidth + 0.5) wide.push(el.tagName + '.' + el.className + ' ' + Math.round(r.right)); });
    return { overflowX: de.scrollWidth > de.clientWidth, sw: de.scrollWidth, cw: de.clientWidth, small, clipped, wide: wide.slice(0, 5) };
  })()`);
}
async function shot(b, w, name, log) {
  await new Promise(r => setTimeout(r, 60));
  const m = await b.send('Page.getLayoutMetrics');
  const h = Math.ceil(m.cssContentSize.height);
  const img = await b.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  const file = path.join(OUT, w + '-' + name + '.png');
  fs.writeFileSync(file, Buffer.from(img.data, 'base64'));
  const mt = await metrics(b);
  log.push({ file: path.basename(file), h, ...mt });
}
(async () => {
  const b = await launch(9342);
  const log = [];
  for (const w of WIDTHS) {
    await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: w < 768 ? 640 : 800, deviceScaleFactor: 1, mobile: w < 1024 });
    for (const run of RUNS) {
      const load = b.once('Page.loadEventFired');
      await b.send('Page.navigate', { url: 'http://127.0.0.1:8931/?r=' + Date.now() });
      await load;
      if (run.lang === 'es') await b.evalJs(`document.getElementById('langBtn').click()`);
      const pre = run.tag;
      if (run.tag === 'en-jordan') {
        await b.evalJs(`document.getElementById('teachBtn').click()`);
        await shot(b, w, pre + '-00-teacher-empty', log);
        await b.evalJs(`document.getElementById('teachBtn').click()`);
      }
      await shot(b, w, pre + '-01-start', log);
      await b.evalJs(`document.querySelector('input[name="hh"][value="${run.hh}"]').click()`);
      await shot(b, w, pre + '-02-start-picked', log);
      await b.evalJs(`document.querySelector('[data-act="start"]').click()`);
      for (let s = 0; s < 7; s++) {
        await b.evalJs(`document.querySelector('input[name="ch"][value="${run.picks[s]}"]').click()`);
        if (s === 0 && run.tag === 'en-jordan') {
          await b.evalJs(`(() => { const t = document.getElementById('why'); t.value = 'Just in'; t.dispatchEvent(new Event('input', {bubbles:true})); document.querySelector('[data-act="next"]').click(); })()`);
          await b.evalJs('window.scrollTo(0,0)');
          await shot(b, w, pre + '-03-card1-too-short', log);
        }
        await b.evalJs(`(() => { const t = document.getElementById('why'); t.value = ${JSON.stringify(run.reasons[s])}; t.dispatchEvent(new Event('input', {bubbles:true})); })()`);
        await b.evalJs('window.scrollTo(0,0)');
        await shot(b, w, pre + '-' + String(s + 4).padStart(2, '0') + '-card' + (s + 1), log);
        await b.evalJs(`document.querySelector('[data-act="next"]').click()`);
        if (s === 2 && run.tag === 'en-jordan') {
          await b.evalJs(`document.getElementById('teachBtn').click()`);
          await shot(b, w, pre + '-06b-teacher-midway', log);
          await b.evalJs(`document.getElementById('teachBtn').click()`);
        }
      }
      await shot(b, w, pre + '-11-month-end', log);
      await b.evalJs(`document.querySelector('details').open = true`);
      await shot(b, w, pre + '-12-month-end-ledger', log);
      await b.evalJs(`document.getElementById('teachBtn').click()`);
      await shot(b, w, pre + '-13-teacher', log);
    }
  }
  fs.writeFileSync(path.join(OUT, '_checks.json'), JSON.stringify(log, null, 1));
  const bad = log.filter(x => x.overflowX || x.small.length || x.clipped.length || x.wide.length);
  console.log('shots', log.length, 'with issues', bad.length);
  for (const x of bad) console.log(x.file, JSON.stringify({ o: x.overflowX, sw: x.sw, cw: x.cw, small: x.small, clipped: x.clipped, wide: x.wide }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
