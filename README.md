# Dev Cosmo Lab Web

Website institucional e futura vitrine de produtos digitais da **Dev Cosmo Lab**.
Uma única aplicação Next.js, sem backend próprio, banco de dados, autenticação ou CMS.

## Status

Fase 3: Home Cosmic Observatory implementada, aguardando revisão visual da Thread 6
e homologação da Thread 2. A página está disponível em três idiomas, com Hero,
produto em destaque, soluções, laboratório e CTA final. Header, Footer, temas e
controles da Fase 2 foram reaproveitados. Catálogo e detalhes de produtos pertencem às próximas fases.
Não há integração de checkout ou deploy configurado.

O domínio oficial ainda não foi definido. `src/constants/site.constants.ts` utiliza
`http://localhost:3000` exclusivamente como base local de metadados. Essa configuração
deve ser substituída antes de qualquer publicação. A marca utiliza os derivados do
handoff, com variantes dark/light.
O favicon oficial está em `public/favicon.ico`, compartilhado pelos três idiomas.

## Stack

- Next.js 16.3.5 e React 19.2.8.
- TypeScript 5.9.3 com modo strict.
- Tailwind CSS 4.3.3 e tokens semânticos.
- next-intl 4.14.5.
- ESLint 9 e Prettier 3.
- npm com `package-lock.json` versão 3.

## Runtime e instalação

Utilize **Node.js 24** e **npm 11** no desenvolvimento e no CI.
A versão de desenvolvimento registrada em `.nvmrc` é **24.19.0**.
As versões das dependências devem ser reproduzidas pelo lockfile.

```bash
nvm use
npm ci
npm run dev
```

Se não utilizar nvm, selecione o runtime equivalente pelo seu gerenciador de Node.
A aplicação estará disponível em `http://localhost:3000`.
O bootstrap não exige variáveis de ambiente.

## Scripts

| Comando                | Finalidade                                                |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento                               |
| `npm run build`        | Build de produção e verificação de tipos pelo Next.js     |
| `npm start`            | Servir o build localmente                                 |
| `npm run lint`         | Verificação ESLint                                        |
| `npm run typecheck`    | Gerar tipos de rotas do Next.js e executar `tsc --noEmit` |
| `npm run format:check` | Verificar formatação                                      |
| `npm run format`       | Formatar arquivos do projeto                              |

Antes de concluir alterações, execute `format:check`, `lint`, `typecheck` e `build`.
A primeira geração de fontes pelo `next/font/google` pode exigir acesso à rede.

## Estrutura inicial

```text
src/
├── app/[locale]/          # Layout e Home localizada
├── components/           # Shell compartilhado, controles de idioma/tema e Button
├── constants/            # Base local do site e configuração de tema
├── features/home/        # Hero, destaque, soluções, laboratório e CTA
├── features/products/    # Dados e contrato mínimo do produto
├── hooks/                # Persistência local e tema
├── i18n/                 # Roteamento, mensagens e metadados localizados
├── messages/             # pt-BR, en e es
├── styles/               # Tailwind, estilos globais e tokens
├── types/                # Contrato de tema
└── proxy.ts              # Resolução de idioma
```

Componentes seguem as convenções de `AGENTS.md`: pastas próprias, arquivos em
kebab-case, exports nomeados e Client Components somente onde há interação.
Não foram mantidos componentes ou assets pessoais sem uso imediato.

## Internacionalização

O next-intl oferece `pt-BR` como idioma padrão sem prefixo (`/`), inglês em `/en`
e espanhol em `/es`. A troca de idioma preserva caminho, query e hash.
Os namespaces atuais são `common`, `home`, `products` e `metadata`, com a mesma estrutura
nos três idiomas. Apenas as mensagens comuns necessárias aos controles são
enviadas pelo provider ao cliente.

## Temas

Dark é o tema padrão. A preferência dark/light é salva em `localStorage` com a chave
`dev-cosmo-lab-theme` e aplicada em `data-theme` no elemento HTML. O script inicial
e o hook usam a mesma constante. A paleta e os estados do CTA preservam a homologação
da Fase 2, enquanto os overlays usam aliases semânticos próprios da nova composição.

## Fundação visual

Consulte `design-handoff/devcosmo/` antes de qualquer implementação visual. Os mockups
finais aprovados têm prioridade, seguidos pelas especificações, assets e manifesto.
Respeite as substituições finais explícitas documentadas no handoff.
Os arquivos do handoff foram preservados; mockups não são assets de produção.

O shell em `src/app/[locale]/layout.tsx` mantém Header, um único `main` e Footer.
Brand, Container e Section são compartilhados. Os controles interativos e o
bootstrap do tema delimitam os Client Components. O Header inclui navegação por
âncoras e menu mobile. YouTube e Instagram aparecem no Footer sem ação até que suas
URLs oficiais sejam documentadas; demais destinos não confirmados são omitidos. A fonte
Geist foi mantida conforme a homologação anterior.

A Home utiliza as artes Cosmic Observatory aprovadas e CTAs para as âncoras reais
`#featured-product`, `#solutions` e `#laboratory`. Preço, compra e ação de detalhes foram omitidos
até a confirmação dos destinos comerciais. A arte do kit é identificada como ilustrativa.

As seções continuam Server Components. `MotionReveal` é um wrapper cliente leve
para entrada única em viewport com IntersectionObserver/Web Animations, sem biblioteca
de motion. Conteúdo sem JS permanece visível; movimento reduzido e foco por teclado
cancelam a revelação. `ThemedArtwork` usa `getImageProps` e CSS
`image-set` para baixar somente a arte do tema ativo após a seleção da preferência.
`ThemeBootstrap` usa `next/script` com `beforeInteractive` no documento inicial e
restaura os atributos do tema antes da pintura nas navegações de idioma. O conteúdo
é revelado após essa seleção, com fallback dark visível sem JavaScript. Não há
reinserção manual de script durante a navegação. Os assets públicos permanecem intactos; a otimização é feita
pelo Next em runtime. Não há backend ou configuração de deploy.
O histórico Git é novo e independente. O repositório de origem permanece intacto.
