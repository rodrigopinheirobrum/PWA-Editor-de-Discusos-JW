# Pacote web app — Editor de Esboços e Notas JW (v4-05)

Esta pasta é o editor pronto para ser **hospedado** num endereço https. Hospedado assim, ele:
- pode ser **instalado como aplicativo** (Android/Chrome, iPhone/Safari, computador) e abre em tela cheia;
- **abre sem internet** depois da primeira vez (o service worker guarda o app e as bibliotecas);
- permite **Guardar no Drive** (login do Google exige https).

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
Troque o `index.html` no hospedeiro e, em `sw.js`, mude a linha `const VERSAO = '...'` (ex.: `v4-06-1`). Isso faz os aparelhos baixarem de novo; abrir o app duas vezes aplica a atualização.

## 4. Guardar no Google Drive (opcional, uma vez só)
O botão **Guardar no Drive** envia o "Esboço final .html" para a pasta **Discursos JW** do seu Drive (o nome pode ser mudado na engrenagem ao lado do botão). Precisa de um *ID do cliente OAuth* gratuito:
1. Em console.cloud.google.com, crie um projeto. Em *APIs e serviços › Biblioteca*, ative a **Google Drive API**.
2. Em *Tela de permissão OAuth*: tipo **Externo**, preencha nome e seu e-mail; em *Usuários de teste*, adicione o seu e-mail do Google (enquanto o app estiver em "Teste", só esses e-mails entram).
3. Em *Credenciais › Criar credenciais › ID do cliente OAuth*: tipo **Aplicativo da Web**. Em *Origens JavaScript autorizadas*, coloque só o começo do endereço, **sem barra no final** (ex.: `https://seuusuario.github.io`).
4. Copie o ID do cliente (`…apps.googleusercontent.com`), abra **Guardar no Drive** na ferramenta e cole no campo.

Observações: a permissão pedida é a mínima (`drive.file`) — a ferramenta só enxerga arquivos/pastas que ela mesma criou. Se você já criou uma pasta "Discursos JW" à mão, ela não será vista; a ferramenta cria a dela (mova seus arquivos para lá). Sem configurar nada, o botão **Compartilhar** abre a folha de compartilhamento do aparelho, onde você escolhe Drive e a pasta.

## 5. Usar sem hospedar
O `index.html` também funciona sozinho, aberto direto do aparelho/computador — só não instala como app e não faz login no Google (use **Compartilhar**).
