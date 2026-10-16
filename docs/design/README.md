# Dev Cosmo Lab — Handoff Visual V2

**Estado: PARCIAL, MAS UTILIZÁVEL PARA O DESENVOLVIMENTO.** Materiais originais e recortes sem redimensionamento. Consolidado após novos anexos enviados na Thread 5.

## O que mudou nesta versão

- **Hero dark/light corrigidos**: usados os arquivos clean recentes com planeta à direita, sem órbitas e sem o card “Ideias em soluções”. Os arquivos `hero-desktop-{dark,light}.png` substituem os antecedentes do ZIP V1.
- **CTA final corrigido**: usados o horizonte escuro e a paisagem clara com astronauta aprovados nos últimos anexos, sem textos embutidos.
- **Detalhes do Produto**: recuperados **quatro recortes de referência** (desktop dark/light e mobile dark/light) a partir das pranchas fornecidas, sempre com proveniência e resolução real declaradas.
- **Não foi criado mockup fictício do Catálogo**: Figma segue como referência estrutural para suas quatro variantes. Home mobile idem.
- **Conceito ≠ funcionalidade**: preços, estrelas/avaliações, ofertas, garantias, painéis de SaaS e demos de telas nos mockups **não estão automaticamente autorizados como afirmações comerciais**.

## Como integrar ao Next.js

Extraia este ZIP **na raiz do repositório** `dev-cosmo-lab-web`, preservando os diretórios:

- `docs/design/`: documentação, mockups de consulta e pranchas originais. **Não importe essas referências nas páginas como imagens de fundo.**
- `public/assets/brand/`: ícone original e arquivos derivados para uso em header/footer após conferência.
- `public/assets/backgrounds/`: imagens limpas e definitivas do Hero e do banner CTA.
- `public/assets/products/propostas-em-dia/`: composições comerciais visuais do produto, ilustrativas.

No Next.js, assets dentro de `public` são referenciáveis por `/assets/backgrounds/hero-desktop-dark.png`, etc. Não construir interface a partir de screenshot plano; os títulos, botões, idioma, cards e conteúdo serão HTML/React acessível.

### Hierarquia da fonte de verdade

1. **Decisões de direção visual mais recentes**: Cosmic Minimal Premium, Hero clean, texto e botões separados das imagens, catálogo preparado para múltiplos produtos.
2. **Assets de produção aprovados** em `public/assets/`, especialmente a substituição explícita dos backgrounds.
3. **Mockups e pranchas aprovadas**, como referência de estrutura e proporções; ignorar efeitos e anúncios comerciais ultrapassados.
4. **Figma pessoal**, para estrutura, espaçamento, componente de botão, responsividade e temas. Home e Catálogo editáveis; Detalhes não foi construída em Figma.

Em caso de conflito, **não voltar ao Hero antigo só porque ele aparece no mockup de página completa**. A Home final será a composição aprovada com a arte do Hero clean recente.

### Produto e escalabilidade

Propostas em Dia é **o primeiro produto**, não o único previsto. A rota `/produtos` deve suportar vários cards e navegação paginada/carrossel quando existirem produtos. Não repetir cards fictícios para completar a grade. Detalhes devem ser templates dinâmicos por slug. Não existe backend no MVP; aquisição usa Kiwify. Link de checkout deve ser confirmado.

### Fora do MVP

Página de Conteúdo/notícias/blog, mesmo quando visível nas pranchas de outros materiais. Não incluir rota ou navegação ativa para páginas não entregues.

## Disponibilidade e pendências

- **6 arquivos** de mockup de referência em `docs/design/mockups/`: Home desktop dark/light; Detalhes desktop/mobile dark/light. **Os seis são recortes de fontes identificadas; não são seis originais individuais hi-res.**
- **4 pranchas/arquivos visuais de referência** preservados sem alteração.
- **10 arquivos de assets** de produção e marca; derivados de marca ainda devem passar por QA visual.
- **4 documentos**: README, guia de marca, manifesto de assets e referências Figma.
- **6 variantes de mockup não disponíveis** como arte final individual: Home mobile dark/light e Catálogo dark/light desktop/mobile. A falta não bloqueia o front-end graças ao Figma e ao material existente.
- Favicon e demonstração real de produto pendentes.

## Cuidados obrigatórios antes de publicar

- Validar preço R$ 29,90, link oficial, conteúdo e entregáveis do produto no contexto comercial mais recente.
- **Não apresentar descontos, ratings, número de avaliações, garantia de 7 dias ou atualizações gratuitas como fatos** sem confirmação.
- Algumas artes exibem painéis ilustrativos; não transformar o Propostas em Dia em um SaaS fictício. É um **kit digital**.
- Recortes de prancha **não devem ser upscalados e publicados**; servem somente ao Codex como referência visual.
- Validar breakpoints e recortes `object-position` em mobile, contraste e `prefers-reduced-motion`.

**Não foi alterado nenhum repositório GitHub nem gerado código da aplicação.**
