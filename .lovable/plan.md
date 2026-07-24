## Diagnóstico

O site publicado (`lipovitta.site` e `lipovitta-glow.lovable.app`) está devolvendo um HTML incompleto:

```html
<!DOCTYPE html><html lang="pt-BR">
  <body>
    <div id="root"></div>
  </body>
</html>
```

Sem `<head>`, sem `<title>`, sem `<script>` do bundle → por isso a tela fica em branco.

Já verifiquei:

- **Código-fonte (`index.html`) está correto** — tem head, metas, título.
- **Build local (`npx vite build`) roda com exit 0** e gera um `dist/index.html` completo, com `<script type="module" src="/assets/index-iKlKltgI.js">` e todos os assets.
- **Preview do editor carrega normalmente** — só o deploy publicado está servindo o HTML quebrado.

Ou seja, **o problema não é no código**. É um deploy antigo/corrompido servido pelo hosting da Lovable. Provavelmente uma publicação anterior falhou e a versão servida ficou sem os assets.

## Ação

Republicar o site pelo botão **Publish → Update** no canto superior direito do editor. Isso vai reenviar o `dist/` novo (que está saudável) e o site volta ao ar.

<presentation-actions>
<presentation-open-publish>Republicar o site</presentation-open-publish>
</presentation-actions>

Se depois de republicar o site continuar em branco, me avisa que eu investigo o hosting (caches / domínio custom `lipovitta.site` apontando para um deploy antigo).
