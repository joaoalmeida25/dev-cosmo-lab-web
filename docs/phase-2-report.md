# Fase 2 — Fundação Visual e Técnica

**Estado atual após a Fase 2.3:** ajustes da homologação visual aplicados e validados;
entrega técnica concluída, aguardando aprovação final/autorização da Thread 6.
CTA, foco, disabled e favicon estão corrigidos. Consulte a seção final
“Encerramento — Fase 2.3” para os valores e resultados vigentes.

**Histórico:** as seções abaixo da implementação inicial e da revisão técnica
registram o estado anterior à chegada das decisões da Thread 5. Seus tokens,
pendências de CTA/favicon e matrizes antigas foram superados pelos resultados 2.3,
sem apagar as evidências originais.

## A. Resumo executivo

Implementação disponível para homologação, com pendências de design explícitas.
Não declarar aceite integral enquanto favicon e contraste do CTA estiverem pendentes.

- Header e Footer globais, marca por tema, Container compartilhado e Button existente adaptado.
- Paleta operacional do guia integrada ao mecanismo CSS variables/Tailwind; Geist mantida.
- Home temporária preservada; um único `main` no layout Server Component.
- Controles existentes integrados ao Header, sem FloatingControls duplicado.
- Traduções comuns em pt-BR/en/es; atalho de teclado para o conteúdo.
- Ajustado o retorno ao idioma padrão para `/`, preservando query e hash.
- Sem dependências novas, commits, push, deploy ou alterações no portfólio/Figma.

O preflight confirmou diretório, remoto `joaoalmeida25/dev-cosmo-lab-web`, branch
`main` e Node 24.19.0/npm 11.17.0. Os materiais do handoff já estavam no stage antes
desta execução; esse estado foi preservado. Não houve extração ou sobrescrita.
O ZIP V2 de Downloads passou no teste de integridade e todos os seus 24 arquivos
são idênticos aos extraídos. Os 20 hashes de imagens do manifesto conferem.

## B. Handoff visual

| Material                        | Encontrado        | Utilizado                                                     | Pendência                                                                        |
| ------------------------------- | ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Guia de marca                   | Sim               | Paleta operacional, Geist, botões, identidade                 | Paleta ainda não certificada como kit final                                      |
| Manifesto                       | Sim               | Caminhos, proveniência, hashes e restrições                   | Ausências declaradas preservadas                                                 |
| Mockups Home desktop dark/light | Sim               | Inspeção visual de Header/Footer/controles                    | Recortes de prancha com resolução limitada                                       |
| Mockups Home mobile             | Não               | Figma 5:154 e 5:211 como complemento                          | Duas artes finais individuais ausentes                                           |
| Mockups Catálogo                | Não               | Estruturas Figma desktop/mobile para consistência             | Quatro artes finais individuais ausentes                                         |
| Mockups de Detalhes             | Sim               | Mobile dark/light inspecionados como complemento de controles | Página fora desta fase; recortes mobile não mostram Footer completo              |
| Logo e ícone                    | Sim               | Derivados on-dark/on-light no Header e Footer                 | Master opaco preservado; derivados raster sujeitos à homologação final de bordas |
| Favicon                         | Não               | Nenhum substituto criado                                      | Arquivo aprovado necessário                                                      |
| Tokens                          | Parcial           | Valores operacionais exatos do guia                           | Estados, efeitos e escala ainda provisórios                                      |
| Fontes                          | Geist documentada | Configuração next/font existente mantida                      | Nenhum binário novo                                                              |

Documentos lidos na ordem solicitada: README, guia, manifesto e referências Figma.
Os quatro assets institucionais foram visualmente inspecionados; os derivados
on-dark/on-light foram conferidos também no tamanho renderizado em ambos os temas.
Não há deformação de proporção; o nome da marca permanece texto acessível.

Figma pessoal consultado somente em leitura: Home 5:10, 5:82, 5:154 e 5:211;
Catálogo 29:22 e 29:163 como amostras estruturais. Os PNGs locais têm precedência
visual; as substituições finais explícitas de assets do V2 permanecem válidas.
Não é necessário reproduzir os links futuros ou as colunas sem destinos válidos.

## C. Componentes

Caminhos relativos à raiz do repositório.

| Componente       | Arquivo                                                   | Alteração                                                     | Status                                |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------- |
| Header           | `src/components/shared/header/header.component.tsx`       | Marca, Início desktop, idioma e tema                          | Implementado                          |
| Footer           | `src/components/shared/footer/footer.component.tsx`       | Marca, texto aprovado, Início e copyright traduzidos          | Implementado                          |
| Brand            | `src/components/shared/brand/brand.component.tsx`         | Imagens locais por tema, proporções e link localizado         | Implementado                          |
| Container        | `src/components/shared/container/container.component.tsx` | Max-width 1440px e padding 24/40/80px                         | Implementado; medidas provisórias     |
| Section          | —                                                         | Não criado: nenhum padrão de seções reutilizado nesta fase    | Omitido intencionalmente              |
| Button           | `src/components/ui/button/button.component.tsx`           | Controles arredondados, tamanhos 44–48px, superfície discreta | Adaptado; contraste primário pendente |
| LanguageToggle   | `src/components/language-toggle/`                         | Chevron, opções de 44px e URL canônica ao trocar idioma       | Validado                              |
| ThemeToggle      | `src/components/theme-toggle/theme-toggle.component.tsx`  | Integração no Header, persistência mantida                    | Validado                              |
| FloatingControls | `src/components/floating-controls/`                       | Wrapper e classes exclusivos removidos                        | Removido                              |
| Layout global    | `src/app/[locale]/layout.tsx`                             | Header/main/Footer e skip link                                | Server Component preservado           |
| Home temporária  | `src/features/home/home.component.tsx`                    | Container e remoção de main/controles próprios                | Preservada                            |

Sem menu mobile expansível: há apenas uma página; o logo fornece acesso funcional
à Home em todas as larguras. A navegação textual desktop continua disponível.
Produtos, Conteúdo, Sobre, Contato e redes sociais não ganharam links fictícios.
O Footer tem apenas as informações/destinos disponíveis, com empilhamento mobile.

O seletor usa `getPathname` do next-intl com o router do Next para resolver o caminho
canônico diretamente. O router localizado anterior forçava prefixo na troca e deixava
`/pt-BR` no retorno. Configuração de routing, proxy e providers foram preservados.
O fluxo SPA traduz o conteúdo e mantém query/hash sem recarregamento completo.

## D. Design tokens

Valores efetivamente configurados em `src/styles/globals.css`. “Guia” significa
base operacional documentada, não homologação de um kit final de marca.

| Token CSS                             | Dark                        | Light                    | Origem/status                                               |
| ------------------------------------- | --------------------------- | ------------------------ | ----------------------------------------------------------- |
| `--background`                        | `#080C18`                   | `#FAFAFE`                | Guia: bg                                                    |
| `--surface`                           | `#11182B`                   | `#FFFFFF`                | Guia: surface                                               |
| `--border`                            | `#27304B`                   | `#E2E7F1`                | Guia: stroke                                                |
| `--text-primary`                      | `#F5F6FB`                   | `#12172B`                | Guia: text                                                  |
| `--text-secondary`                    | `#A5AFC4`                   | `#656F86`                | Guia: muted                                                 |
| `--accent`                            | `#A79DFC`                   | `#6665DD`                | Guia: accent                                                |
| `--primary`                           | `#696BEC`                   | `#696BEC`                | Guia: CTA sólido observado                                  |
| `--primary-soft`                      | `#191E37`                   | `#EEF0FF`                | Guia: soft                                                  |
| `--primary-foreground`                | `#FFFFFF`                   | `#FFFFFF`                | Fallback para texto branco do protótipo; contraste pendente |
| `--background-soft`                   | primary-soft                | primary-soft             | Fallback de background secondary                            |
| `--surface-hover`                     | primary-soft                | primary-soft             | Fallback de interação                                       |
| `--text-muted`                        | text-secondary              | text-secondary           | Fallback sem terceira tonalidade inventada                  |
| `--primary-hover`                     | primary                     | primary                  | Fallback; Button usa brilho provisório de 110%              |
| `--focus-ring`                        | accent                      | accent                   | Fallback de foco                                            |
| `--icon-surface`, `--chip-background` | primary-soft                | primary-soft             | Aliases provisórios preservados                             |
| `--hero-gradient-from/to`             | primary/accent              | primary/accent           | Fallback; não aplicado à Home temporária                    |
| `--ambient-glow`                      | primary 12%/transparente    | primary 12%/transparente | Fallback de efeito                                          |
| `--radius-control`                    | 9999px                      | 9999px                   | Cápsulas dos mockups; valor não homologado                  |
| `--radius-card`                       | 16px                        | 16px                     | Fallback herdado, dentro da faixa do guia                   |
| `--shadow-card`                       | 0 4px 16px, text-primary 6% | Igual                    | Fallback herdado                                            |
| `--shadow-primary`                    | 0 4px 24px, ambient-glow    | Igual                    | Fallback herdado                                            |

Container: largura máxima 1440px, padding horizontal 24px, 40px a partir de 768px e
80px a partir de 1024px. Header: 76px mobile e 88px desktop. Valores estruturais
operacionais, não escala homologada. Bordas de 1px conforme guia.

Geist Sans: H1 36/48px em tamanhos mobile/desktop, semibold; body 16/18px,
line-height confortável; navegação/body do Footer 14px; marca 10/12px semibold,
labels e captions 12px. A hierarquia continua local aos componentes necessários;
não foi criado sistema tipográfico global para seções futuras. Geist Mono preservada.

## E. Validações

| Verificação              | Resultado       | Evidência                                                                                        |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------------ |
| Integridade ZIP e assets | Passou          | CRC do ZIP, comparação byte a byte e 20 SHA-256                                                  |
| `npm run format:check`   | Passou          | Código e documentação produzida formatados; handoff original excluído                            |
| `npm run lint`           | Passou          | ESLint, exit 0                                                                                   |
| `npm run typecheck`      | Passou          | next typegen e tsc --noEmit, exit 0                                                              |
| `npm run build`          | Passou          | Next 16.3.5, três locales pré-renderizados, exit 0                                               |
| `/`, `/en`, `/es`        | Passou          | Chromium no build de produção local, porta 3100                                                  |
| Responsividade           | Passou          | 24 combinações: 3 rotas × 2 temas × 375/768/1024/1440px                                          |
| Estrutura/controles      | Passou          | Um header, footer e main; dois controles visíveis; alvos de pelo menos 44px                      |
| Idiomas                  | Passou          | PT → EN → ES → PT, URL canônica, query e hash preservados                                        |
| Tema/persistência        | Passou          | Alternância por botão e reload com localStorage                                                  |
| Teclado                  | Passou no smoke | Tab/Enter no skip link, foco no main; Escape fecha seletor e restaura foco                       |
| Seletor de idioma        | Passou          | Clique fora fecha; opções traduzidas funcionais                                                  |
| Links                    | Passou          | Home localizada, marca e alvo do skip link existentes; sem `href="#"`                            |
| Overflow e imagens       | Passou          | Sem overflow nas 24 combinações; imagens visíveis carregadas e proporcionais                     |
| Hidratação/runtime       | Passou          | Nenhum pageerror ou mensagem de hidratação                                                       |
| Recursos ausentes        | Ressalva        | Navegador requisita favicon.ico inexistente e registra um 404; nenhum asset usado pela UI faltou |
| Comparação visual        | Executada       | Oito screenshots pt-BR inspecionados; Header/Footer/controles em dark/light e quatro larguras    |
| Contraste                | Parcial         | Texto secundário 8,86:1 dark e 4,84:1 light; accent 8,24:1/4,51:1; CTA branco 4,27:1             |
| Escopo                   | Preservado      | Sem Home comercial, catálogo, backend ou configuração de deploy                                  |

Ambiente: Google Chrome for Testing 149.0.7827.55, headless via Playwright já
existente no ambiente; nenhuma dependência adicionada ao projeto. Viewports com
900px de altura. As verificações mediram overflow, dimensões e carregamento; as
capturas foram também inspecionadas visualmente. Isso não equivale a homologação
de design nem a teste em aparelhos físicos.

Evidências permanentes: [resultados de navegador](qa/phase-2/browser-results.json),
[screenshot mobile dark](qa/phase-2/375-dark.png),
[mobile light](qa/phase-2/375-light.png),
[desktop dark](qa/phase-2/1440-dark.png) e
[desktop light](qa/phase-2/1440-light.png).
Capturas de 768px e 1024px em ambos os temas também estão em `docs/qa/phase-2/`.

O primeiro format:check detectou formatação nos documentos originais do handoff.
`docs/design/` foi incluído no `.prettierignore` para preservá-los byte a byte,
sem reformatar ou substituir documentação recebida. Código novo permanece verificado.

## F. Pendências

- **Design:** favicon aprovado; validação de contraste do CTA `#696BEC` com branco
  (4,27:1, abaixo de 4,5:1 para texto pequeno, ainda menor com brilho no hover).
  O Button primário não é usado na Home temporária. Não criar tonalidade alternativa
  sem decisão de design. Homologar cores finais, raios, estados, sombras e espaçamentos.
- **Referências:** Home mobile dark/light e quatro mockups finais do Catálogo ausentes;
  estrutura Figma disponível. Os recortes atuais não oferecem medição de alta precisão.
- **Técnicos:** nenhum bloqueio de compilação. O favicon ausente impede declarar
  ausência total de recursos 404. Domínio oficial ainda pendente desde a Fase 1.
- **Validações não executadas:** aparelhos físicos, Safari/Firefox, leitor de tela e
  auditoria completa de acessibilidade. Validação de botão primário nesta fase foi
  revisão de código/contraste; não houve tela de demonstração nem teste visual de
  todas as variantes/estados sem uso atual.
- **Opcionais:** originais vetoriais de marca para melhor qualidade em alta densidade;
  homologação visual final dos derivados raster pelo design.
- **Adiamentos intencionais:** navegação Produtos, redes, Sobre/Contato, Section sem
  uso, favicon não aprovado, Hero/destaque/ecossistema/CTA, catálogo e detalhes.

## G. Próximo passo — Fase 3

Shell tecnicamente pronto para receber a Home, condicionado à homologação da Fase 2.
Resolver contraste antes de usar CTAs comerciais; favicon e decisões visuais pendentes
continuam registradas. Não iniciar automaticamente a próxima fase.

Referências previstas: `docs/design/mockups/home/home-desktop-{dark,light}.png` para
composição, frames Home mobile 5:154/5:211 para estrutura responsiva e as decisões
finais do V2. Assets previstos: `hero-desktop-{dark,light}.png` e `cta-{dark,light}.png`
em `public/assets/backgrounds/`, além de `featured-{dark,light}.png` em
`public/assets/products/propostas-em-dia/`. Usar o Hero clean atualizado, com texto e
botões em HTML, sem importar screenshots da página. Conteúdo comercial, checkout,
preço e afirmações ilustrativas do produto ainda precisam de confirmação específica.

## Revisão técnica final — preparação para homologação

### A. Resumo

Revisão realizada após a implementação, sem alteração do código da aplicação.
Nenhum problema técnico relevante foi confirmado que justificasse refatoração ou
correção funcional. Os componentes permanecem tecnicamente prontos para homologação,
condicionados às decisões visuais ainda sob responsabilidade da Thread 5.

Foram revisados Header, Footer, Brand, Container, Button, LanguageToggle,
ThemeToggle, layout, Home temporária, tokens, hooks de tema/persistência e integração
de internacionalização. Confirmados: exports e interfaces conforme AGENTS, semântica
nativa, um único main, assets locais proporcionais, providers preservados e Client
Components restritos à interatividade. Não há referência ao FloatingControls removido,
link fictício, dependência nova nem necessidade atual de outra abstração.

Não foram alterados cores, hover/focus, marca, favicon, mockups, documentação original
do handoff ou estratégia de routing. A correção da URL canônica `/` foi preservada.

### B. Arquivos modificados nesta revisão

| Arquivo                                            | Alteração                                              | Justificativa                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                                        | Processo oficial e proibição de commit/push automático | Documentar Implementação → Validação → Revisão → Ajustes → Aprovação → Commit → Push → Próxima fase |
| `docs/phase-2-report.md`                           | Esta seção de revisão final                            | Separar conclusões e testes novos dos resultados anteriores                                         |
| `docs/qa/phase-2/technical-review-results.json`    | Nova evidência de navegador                            | Smoke proporcional no build de produção, sem sobrescrever a matriz anterior                         |
| `docs/qa/phase-2/technical-review-file-audit.json` | Nova evidência de auditoria                            | Registrar escopo da busca, integridade e candidatos a versionamento                                 |

README revisado e coerente com o estado implementado; nenhuma alteração necessária
nesta revisão. Não houve modificação em arquivos TS/TSX/CSS ou dependências.

### C. Validações desta revisão

| Comando/verificação    | Resultado                     | Evidência                                                                                                                        |
| ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check` | Passou                        | Prettier, exit 0; handoff original continua preservado                                                                           |
| `npm run lint`         | Passou                        | ESLint, exit 0                                                                                                                   |
| `npm run typecheck`    | Passou                        | next typegen + tsc --noEmit, exit 0                                                                                              |
| `npm run build`        | Passou                        | Next 16.3.5, geração estática dos três locales, exit 0                                                                           |
| Smoke novo de produção | Passou                        | `technical-review-results.json`: seis combinações de rota/largura                                                                |
| Idiomas e navegação    | Passou                        | PT → EN → ES → PT; retorno a `/`; query/hash preservados; links do Header/Footer localizados                                     |
| Tema                   | Passou                        | Dark → light → reload e light → dark → reload; light preservado ao trocar os três idiomas                                        |
| Teclado                | Passou                        | Enter abre seletor; Tab alcança opção; Escape fecha e devolve foco; seleção por Enter; skip link leva ao main                    |
| Responsividade básica  | Passou                        | `/` em 375/768/1024/1440px; `/en` e `/es` em 1440px; sem overflow; alvos de pelo menos 44px                                      |
| Runtime/assets         | Passou com ressalva existente | Nenhum pageerror, erro de hidratação ou requestfailed; imagens visíveis carregadas; console registra somente favicon.ico ausente |
| Integridade            | Passou                        | 20 hashes SHA-256 do manifesto conferidos novamente                                                                              |
| Índice Git/HEAD        | Preservados                   | Snapshot do índice e HEAD antes/depois idênticos                                                                                 |

Este smoke novo usa Chromium 149.0.7827.55 sobre `npm start -- --port 3100`.
As oito capturas e a matriz de 24 combinações da implementação são **evidência
anterior**, não foram recriadas ou apresentadas como novos testes desta revisão.
A automação de teclado aguarda o estado aberto/visível do seletor antes de avançar
com Tab; não foi necessário alterar o componente. Os scripts temporários permaneceram
fora do repositório. Sem novos testes em aparelhos físicos, Safari/Firefox ou leitor
de tela; as limitações anteriores continuam válidas.

### D. Git e revisão de versionamento

- Branch: `main`, remoto `joaoalmeida25/dev-cosmo-lab-web` confirmado.
- **Staged:** os mesmos 24 arquivos do handoff original, sem alteração no índice.
- **Unstaged tracked:** 15 caminhos da implementação já estavam alterados, incluindo
  as duas remoções de FloatingControls. Nesta revisão somente AGENTS foi editado
  entre esses arquivos; as demais alterações preexistentes foram preservadas.
- **Novos/untracked:** relatório, quatro componentes compartilhados, oito screenshots,
  JSON da matriz anterior e dois novos JSONs desta revisão. Permanecem fora do staging.
- Nenhum commit, push, reset, clean, deploy ou acesso ao portfólio para alterações.

A auditoria inicial cobriu 51 arquivos existentes candidatos a adição/modificação
(31.184.579 bytes, cerca de 29,74 MiB; excluídas as duas remoções). Inclui texto,
assets oficiais, documentos e evidências. Nenhum padrão de chave privada, token
comum de provedor ou atribuição de credencial foi encontrado; isso descreve uma
inspeção local por padrões, não uma certificação exaustiva de ausência de secrets.
Nenhum arquivo pessoal, fonte binária de terceiros, ZIP, arquivo comercial completo,
cache, build ou dependência foi identificado entre os candidatos. Os PNGs não
contêm campos de metadados adicionais detectados na inspeção.

`node_modules/`, `.next/`, `.idea/`, `next-env.d.ts`, `*.tsbuildinfo`, `.env*`,
logs e demais temporários devem continuar fora do commit; as regras de ignore
existentes já cobrem esses arquivos. Package.json e lockfile não foram alterados.

Antes desta revisão, as nove evidências de QA ocupavam 431.523 bytes (421,4 KiB).
É razoável mantê-las versionadas: custo pequeno, escopo delimitado e utilidade para
homologação. Os dois novos JSONs são pequenos e identificados como revisão técnica.
Não houve remoção ou substituição de evidências. O volume maior está no handoff
oficial; mockups/pranchas e assets de produção têm papéis distintos e devem ser
preservados. Nenhuma duplicação adicional de assets foi introduzida.

### E. Pontos exatos de integração da Thread 5

| Decisão                          | Arquivo/ponto                                                                                                                  | Aplicação futura após aprovação                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paleta e CTA                     | `src/styles/globals.css`, seletores `:root[data-theme='dark']` e `:root[data-theme='light']`                                   | Atualizar `--primary`, `--primary-foreground`, `--accent` e demais valores expressamente aprovados; manter CSS variables/Tailwind                             |
| Hover                            | `src/styles/globals.css`, aliases provisórios                                                                                  | Atualizar `--primary-hover` e `--surface-hover`; homologar os valores de cada tema                                                                            |
| Hover do Button                  | `src/components/ui/button/button.component.tsx`, `variantClasses.primary`                                                      | Reavaliar/remover `enabled:hover:brightness-110` e `[&[href]]:hover:brightness-110` quando houver hover oficial; preservar estados de button e anchor         |
| Focus                            | `src/styles/globals.css`, `--focus-ring`; classes `focus-visible:*`                                                            | Aplicar token aprovado e validar espessura/offset conforme decisão; consumidores: Button, opções de idioma, Brand, links do Header/Footer e skip link         |
| Controles                        | `src/components/theme-toggle/theme-toggle.component.tsx` e `src/components/language-toggle/language-toggle-view.component.tsx` | Conferir estados/cores efetivamente computados com a variante secondary do Button, sem presumir que className resolve classes concorrentes                    |
| Efeitos/geometria                | `src/styles/globals.css`, `@theme inline` e aliases                                                                            | Atualizar raios, sombras, gradientes e glow somente se especificados; containers/alturas só mudam mediante referência aprovada                                |
| Favicon                          | Asset único em `public/assets/brand/` conforme manifesto atualizado; `metadata.icons` em `src/app/[locale]/layout.tsx`         | Apontar para o arquivo aprovado por URL `/assets/brand/...`; não gerar substituto nem duplicar imagem                                                         |
| Convenção alternativa de favicon | `src/app/favicon.ico`                                                                                                          | Next admite favicon automático na raiz de app; só adotar se essa organização for escolhida, sem cópia duplicada. Não colocar favicon.ico dentro de `[locale]` |
| Metadados existentes             | `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/i18n/metadata.ts`                                             | Ícones são globais no layout; preservar title/description traduzidos e canonical/alternates das páginas                                                       |
| Domínio oficial                  | `src/constants/site.constants.ts`, consumido por metadataBase                                                                  | Trocar localhost somente quando houver domínio confirmado; pendência anterior independente do favicon                                                         |
| Marca/referências                | `src/components/shared/brand/brand.component.tsx`, `docs/design/` e manifesto                                                  | Consumir apenas assets/variantes aprovados; sem redesenho nem sobrescrita do handoff original                                                                 |

Nenhum desses ajustes visuais foi implementado nesta revisão. O contraste atual do
CTA continua pendente (4,27:1 para branco sobre `#696BEC`); o favicon segue ausente.

### F. Checklist final da revisão técnica

- [x] Código revisado.
- [x] Problemas técnicos relevantes resolvidos — nenhum novo problema confirmado.
- [x] Internacionalização preservada.
- [x] Temas preservados.
- [x] Documentação coerente.
- [x] Arquivos de commit revisados.
- [x] Formatação aprovada.
- [x] Lint aprovado.
- [x] TypeScript aprovado.
- [x] Build aprovado.
- [x] Decisões visuais pendentes identificadas.
- [x] Nenhum commit ou push realizado.

Este checklist é da revisão técnica; não representa homologação dos valores visuais
pendentes nem autorização para versionamento.

### G. Próxima ação

Receber os valores/assets aprovados da Thread 5 com proveniência e manifesto
atualizado. Aplicar apenas as decisões entregues nos pontos acima, revalidar contraste,
foco/hover, favicon e componentes afetados nos dois temas; atualizar este relatório
com as novas evidências. Em seguida, obter aprovação da Fase 2. Commit e push somente
mediante autorização explícita, seguindo a sequência registrada em AGENTS.md.
A Fase 3 não foi iniciada.

## Encerramento — Fase 2.3

### A. Resumo vigente

A Thread 5 homologou visualmente a Fase 2 com ajustes pontuais em
`docs/design/phase-2-decisions.md`. As condições obrigatórias foram aplicadas e
verificadas em build de produção. **Fase 2 concluída tecnicamente e apta à aprovação
final da Thread 6.** Nenhum commit ou push está autorizado por este relatório.

Corrigidos CTA normal/hover, foco, disabled e integração do favicon oficial. Mantidos
os demais tokens homologados, a Home temporária, a arquitetura, o Header/Footer e o
routing previamente validado. Nenhum asset foi alterado ou gerado nesta execução.
Os registros anteriores deste relatório são históricos; as antigas pendências de
CTA, favicon e homologação cromática não se aplicam ao estado vigente.

### B. Arquivos alterados nesta execução

| Caminho                                         | Mudança                                                                  | Justificativa                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `src/styles/globals.css`                        | Tokens oficiais de primary, hover, disabled e foco, com aliases Tailwind | Aplicar a decisão definitiva; corrigir comentários de homologação |
| `src/components/ui/button/button.component.tsx` | Hover direto, foco 3px/3px e disabled primário opaco                     | Preservar contraste e semântica; remover brightness               |
| `src/app/[locale]/layout.tsx`                   | `metadata.icons.icon: '/favicon.ico'`                                    | Compartilhar o favicon oficial nos três idiomas                   |
| `AGENTS.md`                                     | Precedência de decisões incrementais aprovadas                           | Impedir reutilização de valores operacionais superados            |
| `README.md`                                     | Estado atual de paleta e favicon                                         | Documentação coerente com a entrega                               |
| `docs/phase-2-report.md`                        | Resumo atual e este encerramento                                         | Registrar homologação, testes e prontidão                         |
| `docs/qa/phase-2-3/`                            | Novos JSONs e dez screenshots                                            | Evidência separada, sem sobrescrever QA anterior                  |

`docs/design/` inteiro, os assets V2 e os dois novos favicons permaneceram intactos.
Não houve modificação em translations, hooks, navegação, contratos do Button ou
variantes secondary/outline/ghost em relação ao início desta execução.

### C. Design e acessibilidade contextual

Tokens oficiais aplicados exatamente:

| Token                           | Dark      | Light     |
| ------------------------------- | --------- | --------- |
| `--primary`                     | `#6264DF` | `#6264DF` |
| `--primary-foreground`          | `#FFFFFF` | `#FFFFFF` |
| `--primary-hover`               | `#5558CC` | `#5558CC` |
| `--primary-hover-foreground`    | `#FFFFFF` | `#FFFFFF` |
| `--primary-disabled`            | `#434961` | `#E6E9F2` |
| `--primary-disabled-foreground` | `#C6C9D8` | `#60677B` |
| `--focus-ring`                  | `#E2E8FF` | `#4246A8` |

As razões abaixo foram recalculadas a partir de `getComputedStyle` no Chromium,
utilizando luminância relativa sRGB. Não houve filter/brightness ou opacidade
reduzida nos estados primários medidos.

| Estado do Button primário | Dark     | Light    | Resultado                                           |
| ------------------------- | -------- | -------- | --------------------------------------------------- |
| Normal                    | 4,7643:1 | 4,7643:1 | AA para texto normal                                |
| Hover                     | 5,7470:1 | 5,7470:1 | AA para texto normal                                |
| Focus-visible sem hover   | 4,7643:1 | 4,7643:1 | Preenchimento normal preservado                     |
| Focus-visible + hover     | 5,7470:1 | 5,7470:1 | Hover oficial e outline preservados                 |
| Disabled                  | 5,3916:1 | 4,6468:1 | Opacity 1; acima de 4,5:1 mesmo sendo estado isento |

Outline computado: `3px solid`, offset `3px`, cor por tema exatamente conforme a
decisão. Verificado com Tab/Shift+Tab e screenshot; nenhum ancestral do harness
recorta a área de 6px além do botão. A variante primária `<a>` mantém hover oficial
sem atributo disabled. `<button disabled>` não dispara click nativo, não recebe
foco sequencial e não ativa hover. A opacidade 0,4 continua somente nas outras
variantes disabled, preservando o comportamento anterior.

Os controles do Header foram medidos em hover nos dois temas. Texto/ícones
computados: `#F5F6FB` no dark e `#12172B` no light, sobre soft `#191E37`/`#EEF0FF`.
Logo, não ocorre ali texto secundário/accent claro sobre soft com contraste inferior
ao mínimo. As opções de idioma também usam text-primary. O restante do texto
secundário e accent atual está sobre background, conforme contextos aprovados.
Não foi necessário criar token contextual `#5656C8` sem um uso concreto.

As bordas de baixo contraste permanecem decorativas. Idioma tem texto e chevron;
tema tem ícone reconhecível; navegação ativa tem texto e indicador accent. Não há
campo ou controle cuja identificação dependa exclusivamente da borda decorativa.
As áreas interativas existentes permanecem de pelo menos 44px. Os demais estilos
de foco dos controles foram preservados, consumindo o novo token oficial.

`prefers-reduced-motion: reduce`: `transition-property: none` efetivamente computado.
A duração nominal da classe não cria animação quando nenhuma propriedade transiciona.

### Favicon

Mantido o arquivo único `public/favicon.ico`, servido estaticamente por Next em
`/favicon.ico`. Não há rota `app/favicon.ico`, `src/app/favicon.ico` ou handler
concorrente. `metadata.icons` apenas declara o URL desse arquivo, sem nova
infraestrutura, duplicação de arquivo ou mudança nos metadados de cada idioma.

- HTTP **200** e bytes da resposta idênticos ao asset oficial.
- Um único `link[rel='icon']` com `/favicon.ico` em `/`, `/en` e `/es`.
- Decodificação pelo navegador confirmada nas três rotas, 256×256.
- ICO validado com tamanhos 16, 32, 48, 64, 128 e 256px; PNG oficial 256×256.
- SHA-256 ICO: `9ba40d80176964e554fd87c6890cfc395f835ad5834c609c7a7a7eefab264422`.
- SHA-256 PNG: `3b9847c833645efc75dbfde52be63c9f52f8b37e2cf4e91182821ce60332b593`.

O PNG foi visualmente inspecionado. Não foi redesenhado nem utilizado para substituir
os outros logos. Chrome headless não oferece barra de abas visível na captura;
a verificação do favicon cobre link, HTTP, integridade e decodificação, sem alegar
inspeção de sua apresentação na barra de abas de Firefox/Safari.

### D. Validações da Fase 2.3

| Teste                  | Resultado        | Evidência                                                                 |
| ---------------------- | ---------------- | ------------------------------------------------------------------------- |
| `npm run format:check` | Passou           | Exit 0; docs/design preservado                                            |
| `npm run lint`         | Passou           | Exit 0                                                                    |
| `npm run typecheck`    | Passou           | next typegen + tsc --noEmit, exit 0                                       |
| `npm run build`        | Passou           | Next 16.3.5, três locales estáticos, exit 0                               |
| `/`, `/en`, `/es`      | Passou           | HTTP 200, Header/Footer/main presentes e links localizados                |
| Idiomas                | Passou           | PT → EN → ES → PT; retorno canônico a `/`, query/hash preservados         |
| Tema                   | Passou           | Troca nos dois sentidos, persistência após reload e entre idiomas         |
| Teclado                | Passou           | Skip link, opções por Tab/Enter, Escape e retorno de foco                 |
| Controles              | Passou           | Dois controles visíveis, sem duplicação, alvos ≥44px                      |
| Responsividade         | Passou           | Dark/light em 375/768/1024/1440px; sem overflow/sobreposição do Header    |
| Button                 | Passou           | Normal, hover, foco, foco+hover, disabled e link, com estilos computados  |
| Contrastes             | Passou no escopo | CTA e disabled acima de 4,5:1; contextos existentes inspecionados         |
| Movimento reduzido     | Passou           | Transições desativadas por media query                                    |
| Favicon                | Passou           | HTTP 200, bytes oficiais e decodificação em três idiomas                  |
| Runtime                | Passou           | Sem console errors, pageerrors, 404 ou requestfailed nas execuções finais |
| Integridade/Git        | Passou           | Documentos/assets/index/HEAD preservados; auditoria de candidatos         |

Evidências novas em `docs/qa/phase-2-3/`:

- `button-results.json`: estados computados, contrastes, movimento reduzido e oito combinações responsivas.
- `regression-results.json`: fluxo funcional novo das três rotas e dos controles.
- `favicon-results.json`: declaração e decodificação em cada idioma.
- `versioning-audit.json`: integridade, staging e inspeção dos candidatos.
- `375/768/1024/1440-{dark,light}.png`: oito capturas atuais, inspecionadas visualmente.
- `button-focus-{dark,light}.png`: duas capturas do harness com foco e disabled.

O harness renderizou o **Button real** com ReactDOMServer e TypeScript do projeto,
carregando o CSS do build de produção. Foi inserido exclusivamente no DOM da sessão
de teste. Não houve página, rota, dependência, fixture ou script de teste mantido no
código de produção. Os screenshots do harness são identificados como evidências de
teste, não como uma nova Home. Os scripts temporários ficaram em `/tmp`.

As evidências anteriores continuam preservadas como histórico. Não foi repetida a
matriz completa de 24 combinações: nesta fase foram testados os oito cenários
visuais afetados, três idiomas e fluxos funcionais proporcionais. Navegador:
Google Chrome for Testing 149.0.7827.55. Não houve auditoria completa com leitores
de tela, aparelhos físicos, Safari ou Firefox.

### E. Git e prontidão para versionamento

Branch `main`, origin pessoal `git@github-personal:joaoalmeida25/dev-cosmo-lab-web.git`.
Os **27 arquivos staged** recebidos no início (V2 + decisões + favicons) ficaram
inalterados no índice e no disco. Alterações unstaged anteriores foram preservadas;
nenhum arquivo foi adicionado ao staging nesta execução. Novos componentes,
relatório e QA permanecem untracked até a seleção para commit na Thread 6.

Revisão dos candidatos não identificou arquivo inadequado para versionamento,
secrets por padrões comuns, caches, builds, dependências instaladas ou temporários.
Os 20 hashes do manifesto V2 e os hashes dos novos assets foram verificados. Não há
cópia redundante do favicon nem arquivo comercial completo em public. O PNG auxiliar
é um formato adicional aprovado, não uma rota conflitante de favicon.
Os JSONs e PNGs de QA são pequenos e delimitados por fase; é razoável versioná-los.
Nenhuma evidência antiga foi removida. Package.json e lockfile permanecem inalterados.

**Nenhum commit, push, deploy, reset ou clean foi executado.** O estado está pronto
para revisão e seleção do commit pela Thread 6, sujeito à autorização explícita.

### F. Veredito e pendências não bloqueantes

1. **Fase 2 concluída?** Sim quanto à implementação, correções obrigatórias e
   verificações do escopo. A homologação administrativa final permanece na Thread 6.
2. **Bloqueios para commit?** Nenhum técnico identificado; falta aprovação e
   autorização de versionamento, conforme o processo oficial.
3. **Bloqueios para Fase 3?** Nenhum técnico ou de design da fundação. A próxima fase
   só começa após a decisão da Thread 6 e a sequência de entrega autorizada.

Continuam provisórios somente sombras, gradientes, hover secundário, duração de
animação e ajustes tipográficos/espaciais finos descritos como tal nas decisões.
Os seis mockups finais individuais ausentes não bloqueiam a Fase 3; não foram
criados artificialmente. Demonstração do produto, checkout, conteúdo comercial e
domínio definitivo continuam para seus contextos próprios; nenhuma dessas entregas
foi antecipada. A Fase 3 não foi iniciada.
