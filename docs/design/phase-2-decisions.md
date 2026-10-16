# Dev Cosmo Lab — Homologação Visual da Fase 2

**Status:** HOMOLOGADA COM AJUSTES PONTUAIS. Emissão: 15/10/2026.  
**Escopo:** contraste do CTA primário, favicon original derivado, homologação de tokens e suficiência dos mockups para iniciar a Home.  
**Não altera:** o Design Handoff Package V2, o Figma, GitHub ou a aplicação. Aplique este pacote como **incremento** na raiz do projeto.

## 1. Decisão definitiva: CTA primário

Identidade **Cosmic Minimal Premium** preservada. A cor `#696BEC`, utilizada pelo Codex, alcançava **4.27:1** com texto branco, abaixo de 4,5:1 (WCAG 2.2, 1.4.3, texto normal). A alteração mínima, com margem operacional, é escurecer ligeiramente o violeta. Razões calculadas pelo algoritmo relativo sRGB do WCAG; não são estimativas visuais.

| Elemento / estado | Background | Foreground | Razão | Decisão |
|---|---|---|---:|---|
| Primário normal | `#6264DF` | `#FFFFFF` | **4.76:1** | **OFICIAL** / AA |
| Primário hover | `#5558CC` | `#FFFFFF` | **5.75:1** | **OFICIAL** / AA |
| Primário focus-visible (sem hover) | `#6264DF` | `#FFFFFF` | **4.76:1** | **OFICIAL** / AA |
| Primário focus-visible e hover | `#5558CC` | `#FFFFFF` | **5.75:1** | **OFICIAL** / AA |
| Disabled, dark | `#434961` | `#C6C9D8` | **5.39:1** | **OFICIAL** de fallback operacional |
| Disabled, light | `#E6E9F2` | `#60677B` | **4.65:1** | **OFICIAL** de fallback operacional |

**Focus ring:** `3px solid` com `outline-offset: 3px`, aplicado em `:focus-visible`. Cor dark: **`#E2E8FF`**. Contraste contra background dark `#080C18`: **16.00:1**; contra surface dark `#11182B`: **14.48:1**. Cor light: **`#4246A8`**. Contraste contra background light `#FAFAFE`: **7.55:1**; contra surface light `#FFFFFF`: **7.86:1**. A separação de 3px previne que o anel encoste no preenchimento do botão. Não remover o outline sem alternativa equivalente. Verificar visualmente clipping em containers com `overflow: hidden`.

**Disabled:** o WCAG 1.4.3 isenta componentes inativos do mínimo de contraste, mas deliberadamente mantivemos texto acima de 4,5:1 para robustez. Usar `disabled` nativo em `button`, sem hover ativo, sem interatividade, sem pointer; o estado é diferenciado por preenchimento mais neutro, **sem** reduzir `opacity` do botão inteiro, pois isso degradaria a razão efetiva do texto.

**Texto branco permanece nos estados normal/hover/focus**, inclusive em ambos os temas. Não adicionar gradiente, transparência ou overlay ao CTA sem recalcular a menor razão de contraste na superfície resultante. Botão principal: referência de altura **44px** com largura ajustada ao conteúdo. Não aumentar indiscriminadamente padding lateral.

### Tokens prontos para a Thread 6

Mapeamento de CSS variables (valores, não exigência de nomes já existentes no código):

| Semântico | Dark | Light |
|---|---|---|
| `--primary` | `#6264DF` | `#6264DF` |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--primary-hover` | `#5558CC` | `#5558CC` |
| `--primary-hover-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--focus-ring` | `#E2E8FF` | `#4246A8` |
| `--primary-disabled` | `#434961` | `#E6E9F2` |
| `--primary-disabled-foreground` | `#C6C9D8` | `#60677B` |

## 2. Homologação da base de tokens

**Tokens cromáticos abaixo homologados como base da Fase 2 e da Home** (sem redesign):

| Token | Dark | Light | Status |
|---|---|---|---|
| Background | `#080C18` | `#FAFAFE` | **Aprovado** |
| Surface | `#11182B` | `#FFFFFF` | **Aprovado** |
| Border | `#27304B` | `#E2E7F1` | **Aprovado** para separadores decorativos |
| Text primary | `#F5F6FB` | `#12172B` | **Aprovado** |
| Text secondary | `#A5AFC4` | `#656F86` | **Aprovado com restrição de contexto** |
| Accent | `#A79DFC` | `#6665DD` | **Aprovado com restrição de contexto** |
| Primary | `#6264DF` | `#6264DF` | **Corrigido, aprovado** |
| Soft | `#191E37` | `#EEF0FF` | **Aprovado** |

Checagens adicionais de texto normal (sem transparência):

- Dark `text`/`bg`: **18.08:1**; `muted`/`bg`: **8.86:1**; `accent`/`bg`: **8.24:1**.
- Light `text`/`bg`: **17.05:1**; `muted`/`bg`: **4.84:1**; `accent`/`bg`: **4.51:1**.
- **Ressalva de acessibilidade:** light `muted` sobre soft `#EEF0FF` cai para **4.45:1**, e light `accent` sobre soft para **4.15:1**, ambos inferiores a 4,5:1. Preservar a paleta aprovada e nesses casos usar `text-primary` ou um tom de texto acentuado **específico ao contexto**, proposto como `#5656C8` (**5.21:1** sobre soft). Essa extensão não substitui o accent principal.
- Borders atuais têm contraste baixo para contornos funcionais (dark stroke vs surface: **1.35:1**; light stroke vs surface: **1.24:1**). Isso é aceitável para divisórias decorativas; **não** usar como única pista visual de um campo de formulário, controle obrigatório ou estado selecionado sem atingir contraste não textual aplicável de 3:1, ou uma alternativa visual suficiente.

### Dimensões / tipografia

| Regra | Status | Orientação |
|---|---|---|
| Geist Regular/Medium/SemiBold/Bold | **Aprovado** | Reutilizar fonte implementada; não distribuir binários. |
| Container máximo 1440px | **Aprovado como parâmetro operacional** | A largura máxima não é exigência para preencher toda viewport; manter leitura controlada. |
| Padding horizontal 24 / 40 / 80px | **Aprovado como escalonamento inicial** | Aplicar por breakpoint; ajustar se o teste visual requerer. |
| Header 76px mobile / 88px desktop | **Aprovado como altura operacional** | Manter touch targets e sem overflow. |
| Botões pill | **Aprovado** | Preferir 44px de altura e largura pela copy. |
| Cards radius 16px | **Aprovado como default**, não rígido | Componentes excepcionais podem exigir 20px conforme referência. |
| Sombras, gradientes, hover secundário | **Provisórios** | Discretos, sem neon intenso; não impedir Fase 3. |
| Escala tipográfica detalhada / tracking / espaçamento fino | **Provisórios** | Validar com mockup e telas reais durante Fase 3. |
| Animação | **Diretriz aprovada, duração provisória** | Hover sutil, entrada controlada, respeitar `prefers-reduced-motion`. |

**Inconsistência relevante:** os tokens aprovados são uma base operacional derivada dos frames, não um manual imutável; Hero atual deve usar as **imagens clean** do Handoff V2, mesmo se o mockup antigo mostrar órbitas ou card 'Ideias em soluções'. O Figma tem frames estruturais e não substitui os PNGs finais de arte. O Catálogo deverá ser multiproduto, e a página Conteúdo/blog não faz parte do MVP.

## 3. Favicon oficial — pronto para uso

**Disponibilizados neste ZIP:**

- `public/favicon.ico`: favicon com tamanhos de 16, 32, 48, 64, 128 e 256px; posicionamento direto no `public/` atende `/favicon.ico` e elimina o 404 na ausência de outra rota mais específica.
- `public/assets/brand/dev-cosmo-lab-favicon.png`: mesmo recorte oficial, PNG 256×256 para outras superfícies. Não substitui os logos do Handoff V2.

**Proveniência:** recorte **sem redesenho** do `public/assets/brand/dev-cosmo-lab-icon-master.png` aprovado no Handoff V2, imagem original de **1254×1254**. Recorte quadrado `x=170..1080, y=150..1060`, amostragem `Lanczos` para múltiplos tamanhos e fundo escuro já existente no master. Este não é um novo símbolo. SHA-256 do master de origem: `b9167229776c85045802108093416a61e3862f13b935b7d06ceb976e55f105fb`.

Decisão: **favicon homologado como derivação fiel do símbolo oficial**. O quadrado escuro preserva legibilidade em barras de navegação claras e escuras. Em 16px, detalhes orbitais ficam naturalmente reduzidos; validar visualmente no navegador. Se o projeto já possuir rota de ícone via `app/favicon.ico` ou `src/app/favicon.ico`, conferir precedência e remover referência conflitante, mas não apagar nenhum arquivo sem avaliar primeiro.

## 4. Referências de mockup ausentes — verificação

Verificados os arquivos recuperados dos anexos da Thread 5 e as referências do Handoff V2. **Não foram encontrados originais finais completos e independentes** dos seguintes arquivos:

| Arquivo solicitado | Situação | O que já existe | Bloqueia? |
|---|---|---|---|
| `docs/design/mockups/home/home-mobile-dark.png` | **Ausente como arte final individual** | Home desktop dark aprovada + asset Hero clean dark + Figma `5:154` (estrutura mobile) | **Não**, Fase 3 pode prosseguir com QA mobile. |
| `docs/design/mockups/home/home-mobile-light.png` | **Ausente como arte final individual** | Home desktop light aprovada + asset Hero clean light + Figma `5:211` (estrutura mobile) | **Não**, Fase 3 pode prosseguir com QA mobile. |
| `docs/design/mockups/catalog/catalog-desktop-dark.png` | **Ausente como arte final individual** | Figma `29:22` (estrutura desktop dark) | Não para a Home; Catálogo com QA futuro. |
| `docs/design/mockups/catalog/catalog-desktop-light.png` | **Ausente como arte final individual** | Figma `29:112` (estrutura desktop light) | Não para a Home; Catálogo com QA futuro. |
| `docs/design/mockups/catalog/catalog-mobile-dark.png` | **Ausente como arte final individual** | Figma `29:73` (estrutura mobile dark) | Não para a Home; Catálogo com QA futuro. |
| `docs/design/mockups/catalog/catalog-mobile-light.png` | **Ausente como arte final individual** | Figma `29:163` (estrutura mobile light) | Não para a Home; Catálogo com QA futuro. |

**Não foram criados arquivos artificiais para essas seis lacunas.** O Figma é referência estrutural; screenshot de frame simplificado não deve ser rotulado de 'mockup final aprovado'.

Figma pessoal: <https://www.figma.com/design/AQCDUQfyJNVECtlg2ssMsh>.  
Prioridade para a Fase 3 (Home): assets do Handoff V2 em `public/assets/backgrounds/hero-desktop-dark.png` e `hero-desktop-light.png`, CTA dark/light e produto featured dark/light; mockups desktop de Home; frames mobile Figma acima. Nas larguras mobile, adaptar `object-position`, composição e prioridade do conteúdo para evitar corte abrupto do planeta; preservar legibilidade do texto, CTA e fundo.

## 5. Instruções objetivas para o Codex — fechamento da Fase 2

1. **Reutilize o Handoff V2** sem substituí-lo. Extraia este ZIP incremental na raiz do projeto.
2. Altere apenas tokens de **CTA primário** e estados para os valores da seção 1, preservando tipografia, raio e estrutura existentes. **Não** modificar botão outline/secondary sem necessidade.
3. Adicione os arquivos de favicon em `public/` e `public/assets/brand/`. Confirme resolução de `/favicon.ico` (sem 404), prioridade de rota e apresentação em Chrome e Firefox, se disponível.
4. Revise `focus-visible` por teclado, outline offset, overflow, estado disabled e textos em backgrounds `soft` do tema claro. Não reduza opacidade de texto/focus.
5. Execute lint, TypeScript, build e regressão básica dark/light, idiomas, 360px–1440px. A implantação da Home pode começar sem recriar mockups mobile ou páginas no Figma.
6. Preserve características do MVP: Home, Catálogo, Detalhes por slug; Conteúdo/blog fora de escopo; demonstrações e alegações comerciais só quando confirmadas.
7. **Não fazer commit de entrega final nem deploy de produção sem decisão da Thread 6.**

## 6. Pendências que não bloqueiam a Fase 3

- Mockups finais independentes da Home mobile e Catálogo (6). Suporte estrutural Figma e referências existentes suficiente como ponto de partida.
- Demonstração real do kit, checkout Kiwify e alegações comerciais para página de Detalhes: validar na fase própria.
- Ajustes finos de sombras, gradientes e animações para implementação visual da Home.

**Veredito final:** Fase 2 **visualmente homologada com ajustes obrigatórios de CTA e favicon**; início da Fase 3 autorizado após aplicar/verificar os dois pontos, mantendo testes regressivos.
