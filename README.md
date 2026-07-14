# Caetano QR

Plataforma web para criar, personalizar e exportar QR Codes, seguindo a identidade
visual da Caetano (Brand Book, abril 2026).

## Stack

- Next.js 14 (App Router) + TypeScript (modo estrito)
- Tailwind CSS com tokens da marca Caetano (cores, tipografia Montserrat, espaçamento)
- React Hook Form + Zod para formulários e validação
- [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) para geração e
  personalização visual do QR Code (cores, gradientes, formas, logótipo)
- Vitest + Testing Library para testes unitários
- Playwright para testes end-to-end

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Estrutura

```text
src/
  app/                 # rotas (App Router)
    page.tsx           # página única: gerador de QR Code
  components/
    ui/                # design system (Button, Input, Tabs, ColorPicker, ...)
    qr/                 # QRPreview, DownloadOptions
    layout/             # Header, Footer
  features/
    qr-generator/       # formulários por tipo, painel de personalização, app principal
  lib/
    qr/                  # payload -> string, opções do qr-code-styling, contraste, correção de erro
    validation/          # schemas Zod por tipo de conteúdo
    security/            # validação de upload e sanitização de SVG
    utils/               # cn, debounce, localStorage
  i18n/                  # dicionário pt-PT (estrutura pronta para en/es)
  types/qr.ts            # modelo de dados partilhado
e2e/                     # testes Playwright
```

## Âmbito implementado (MVP)

- 10 tipos de conteúdo: URL, texto, e-mail, telefone, SMS, WhatsApp, Wi-Fi, contacto
  (vCard), localização e evento.
- Personalização visual: cor dos módulos, cor de fundo, gradiente linear/radial,
  forma dos módulos, forma dos olhos (exteriores/interiores), margem, logótipo,
  nível de correção de erro (com recomendação automática de `H` quando há logótipo).
- Aviso automático de contraste insuficiente (WCAG).
- Pré-visualização em tempo real com debounce e teste de "tamanho de impressão".
- Exportação em PNG, SVG e JPEG, com dimensões predefinidas ou personalizadas,
  fundo transparente, cópia de imagem/conteúdo para a área de transferência.
- Persistência local (`localStorage`, versionada) do tipo e da personalização
  escolhidos — nunca do conteúdo do QR Code (para não guardar dados sensíveis
  como palavras-passe de Wi-Fi).
- Upload de logótipo com validação de MIME/extensão/tamanho e sanitização de SVG
  (remoção de `<script>`, atributos `on*` e `javascript:` antes de qualquer uso).
- Acessibilidade: navegação por teclado (incluindo roving tabindex no seletor de
  tipo e nos separadores), labels associados, mensagens de erro ligadas aos
  campos, `prefers-reduced-motion` respeitado.
- SEO básico (metadata, Open Graph, Twitter Card, robots.txt, sitemap) na
  página única do gerador, que serve também de homepage pública.

## Decisões e simplificações conscientes

- **Localização (endereço → coordenadas):** o formulário aceita latitude/longitude
  diretamente. A conversão de morada via serviço externo não foi implementada
  nesta versão para evitar introduzir uma dependência de API externa (e gestão
  de chaves) sem uma decisão de produto explícita sobre o fornecedor.
- **Logótipo da marca Caetano:** o wordmark é um desenho manual proprietário
  (não deriva de nenhuma tipografia). O cabeçalho usa o ficheiro SVG oficial
  fornecido (`src/components/layout/CaetanoLogo.tsx`), conforme indicado no
  manual de identidade — não é recriado a partir de tipografia.
- **QR Codes dinâmicos, autenticação, analytics e pagamentos** ficam fora deste
  MVP, conforme o âmbito definido, mas o modelo de dados (`QRCodeProject`) foi
  desenhado para acomodar essa evolução sem reescrita.
