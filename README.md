# Dev Cosmo Lab Web

A **Dev Cosmo Lab** é uma iniciativa autoral de tecnologia dedicada à criação de produtos digitais,
ao desenvolvimento de software sob medida e ao compartilhamento de conhecimento. Este repositório
contém a plataforma web desenvolvida para traduzir essa identidade em uma experiência digital moderna,
conectando apresentação da marca, catálogo de produtos e oportunidades comerciais.

**Website oficial:** [devcosmolab.com](https://devcosmolab.com)

## Sobre o projeto

A plataforma estabelece a presença digital da Dev Cosmo Lab e materializa sua identidade
**Cosmic Minimal Premium**. Sua proposta é reunir produtos digitais, serviços e conteúdo tecnológico
em uma base arquitetural consistente, equilibrando uma experiência premium com manutenção sustentável
e espaço para evolução.

## Funcionalidades

### Home

- Hero com linguagem visual Cosmic Observatory e apresentação da marca.
- Produto em destaque, com acesso aos detalhes.
- Serviços de software sob medida e credibilidade profissional, com link para o portfólio do autor.
- Seção sobre o laboratório e chamadas para conhecer produtos ou iniciar uma conversa comercial.

### Catálogo de produtos

- Busca textual e filtros por categoria, disponibilidade, tipo de produto e faixa de preço.
- Ordenação editorial, por nome ou por preço.
- Identificação de produtos disponíveis, em desenvolvimento e em planejamento.
- Filtros e navegação adaptados a desktop e mobile, com estado refletido na URL.

### Detalhes do produto

- Galeria de imagens, apresentação e especificações.
- Recursos incluídos, etapas de utilização e perguntas frequentes.
- Compra por checkout externo da Kiwify, aberto em nova aba.
- Demonstração em vídeo quando configurada nos dados do produto.

As páginas de detalhes são públicas somente para produtos disponíveis. Produtos em desenvolvimento
ou planejamento aparecem no catálogo, sem oferta pública de acesso ou aquisição.

### Experiência da aplicação

- Internacionalização em PT-BR, inglês e espanhol.
- Temas dark/light e layout responsivo.
- Design System com componentes reutilizáveis e tokens semânticos.
- SEO localizado, URLs canônicas, hreflang e Open Graph.
- Solicitação comercial por formulário guiado, com três idiomas e envio via Formspree quando configurado.
- Link para o [Instagram da Dev Cosmo Lab](https://www.instagram.com/devcosmolab/).

## Stack tecnológica

| Tecnologia        | Versão / uso                              |
| ----------------- | ----------------------------------------- |
| Next.js           | 16.4.2, com App Router                    |
| React / React DOM | 19.3.1                                    |
| TypeScript        | 5.9.x, com modo strict                    |
| Tailwind CSS      | 4, com tokens semânticos                  |
| next-intl         | 4, para traduções e roteamento localizado |
| Radix UI          | Primitivo Select                          |
| Lucide React      | Ícones                                    |
| ESLint / Prettier | Análise estática e formatação             |
| Node.js / npm     | 24 / 11                                   |
| Vercel            | Hospedagem                                |

As versões e faixas de dependências estão em [package.json](package.json). O
[package-lock.json](package-lock.json) registra as versões resolvidas para instalação com `npm ci`.

## Arquitetura

A aplicação utiliza o **Next.js App Router**, com Server Components como padrão e Client Components
para interações, estado e APIs do navegador. A organização por features mantém cada parte da
experiência próxima de seus componentes, contratos, utilitários e testes.

A separação **Controller/View** segue o [AGENTS.md](AGENTS.md): controllers preparam dados, traduções
e comportamento; views recebem propriedades de apresentação. Componentes puramente visuais podem
permanecer em um único arquivo. Os contratos são definidos em TypeScript, com validação nas fronteiras.

```text
src/
├── app/[locale]/          # Layout, metadata e páginas localizadas
│   ├── page.tsx           # Home
│   └── products/          # Catálogo e detalhes em [slug]/page.tsx
├── components/
│   ├── shared/            # Brand, Header, Footer, Container e controles
│   └── ui/                # Primitivos Button e Select
├── constants/             # Configuração de tema
├── features/
│   ├── home/              # Seções da Home e contato comercial
│   ├── catalog/           # Busca, filtros, ordenação e estados do catálogo
│   ├── products/          # Contratos, JSONs, mapper, repositório e componentes de produto
│   └── product-details/   # Composição da página e resumo do produto
├── hooks/                 # Tema e persistência local
├── i18n/                  # Roteamento, carregamento de mensagens e metadata
├── messages/              # Catálogos pt-BR, en e es
├── styles/                # Tailwind, estilos globais e tokens semânticos
├── types/                 # Contratos compartilhados de tema
└── proxy.ts               # Resolução de idioma com next-intl
```

Os produtos são definidos em [src/features/products/data](src/features/products/data). O repositório
existente lê esses dados e os valida pelo mapper antes de disponibilizá-los à aplicação, incluindo
taxonomia, informações comerciais, URLs e referências de mídia.

A plataforma tem arquitetura front-end, com renderização no servidor pelo Next.js. Não possui backend
próprio, banco de dados, autenticação ou CMS. Compra, demonstração e contato direcionam a serviços
externos; não há checkout processado pela própria aplicação.

## Internacionalização e rotas

O `next-intl` utiliza `pt-BR` como idioma padrão sem prefixo, inglês em `/en` e espanhol em `/es`.
A troca de idioma preserva caminho, parâmetros de consulta e fragmento da URL.

| Idioma | Home  | Catálogo       | Propostas em Dia                |
| ------ | ----- | -------------- | ------------------------------- |
| PT-BR  | `/`   | `/products`    | `/products/propostas-em-dia`    |
| EN     | `/en` | `/en/products` | `/en/products/propostas-em-dia` |
| ES     | `/es` | `/es/products` | `/es/products/propostas-em-dia` |

O segmento `products` é utilizado nos três idiomas. Produtos indisponíveis ou slugs inexistentes
retornam 404 ao tentar acessar seus detalhes. A configuração está em
[src/i18n/routing.ts](src/i18n/routing.ts), integrada ao [proxy](src/proxy.ts).

## Identidade visual e experiência

A identidade **Cosmic Minimal Premium** utiliza a linguagem **Cosmic Observatory** para conectar
marca, produtos e serviços. Os temas dark e light compartilham componentes e tokens; a preferência
visual é persistida em `localStorage`, com dark como padrão.

O layout se adapta a diferentes tamanhos de tela, com assets responsivos e otimizados pelo Next.js
quando aplicável. A interface utiliza motion sutil, foco visível e regras para
`prefers-reduced-motion`. Os assets públicos ficam em [public/assets/devcosmo](public/assets/devcosmo),
e os tokens semânticos em [src/styles/globals.css](src/styles/globals.css).

## SEO e compartilhamento

A Metadata API nativa do Next.js define títulos e descrições localizados, canonical, hreflang e
Open Graph para Home, catálogo e detalhes de produtos disponíveis. Os detalhes reutilizam o SEO
localizado dos dados do produto, com fallback para nome e descrição curta.

O domínio configurado para metadata é **https://devcosmolab.com**. As URLs canônicas e alternativas
são geradas pelo helper de [src/i18n/metadata.ts](src/i18n/metadata.ts), respeitando o roteamento do
`next-intl`.

A imagem de compartilhamento utilizada é
[`hero-1200.webp`](public/assets/devcosmo/home/dark/hero-1200.webp), com dimensões reais de
**1200 × 675 px**, compartilhada por Home, catálogo e detalhes nesta versão.

## Ambiente e execução local

Requisitos: **Node.js 24** e **npm 11**, conforme os `engines` do projeto. O arquivo
[.nvmrc](.nvmrc) registra Node.js 24.19.0.

```bash
nvm use
npm ci
npm run dev
```

Se não utilizar nvm, selecione uma versão compatível pelo seu gerenciador de Node.js. O servidor
de desenvolvimento fica disponível em [http://localhost:3000](http://localhost:3000).

### Contato comercial

Os CTAs comerciais abrem a mesma instância do Chat Comercial Premium. O fluxo pode ser
validado localmente sem enviar dados. A submissão requer um endpoint Formspree válido
em `DEVCOSMO_FORMSPREE_ENDPOINT`. Configure apenas o endpoint público confirmado em
`.env.local`, sem versionar o arquivo. Sem endpoint válido, o envio fica desabilitado.
A revisão informa a finalidade do uso dos dados e o processamento pelo Formspree.

A ativação operacional também exige validação do formulário e teste real autorizado,
com confirmação de recebimento. A integração local não equivale à publicação.

Variáveis utilizadas no build devem ser configuradas separadamente no provedor de hospedagem;
o `.env.local` não configura o ambiente publicado. A geração de fontes por `next/font/google`
também pode exigir acesso à rede durante o build.

## Scripts e qualidade

| Comando                | Responsabilidade                                         |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Iniciar o servidor de desenvolvimento                    |
| `npm run build`        | Gerar o build de produção e verificar tipos pelo Next.js |
| `npm run start`        | Servir um build de produção previamente gerado           |
| `npm run lint`         | Executar a análise estática com ESLint                   |
| `npm run typecheck`    | Gerar tipos de rotas e executar `tsc --noEmit`           |
| `npm run format`       | Formatar os arquivos com Prettier                        |
| `npm run format:check` | Verificar a formatação sem modificar arquivos            |

Para alterações na aplicação, execute `format:check`, `lint`, `typecheck` e `build`, além dos checks
de diff e testes relevantes previstos no [AGENTS.md](AGENTS.md). Há testes co-localizados para regras
do catálogo, validação dos produtos, contato e resumo do produto; não existe um script npm `test`.

## Deploy

A V1 está publicada na **Vercel**, com website oficial em [devcosmolab.com](https://devcosmolab.com).
O código está no [repositório GitHub](https://github.com/joaoalmeida25/dev-cosmo-lab-web).

O build de produção é gerado por `npm run build`. Configure as variáveis de ambiente aplicáveis
também na Vercel e utilize Node.js 24 e npm 11 no ambiente de build. As regras de contribuição,
aprovação e publicação estão no [AGENTS.md](AGENTS.md).
