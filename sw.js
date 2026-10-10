/* Service worker do Editor de Esboços e Notas JW.
   Guarda o aplicativo e as bibliotecas (cdnjs) para abrir também sem internet.
   Para publicar uma versão nova: troque VERSAO abaixo (isso faz os aparelhos baixarem de novo). */
const VERSAO = 'v4-05-1';
const CACHE = 'editor-esbocos-' + VERSAO;
const APP = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('editor-esbocos-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Página: tenta a rede (pega versão nova) e cai para a cópia guardada sem internet.
  if (req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put('./index.html', c)); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Bibliotecas (cdnjs) e arquivos do próprio app: usa o guardado e atualiza em segundo plano.
  const ehCdn = url.hostname === 'cdnjs.cloudflare.com';
  if (ehCdn || url.origin === location.origin){
    e.respondWith(
      caches.match(req).then(guardado => {
        const rede = fetch(req).then(r => {
          if (r && (r.ok || r.type === 'opaque')){ const c = r.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); }
          return r;
        }).catch(() => guardado);
        return guardado || rede;
      })
    );
  }
  // Google (Drive/login) e demais endereços: sempre pela rede, sem interferência.
});
