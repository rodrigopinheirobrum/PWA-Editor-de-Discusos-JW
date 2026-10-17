/* Service worker do Editor de Esboços e Notas JW.
   Objetivo: abrir na hora e funcionar sem internet.
   - A PÁGINA abre direto da cópia guardada (nunca espera a rede) e é atualizada em segundo plano para a próxima abertura.
   - As BIBLIOTECAS (cdnjs, versões fixas) ficam num cache próprio: baixadas uma vez e nunca mais revalidadas.
   Para publicar uma versão nova: troque VERSAO abaixo (isso faz os aparelhos baixarem de novo). */
const VERSAO = 'v4-12-1';
const CACHE_APP = 'editor-esbocos-app-' + VERSAO;
const CACHE_LIBS = 'editor-esbocos-libs-1';   // só muda se alguma biblioteca mudar de versão no index.html
const APP = ['./index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css'
];

// Guarda as bibliotecas (e as fontes de ícones citadas no CSS) sem nunca travar a instalação: o que falhar aqui é guardado no primeiro uso.
async function guardarBibliotecas(){
  const cache = await caches.open(CACHE_LIBS);
  await Promise.all(LIBS.map(async url => {
    try{
      if (await cache.match(url)) return;
      const r = await fetch(url, { mode: 'cors' });
      if (!r.ok) return;
      await cache.put(url, r.clone());
      if (url.endsWith('.css')){
        const css = await r.text();
        const base = new URL(url);
        const fontes = new Set();
        css.replace(/url\(\s*["']?([^"')]+\.woff2?[^"')]*)["']?\s*\)/g, (_, u) => { fontes.add(new URL(u, base).href); return _; });
        await Promise.all([...fontes].filter(u => /\.woff2(\?|$)/.test(u) || fontes.size === 1).map(async u => {
          try{ if (!(await cache.match(u))){ const f = await fetch(u, { mode: 'cors' }); if (f.ok) await cache.put(u, f); } }catch(e){}
        }));
      }
    }catch(e){ /* sem rede agora: o primeiro uso guarda */ }
  }));
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const app = await caches.open(CACHE_APP);
    await app.addAll(APP.map(u => new Request(u, { cache: 'reload' })));
    await guardarBibliotecas();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.filter(k => k.startsWith('editor-esbocos-') && k !== CACHE_APP && k !== CACHE_LIBS).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Página: abre da cópia guardada na hora; busca a versão nova em segundo plano (vale na próxima abertura).
  if (req.mode === 'navigate'){
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_APP);
      const guardada = await cache.match('./index.html');
      const buscar = () => fetch('./index.html', { cache: 'no-cache' })
        .then(r => { if (r && r.ok) cache.put('./index.html', r.clone()); return r; })
        .catch(() => null);
      if (guardada){
        // espera 2,5 s para não disputar a rede/CPU com a abertura do app
        e.waitUntil(new Promise(ok => setTimeout(ok, 2500)).then(buscar));
        return guardada;
      }
      const r = await buscar();
      return r || new Response('Sem conexão e sem cópia guardada. Abra uma vez com internet.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
    return;
  }

  // Bibliotecas (cdnjs): cache próprio, sem revalidar (as versões são fixas na URL).
  if (url.hostname === 'cdnjs.cloudflare.com'){
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_LIBS);
      const guardado = await cache.match(req);
      if (guardado) return guardado;
      const r = await fetch(req);
      if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone());
      return r;
    })());
    return;
  }

  // Demais arquivos do próprio aplicativo (manifesto, ícones): do cache; a versão nova entra quando VERSAO muda.
  if (url.origin === location.origin){
    e.respondWith((async () => {
      const guardado = await (await caches.open(CACHE_APP)).match(req, { ignoreSearch: true });
      return guardado || fetch(req);
    })());
  }
  // Google (Drive/login) e demais endereços: sempre pela rede, sem interferência.
});
