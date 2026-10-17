# Pacote web app — Editor de Esboços e Notas JW (v4-12)

Esta pasta é o editor pronto para ser **hospedado** num endereço https. Hospedado assim, ele:
- pode ser **instalado como aplicativo** (Android/Chrome, iPhone/Safari, computador) e abre em tela cheia;
- **abre na hora e sem internet** depois da primeira vez (o service worker guarda o app e as bibliotecas e não espera a rede para abrir);
- permite **Guardar no Drive** e **Conta Google** (salvar/recuperar esboços ligados à sua conta; o login do Google exige https).

Arquivos: `index.html` (a ferramenta), `manifest.webmanifest`, `sw.js` (service worker) e `icons/`. Mantenha todos juntos na mesma pasta.
Nada do que você escreve vai para o servidor: esboço, notas e backup ficam só no navegador do seu aparelho.

## 1. Hospedar (escolha um — todos gratuitos)

**GitHub Pages** (sugerido)
1. Crie um repositório público no GitHub (ex.: `esbocos`) e envie o conteúdo desta pasta (index.html, sw.js, manifest.webmanifest, icons/).
2. Em *Settings › Pages*, escolha *Deploy from a branch*, ramo `main`, pasta `/ (root)`.
3. Em ~1 minuto o endereço fica `https://SEUUSUARIO.github.io/esbocos/`.

**Netlify Drop** — entre em app.netlify.com/drop e arraste esta pasta; o endereço https sai na hora.
**Cloudflare Pages** — *Create project › Direct Upload*, envie a pasta.

> O repositório/site é público: qualquer pessoa com o endereço abre a *ferramenta* (vazia). Seus esboços e backups nunca ficam lá.

## 2. Instalar no aparelho
- **Android (Chrome):** abra o endereço › botão **Instalar app** da ferramenta (ou menu ⋮ › *Instalar app / Adicionar à tela inicial*).
- **iPhone/iPad (Safari):** abra o endereço › Compartilhar › **Adicionar à Tela de Início**.
- **Computador (Chrome/Edge):** ícone de instalar na barra de endereço, ou o botão **Instalar app**.

## 3. Atualizar para uma versão nova
Troque o `index.html` no hospedeiro e, em `sw.js`, mude a linha `const VERSAO = '...'` (esta versão vem como `v4-12-1`; na próxima, use por exemplo `v4-13-1`). Isso faz os aparelhos baixarem de novo.
O app abre sempre da cópia guardada (por isso é rápido) e busca a versão nova em segundo plano: **abra o app duas vezes** para a atualização aparecer.
As bibliotecas (JSZip, sql.js, mammoth, ícones) ficam num cache separado, `editor-esbocos-libs-1`, que não é apagado a cada versão. Só mude esse número se algum endereço de biblioteca mudar no `index.html`.

## 4. Guardar no Google Drive (opcional, uma vez só)
O botão **Guardar no Drive** envia o "Esboço final .html" para a pasta **Discursos JW** do seu Drive. Na janela dele há **um botão principal** e, recolhida, a seção **Conexão e envio automático** (pasta, ID do cliente, envio automático). Precisa de um *ID do cliente OAuth* gratuito:
1. Em console.cloud.google.com, crie um projeto. Em *APIs e serviços › Biblioteca*, ative a **Google Drive API**.
2. Em *Tela de permissão OAuth*: tipo **Externo**, preencha nome e seu e-mail; em *Usuários de teste*, adicione o seu e-mail do Google (enquanto o app estiver em "Teste", só esses e-mails entram).
3. Em *Credenciais › Criar credenciais › ID do cliente OAuth*: tipo **Aplicativo da Web**. Em *Origens JavaScript autorizadas*, coloque só o começo do endereço, **sem barra no final** (ex.: `https://seuusuario.github.io`). A própria janela da ferramenta mostra o endereço exato a copiar.
4. Copie o ID do cliente (`…apps.googleusercontent.com`), abra **Guardar no Drive**, expanda *Conexão e envio automático*, cole o ID e toque em **Salvar e conectar** (já envia o esboço).

**Envio automático (.mhtml):** com a opção marcada, o esboço completo (texto, comentários e imagens) é enviado ao Drive depois de cada alteração, atualizando sempre o mesmo arquivo `.mhtml`. O login do Google vale cerca de 1 hora e só renova com um toque: quando expira, aparece um aviso com o botão **Reconectar** e o envio fica pendente. Ao fechar a aba só dá para enviar um arquivo pequeno (até ~64 KB); por isso o que vale é o envio feito durante a edição.

Observações: as permissões pedidas são as mínimas — `drive.file` (só enxerga arquivos/pastas que a ferramenta criou) e, desde a v4-10, `drive.appdata` (a pasta **privada do aplicativo**, usada pela Conta Google; não aparece no seu Meu Drive). Quem já conectou na v4-09 precisa **entrar de novo uma vez** para o Google pedir a permissão nova; se a tela de permissão pedir escopos, inclua os dois. Se você já criou uma pasta "Discursos JW" à mão, ela não será vista; a ferramenta cria a dela (mova seus arquivos para lá). Sem configurar nada (ou com o arquivo aberto como `file://`/`content://`, onde o login do Google não funciona), o botão da janela **baixa o .html** ou abre a **folha de compartilhamento** do aparelho, onde você escolhe Drive e a pasta.

## 5. Conta Google: salvar e recuperar (v4-10)
Menu **Salvar › Conta Google**. Usa o **mesmo ID do cliente** da seção 4 (nada novo a criar, só a permissão `drive.appdata` acima).
- **Salvar este esboço na conta:** envia o esboço completo (texto, notas, destaques, imagens) e as **preferências** (tema, tamanho da letra, opções do PDF) para a pasta privada do aplicativo. Salvar de novo atualiza o mesmo arquivo.
- **Recuperar:** a lista mostra o que há na conta (título, data, nº de notas); **Abrir** traz o esboço para a tela (o que está na tela é guardado antes como rascunho), **Aplicar** traz as preferências, a lixeira apaga da conta.
- **Salvar automaticamente** (opcional): 60 s depois de cada alteração. O login do Google vale ~1 hora e só renova com um toque; quando vence, aparece um aviso com **Entrar** e o envio fica pendente.
- **Sair** revoga o acesso neste navegador. O que está salvo na conta continua lá até você apagar.

## 6. Usar sem hospedar
O `index.html` também funciona sozinho, aberto direto do aparelho/computador — só não instala como app e não faz login no Google (use **Compartilhar**).

## 7. "De um link": serviço próprio (opcional, grátis)
O botão **De um link** tenta ler a página direto e, se o site bloquear (o wol.jw.org bloqueia), por serviços públicos (allorigins.win, codetabs.com, r.jina.ai). Como serviços públicos caem ou mudam, dá para ter o seu, em ~5 minutos, no **Cloudflare Workers** (plano grátis, sem cartão):
1. Entre em dash.cloudflare.com › *Workers & Pages* › *Create* › *Create Worker*; dê um nome e publique (*Deploy*).
2. *Edit code*: apague o exemplo e cole o código que aparece na própria janela da ferramenta (**De um link › Serviço próprio › Copiar o código**). Ele só aceita páginas e imagens do jw.org (a v4-10 também traz as imagens do artigo; **quem criou o Worker na v4-09 deve colar o código novo** — a única mudança é aceitar também `jw-cdn.org` e `akamaihd.net`, onde ficam as imagens). Publique de novo. Sem o Worker, desde a v4-11 as imagens que o site não deixa copiar entram ligadas pelo endereço (aparecem com internet).
3. Copie o endereço do Worker (algo como `https://nome.usuario.workers.dev`) e cole na ferramenta, no campo *Endereço do seu serviço*, acrescentando `/?url=` no fim: `https://nome.usuario.workers.dev/?url=`.
Se mesmo assim falhar: **Abrir a página**, copiar tudo e colar na caixa, ou salvar a página (Ctrl+S / Fazer download) e abri-la em **Escolher a página salva**.

## 8. Novidades da v4-12 que mexem no uso
- **Links do WOL:** siglas de publicação com número (`it “Joanã” n.º 5`, `wcg cap. 12`, `lmd lição 1 ponto 5`) viram link de pesquisa em `https://wol.jw.org/pt/wol/pl/r5/lp-t?q=…`, em nova aba.
- **PDF/HTML limpo:** a janela de PDF tem **Sem caixas e bordas** (ligada por padrão).
- **Esboço novo / importar:** o app pergunta se quer baixar o esboço atual em .html antes, e o esboço novo começa sem as notas do anterior.
- **Menu … › Sobre:** versão, desenvolvedor e o que mudou.
