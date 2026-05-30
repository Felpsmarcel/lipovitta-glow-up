## Objetivo
Substituir o placeholder vazio (ícone User) na seção **"Para quem é o LipoVitta?"** pela foto da Clara anexada, mantendo as dimensões e layout atuais.

## Alterações

### 1. Copiar imagem anexada
- Origem: foto da Clara no chat (`user-uploads://`)
- Destino: `src/assets/clara-foto.jpg`

### 2. Atualizar `src/components/ForWhoSection.tsx`
- Importar a imagem como módulo ES6 (`import claraFoto from "@/assets/clara-foto.jpg"`).
- Substituir o `div` placeholder (linhas 44–49) por um `<img>` com:
  - `src={claraFoto}`
  - `alt="Clara — depoimento LipoVitta"` (ou similar descritivo)
  - `className="w-72 h-80 md:w-80 md:h-96 rounded-2xl object-cover"`
  - Manter a borda sutil verde: `border-2 border-[rgba(123,163,62,0.4)]`
- Remover o import não utilizado `User` do `lucide-react`.

### 3. Não alterar
- Textos, listas, CTA, cores de fundo, espaçamentos ou responsividade.
- Apenas o elemento visual do placeholder é trocado.

## Resultado esperado
A seção exibe a foto da Clara no lugar do ícone genérico, preservando o layout mobile-first e as proporções `w-72 h-80` (mobile) / `md:w-80 md:h-96` (desktop).