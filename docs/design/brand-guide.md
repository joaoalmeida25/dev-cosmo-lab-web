# Guia de marca — Dev Cosmo Lab / Cosmic Minimal Premium

## Direção visual aprovada

Interface comercial **moderna, clean, intuitiva**, com bastante espaço negativo, elementos cósmicos moderados e contraste controlado. Botões sólidos (sem contornos de néon intensos), tipografia legível e informação por blocos. Não criar novos sistemas visuais para o MVP.

### Paleta

As cores abaixo são **valores implementados nos frames do Figma**, úteis como **base operacional** de CSS variables, **não uma certificação de que cada HEX tenha sido homologado em um kit de marca final**:

| Token | Dark | Light | Origem |
|---|---|---|---|
| bg | `#080C18` | `#FAFAFE` | Catálogo Figma |
| surface | `#11182B` | `#FFFFFF` | Cards Figma |
| text | `#F5F6FB` | `#12172B` | Figma |
| muted | `#A5AFC4` | `#656F86` | Figma |
| stroke | `#27304B` | `#E2E7F1` | Figma |
| accent | `#A79DFC` | `#6665DD` | Figma |
| soft | `#191E37` | `#EEF0FF` | Figma |
| CTA sólido | `#696BEC` (observado) | `#696BEC` (observado) | Botões do protótipo |

Paleta de **sugestão da prancha inicial** (não tratar como tokens finais): `#0B0F1A`, `#1A1F2E`, `#2E6BFF`, `#A788FA`, `#E2E8F0`, `#94A3B8`, `#F8FAFC`.

### Tipografia

- **Geist** Regular/Medium/SemiBold/Bold utilizada nos frames editáveis criados no Figma.
- Inter e Plus Jakarta Sans constaram como **sugestões** anteriores, não como fonte obrigatória.
- Escala tipográfica global, tracking e limites de linha **não possuem especificação homologada**. Adaptar responsivamente com leitura confortável.
- Nenhuma fonte binária é distribuída.

### Layout e UI

- Referência de botão: **44 px de altura**, largura ajustada ao conteúdo; 44–48 px são aceitáveis com validação. Não deixar muito espaço vazio lateral.
- Cards com bordas discretas de **1px**; raios usados de cerca de **15–20px** (valores do protótipo, não design tokens finais).
- Sombras, espaçamentos em escala, grid formal e estados de hover exatos **não foram fixados numericamente**.
- Hierarquia: um H1 claro, subtítulo curto e um CTA primário por bloco principal. Evitar excesso de pills, números e efeitos decorativos.
- Header com ícone real `DC`, nome, navegação aplicável, idioma e controle de tema; Footer consistente.
- Animações suaves e discretas; respeitar `prefers-reduced-motion`. Evitar física 3D custosa sem necessidade.

### Imagens

- **Hero atual**: `/assets/backgrounds/hero-desktop-{dark,light}.png`; planeta à direita e respiro à esquerda; sem card de ideias e sem traços orbitais. Título e botões devem ser camadas HTML.
- **CTA final**: `/assets/backgrounds/cta-{dark,light}.png`; usar como fundo. Não posicionar texto sobre regiões de baixo contraste.
- **Destaque**: `/assets/products/propostas-em-dia/featured-{dark,light}.png`; trocar dinamicamente ao destacar outro produto. São arte promocional conceitual, não screenshots verificados de software real.
- Responsive: diferentes crops e `object-position` podem ser necessários nos dispositivos; o background desktop não é uma composição mobile fechada.

### Logotipo

- Ícone oficial master: `/assets/brand/dev-cosmo-lab-icon-master.png` (fundo opaco escuro).
- Derivados para composição sobre fundo: `/assets/brand/dev-cosmo-lab-logo-on-dark.png`, `/assets/brand/dev-cosmo-lab-logo-on-light.png`, `/assets/brand/dev-cosmo-lab-icon-transparent.png`, todos sujeitos a QA visual de escala e bordas.
- Não trocar monograma por letras tipográficas improvisadas. Favicon oficial não localizado.

### Produto

Catálogo multi-produto, começando com uma entrada real (`Propostas em Dia`) e se preparando para cards/carrossel e paginação futura. A página de Detalhes deve ser um template reutilizável, não página hard-coded de um único kit.
