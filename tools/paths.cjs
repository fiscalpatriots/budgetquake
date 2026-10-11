// Needs tools/serve.cjs running on port 8931. Plays every choice path for every household through the real page and checks the arithmetic.
const { launch } = require('./cdp.cjs');
(async () => {
  const b = await launch(9341);
  const load = b.once('Page.loadEventFired');
  await b.send('Page.navigate', { url: 'http://127.0.0.1:8931/' });
  await load;
  const out = await b.evalJs(`(async () => {
    const q = s => document.querySelector(s);
    const parse = t => { t = t.replace(/\u2212/g,'-').replace(/[$,+]/g,''); return parseInt(t, 10); };
    const res = { paths: 0, fails: [], minEnd: 1e9, maxEnd: -1e9, overdraftPaths: 0, badText: 0, byHH: {} };
    for (let hh = 0; hh < 3; hh++) {
      // count choices per card by walking once
      const counts = [];
      if (q('[data-act="again"]')) q('[data-act="again"]').click();
      q('input[name="hh"][value="' + hh + '"]').click(); q('[data-act="start"]').click();
      for (let s = 0; s < 7; s++) { counts.push(document.querySelectorAll('input[name="ch"]').length); q('input[name="ch"][value="0"]').click(); q('#why').value = 'test reason here'; q('[data-act="next"]').click(); }
      const total = counts.reduce((a, c) => a * c, 1);
      const name = ['Jordan','Elena','Marcus'][hh];
      res.byHH[name] = { counts, total, min: 1e9, max: -1e9, over: 0 };
      for (let k = 0; k < total; k++) {
        let r = k; const pick = counts.map(c => { const v = r % c; r = Math.floor(r / c); return v; });
        q('[data-act="again"]').click();
        q('input[name="hh"][value="' + hh + '"]').click(); q('[data-act="start"]').click();
        for (let s = 0; s < 7; s++) { const el = q('input[name="ch"][value="' + pick[s] + '"]'); el.click(); q('#why').value = 'because of the money'; q('[data-act="next"]').click(); }
        // ledger rows must sum to end checking
        const rows = [...document.querySelectorAll('details .sheet tr')];
        const amounts = rows.filter(tr => !tr.classList.contains('total')).map(tr => parse(tr.querySelector('.n').textContent));
        const totals = rows.filter(tr => tr.classList.contains('total')).map(tr => parse(tr.querySelector('.n').textContent));
        const sum = amounts.reduce((a, c) => a + c, 0);
        const endChk = totals[0], endSav = totals[1];
        const top = [...document.querySelectorAll('main > .sheet tr')].map(tr => parse(tr.querySelector('.n').textContent));
        if (sum !== endChk || top[0] !== endChk || top[1] !== endSav) res.fails.push({ name, pick, sum, endChk, top });
        if (/undefined|NaN|null/.test(document.body.innerText)) res.badText++;
        const st = res.byHH[name];
        st.min = Math.min(st.min, endChk + endSav); st.max = Math.max(st.max, endChk + endSav);
        if (document.body.innerText.includes('overdraft fee')) st.over++;
        res.paths++;
      }
    }
    return res;
  })()`);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
