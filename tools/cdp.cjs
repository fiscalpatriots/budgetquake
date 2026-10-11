// Minimal Chrome DevTools Protocol driver for a headless Edge with its own throwaway profile.
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
async function launch(port) {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'bq-edge-'));
  const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-extensions', '--disable-component-extensions-with-background-pages', '--no-service-autorun', '--user-data-dir=' + prof, '--remote-debugging-port=' + port, 'about:blank'], { stdio: 'ignore' });
  let list;
  for (let i = 0; i < 60; i++) {
    try { list = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json(); if (list.find(t => t.type === 'page')) break; } catch (e) {}
    await new Promise(r => setTimeout(r, 250));
  }
  const tgt = list.find(t => t.type === 'page');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pend = new Map(); const waiters = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
    else if (m.method) { for (const w of waiters.slice()) if (w.method === m.method) { waiters.splice(waiters.indexOf(w), 1); w.res(m.params); } }
  });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const once = method => new Promise(res => waiters.push({ method, res }));
  const evalJs = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  const close = async () => { try { await send('Browser.close'); } catch (e) {} proc.kill(); };
  return { send, once, evalJs, close };
}
module.exports = { launch };
