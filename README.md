# Dev Cosmo Lab Web

Website institucional e futura vitrine de produtos digitais da **Dev Cosmo Lab**.
Uma única aplicação Next.js, sem backend próprio, banco de dados, autenticação ou CMS.

## Status

Fase 1: bootstrap independente com Home temporária em três idiomas e controles de tema.
A identidade visual definitiva, o Header comercial, o catálogo e os detalhes de produtos
serão implementados nas próximas fases. Não há integração de checkout ou deploy configurado.

O domínio oficial ainda não foi definido. `src/constants/site.constants.ts` utiliza
`http://localhost:3000` exclusivamente como base local de metadados. Essa configuração
deve ser substituída antes de qualquer publicação. Logo, favicon e imagens oficiais estão pendentes.

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
├── components/           # Controles de idioma/tema e Button
├── constants/            # Base local do site e configuração de tema
├── features/home/        # Home temporária
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
Os namespaces atuais são `common`, `home` e `metadata`, com a mesma estrutura
nos três idiomas. Apenas as mensagens comuns necessárias aos controles são
enviadas pelo provider ao cliente.

## Temas

Dark é o tema padrão. A preferência dark/light é salva em `localStorage` com a chave
`dev-cosmo-lab-theme` e aplicada em `data-theme` no elemento HTML. O script inicial
e o hook usam a mesma constante. Os tokens herdados são provisórios e não representam
a identidade visual aprovada da marca.

## Origem técnica

Bootstrap a partir dos arquivos versionados de
[joaoalmeida25/portfolio](https://github.com/joaoalmeida25/portfolio), branch `main`,
commit `0763a6b8f9e07c95fd521f7f82d81320dfad0f81`.
O histórico Git é novo e independente. O repositório de origem permanece intacto.
