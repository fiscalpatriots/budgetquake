// Opens the page from disk, plays one month, and counts every request the page makes.
const { launch } = require('./cdp.cjs');
(async () => {
  const b = await launch(9343);
  const load = b.once('Page.loadEventFired');
  await b.send('Page.navigate', { url: require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href });
  await load;
  const r = await b.evalJs(`(() => {
    const q = s => document.querySelector(s);
    q('input[name="hh"][value="2"]').click(); q('[data-act="start"]').click();
    for (let s = 0; s < 7; s++) { q('input[name="ch"][value="1"]').click(); q('#why').value = 'a reason with words'; q('[data-act="next"]').click(); }
    return { h1: q('h1').textContent, resources: performance.getEntriesByType('resource').length, protocol: location.protocol,
      storage: (() => { try { return localStorage.length + sessionStorage.length; } catch (e) { return 'blocked'; } })() };
  })()`);
  console.log(JSON.stringify(r));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
