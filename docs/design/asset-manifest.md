# Asset manifest — V2

**Legenda:**
- **Asset de produção** = original de imagem para uso direto em `public/assets/`, sujeito a verificação de conteúdo promocional e responsividade.
- **Mockup / recorte de prancha** = referência de design para Codex, não deve ser usada como imagem final na aplicação.
- **Prancha visual original** = composição inteira preservada byte a byte; telas extraídas são apenas recortes dos pixels da prancha, **não arquivos originais independentes**.
- **Derivado de marca** = recurso auxiliar existente, não substituto do ícone master oficial.

| Arquivo relativo | Tipo e uso | Tema | Dimensões | Estado | Origem / observações |
|---|---|---|---|---|---|
| `public/assets/brand/dev-cosmo-lab-icon-master.png` | Asset de marca / original — Header, Footer, identificação da marca | Ambos | 1254×1254 (1.000:1) | Ícone oficial aprovado | Master com fundo opaco. Não usar diretamente como imagem com transparência ou como favicon sem preparação. **Fonte:** icone(1).png |
| `public/assets/brand/dev-cosmo-lab-icon-transparent.png` | Asset de marca / derivado auxiliar — Header, Footer | Dark/Light dependendo do contraste | 380×284 (1.338:1) | DERIVADO; QA VISUAL RECOMENDADO | Extração transparente previamente disponível; conferir halos/contornos. Não é arquivo vetorial oficial. **Fonte:** figma-assets/dc-logo-transparent.png |
| `public/assets/brand/dev-cosmo-lab-logo-on-dark.png` | Asset de marca / derivado auxiliar — Header, Footer sobre fundo escuro | Dark | 430×319 (1.348:1) | DERIVADO; QA VISUAL RECOMENDADO | Imagem auxiliar para background dark, não equivalente ao arquivo fonte vetorial. **Fonte:** dc-figma-assets/logo-dark.png |
| `public/assets/brand/dev-cosmo-lab-logo-on-light.png` | Asset de marca / derivado auxiliar — Header, Footer sobre fundo claro | Light | 430×319 (1.348:1) | DERIVADO; QA VISUAL RECOMENDADO | Imagem auxiliar para background light, não equivalente ao arquivo fonte vetorial. **Fonte:** dc-figma-assets/logo-light.png |
| `public/assets/backgrounds/hero-desktop-dark.png` | Asset de produção / background clean — Home > Hero | Dark | 1448×1086 (1.333:1) | APROVADO FINAL; NOVO | Planeta na direita, vazio à esquerda; SEM linhas de órbita, SEM card Ideas. Este arquivo substitui o background anterior do ZIP. **Fonte:** Imagem do ChatGPT 15 de out. de 2026, 17_24_39-1(1).png |
| `public/assets/backgrounds/hero-desktop-light.png` | Asset de produção / background clean — Home > Hero | Light | 1448×1086 (1.333:1) | APROVADO FINAL; NOVO | Planeta na direita, branco amplo à esquerda; SEM interface sobreposta. Substitui a versão anterior. **Fonte:** Imagem do ChatGPT 15 de out. de 2026, 17_24_40-2(1).png |
| `public/assets/backgrounds/cta-dark.png` | Asset de produção / banner — Home > CTA final | Dark | 2048×682 (3.003:1) | APROVADO FINAL; NOVO | Horizonte azul escuro; não contém textos. Criar chamada e botão em HTML acima da imagem. **Fonte:** Imagem do ChatGPT 15 de out. de 2026, 17_12_00-5(2).png |
| `public/assets/backgrounds/cta-light.png` | Asset de produção / banner — Home > CTA final | Light | 2048×682 (3.003:1) | APROVADO FINAL; NOVO | Cena clara com astronauta à direita; preservar espaço à esquerda para conteúdo HTML. **Fonte:** Imagem do ChatGPT 15 de out. de 2026, 17_12_01-6(2).png |
| `public/assets/products/propostas-em-dia/featured-dark.png` | Asset de produção / arte promocional — Home > destaque / Catálogo / Detalhes | Dark | 1448×1086 (1.333:1) | APROVADO VISUALMENTE | Imagem CONCEITUAL de kit e painéis: não divulgar como print real de software SaaS. Swap programático por produto; não embutir CTA/price. **Fonte:** Imagem do ChatGPT 15 de out. de 2026, 17_33_01-1(1).png |
| `public/assets/products/propostas-em-dia/featured-light.png` | Asset de produção / arte promocional — Home > destaque / Catálogo / Detalhes | Light | 1448×1086 (1.333:1) | APROVADO VISUALMENTE | Conceito em tema claro; dados da interface são ilustrativos; não afirmar características funcionais não existentes. **Fonte:** Imagem do ChatGPT 15 de out. de 2026, 17_33_02-2(1).png |
| `docs/design/reference-boards/home-desktop-dark-light-approved.png` | Prancha visual original — Home > composição desktop | Dark + Light | 1312×1199 (1.094:1) | APROVADA COMO COMPOSIÇÃO; HERO HISTÓRICO | A composição das seções foi aprovada; IGNORAR no Hero o card Ideias e órbitas antigos. Usar background clean novo. **Fonte:** Home.png |
| `docs/design/reference-boards/product-detail-desktop-themes-and-mobile-dark.png` | Prancha visual original — Detalhes do Produto; Conteúdo fora do MVP | Dark + Light + mobile dark | 1536×1024 (1.500:1) | APROVADA COMO CONCEITO | Quatro painéis, incluindo três variantes de Detalhes. Avaliações, garantia, descontos e UI de demonstração não são evidências comerciais. **Fonte:** Grade de Interfaces Dev Cosmo Lab-4.png |
| `docs/design/reference-boards/product-detail-mobile-light-and-desktop-dark.png` | Prancha visual original — Detalhes do Produto mobile light e desktop dark; Conteúdo futuro | Dark + Light | 1536×1024 (1.500:1) | APROVADA COMO CONCEITO | Contém mobile light completo da página de Detalhes; inclui Content fora do MVP. Títulos/dados comerciais são ilustrativos. **Fonte:** Showcase de Interfaces Cósmicas Dev Cosmo Lab-2.png |
| `docs/design/reference-boards/product-detail-desktop-dark-standalone-proposal.png` | Mockup original isolado / referência complementar — Detalhes do Produto > desktop dark | Dark | 759×1024 (0.741:1) | REFERÊNCIA COMPLEMENTAR | Versão standalone de protótipo anterior: utilizar composição aprovada e ignorar elementos comerciais não verificados; não é screenshot de produto real. **Fonte:** dev_cosmo_produto_detalhes_mockup_escuro.png |
| `docs/design/mockups/home/home-desktop-dark.png` | Referência visual / recorte de prancha — Home > desktop dark | Dark | 638×1199 (0.532:1) | REFERÊNCIA APROVADA; DERIVADO DE PRANCHA | Recorte da prancha, não mockup exportado independente; OBSOLETO somente quanto ao Hero, onde o card Ideias e órbitas devem desaparecer. **Fonte:** Home.png; crop=(0, 0, 638, 1199) |
| `docs/design/mockups/home/home-desktop-light.png` | Referência visual / recorte de prancha — Home > desktop light | Light | 667×1199 (0.556:1) | REFERÊNCIA APROVADA; DERIVADO DE PRANCHA | Recorte da prancha, não mockup exportado independente; Hero clean é fonte atual de verdade. **Fonte:** Home.png; crop=(645, 0, 1312, 1199) |
| `docs/design/mockups/product-detail/product-desktop-dark.png` | Referência visual / recorte de prancha — Detalhes > desktop dark | Dark | 502×990 (0.507:1) | REFERÊNCIA APROVADA; DERIVADO DE PRANCHA | Recorte de prancha, baixa resolução relativa; sem status de original independente; UI e promessas ilustrativas. **Fonte:** Grade de Interfaces Dev Cosmo Lab-4.png; crop=(12, 33, 514, 1023) |
| `docs/design/mockups/product-detail/product-desktop-light.png` | Referência visual / recorte de prancha — Detalhes > desktop light | Light | 498×990 (0.503:1) | REFERÊNCIA APROVADA; DERIVADO DE PRANCHA | Recorte de prancha. A resolução real é a da área no mosaico; evitar aumentar imagem para produção. **Fonte:** Grade de Interfaces Dev Cosmo Lab-4.png; crop=(530, 33, 1028, 1023) |
| `docs/design/mockups/product-detail/product-mobile-dark.png` | Referência visual / recorte de prancha — Detalhes > mobile dark | Dark | 247×990 (0.249:1) | REFERÊNCIA APROVADA; DERIVADO DE PRANCHA | Recorte de coluna mobile dark; screenshot de referência de tamanho reduzido, não mockup original hi-res. **Fonte:** Grade de Interfaces Dev Cosmo Lab-4.png; crop=(1046, 33, 1293, 1023) |
| `docs/design/mockups/product-detail/product-mobile-light.png` | Referência visual / recorte de prancha — Detalhes > mobile light | Light | 232×1007 (0.230:1) | REFERÊNCIA APROVADA; DERIVADO DE PRANCHA | Recorte da prancha que contém mobile light. NÃO contém tela original independente de alta resolução. **Fonte:** Showcase de Interfaces Cósmicas Dev Cosmo Lab-2.png; crop=(1059, 8, 1291, 1015) |

## Ausências declaradas (não criar placeholders)

- `docs/design/mockups/home/home-mobile-dark.png` — Home mobile dark tem frame estrutural no Figma, mas não foi localizada arte final independente em PNG. Adaptar responsivamente com a versão desktop, os backgrounds e o frame.
- `docs/design/mockups/home/home-mobile-light.png` — Home mobile light tem frame estrutural no Figma, mas não há PNG final independente.
- `docs/design/mockups/catalog/catalog-desktop-dark.png` — Catálogo tem frame estrutural Figma, mas não foi localizado mockup completo final independente. Não confundir imagens de produto/Conteúdo com catálogo.
- `docs/design/mockups/catalog/catalog-desktop-light.png` — Catálogo tem frame estrutural Figma, mas não foi localizado mockup completo final independente.
- `docs/design/mockups/catalog/catalog-mobile-dark.png` — Catálogo mobile dark tem frame Figma, não arquivo PNG final independente.
- `docs/design/mockups/catalog/catalog-mobile-light.png` — Catálogo mobile light tem frame Figma, não arquivo PNG final independente.
- `public/assets/brand/favicon.ico` — Favicon oficial não localizado/homologado; não criar substituto genérico.
- `public/assets/products/propostas-em-dia/real-demo.*` — Não há captura ou vídeo autorizado e validado mostrando o kit real; usar arte conceitual identificada e não inventar SaaS.

## Verificação SHA-256

- `public/assets/brand/dev-cosmo-lab-icon-master.png`: `b9167229776c85045802108093416a61e3862f13b935b7d06ceb976e55f105fb`
- `public/assets/brand/dev-cosmo-lab-icon-transparent.png`: `44df8f7aff22d9a7e7153e87da818bcf28bde30c2463b3d5f9d9530d55b0158f`
- `public/assets/brand/dev-cosmo-lab-logo-on-dark.png`: `c265fe3d5d5d4107301440c25d6f470f4ce08fa5f0cb7c3521c75e2c1a3956e6`
- `public/assets/brand/dev-cosmo-lab-logo-on-light.png`: `8ad24dba1468e0dd32296c580660e8169d7d2622ba59d603044be1111d71cfc9`
- `public/assets/backgrounds/hero-desktop-dark.png`: `2480486c51ef0ac4801f9e817a1a06fa5a5e27aaa488afc63059d124f5e11615`
- `public/assets/backgrounds/hero-desktop-light.png`: `052eef444837a392b41ede1f2cf25a5eab0cda716cdb8592a3d2923860b16f78`
- `public/assets/backgrounds/cta-dark.png`: `85d89c5c84bd2400fb8daa5ec51c30f874f94b17f31ec0a499bc32f19a00a2c5`
- `public/assets/backgrounds/cta-light.png`: `52092ca0eceaf6ea13778a0728763fac21ee695ca1cc64f73af7e7951da12b1f`
- `public/assets/products/propostas-em-dia/featured-dark.png`: `eb2aae2603b53fa723a8a57c86fa6c600c86a6f0d30dc6e83d90bb08bee7d889`
- `public/assets/products/propostas-em-dia/featured-light.png`: `58e3d8c598c7c0264ed16ad96b6ebe2342a81c04df42dab557f849df429ff87e`
- `docs/design/reference-boards/home-desktop-dark-light-approved.png`: `19d10acca9e16378e387ac8eafa85caca04156c0027cfdc63d4e8525c1ccd016`
- `docs/design/reference-boards/product-detail-desktop-themes-and-mobile-dark.png`: `aadfc25c0b55b84c7c3f0f396c53a036555048dc584417157be939d8989092e7`
- `docs/design/reference-boards/product-detail-mobile-light-and-desktop-dark.png`: `34784e63b9efc2b0e235b66ce7f2b7e936363dee7d101ae4c1ed2c70b2a18b0f`
- `docs/design/reference-boards/product-detail-desktop-dark-standalone-proposal.png`: `9f1ea71c3bcbf56a91c1d7f6026620e2376e6242177fba0968f54951cba46832`
- `docs/design/mockups/home/home-desktop-dark.png`: `3a7616e7e52db3de3fd0a8bb95f9ab590aa763df7c8d094e8941df46e17dfb2f`
- `docs/design/mockups/home/home-desktop-light.png`: `0e9393fc09d44b5067340db22deb9ff43763a537b8fba19c907f21388d3015bc`
- `docs/design/mockups/product-detail/product-desktop-dark.png`: `0d5c13595e2d6560033c00528457cd1d129fe214be26f4baf91d4a9511ba9222`
- `docs/design/mockups/product-detail/product-desktop-light.png`: `75dc94e7dd46adb6884cb45767aead6c9790371ec21129061bac93c90a5feec7`
- `docs/design/mockups/product-detail/product-mobile-dark.png`: `6cc4208165d4fa1ec2ac4bfa0d7934695fa0eb9dfbad72b74f4a4324cccf6fcf`
- `docs/design/mockups/product-detail/product-mobile-light.png`: `d74dcea6ebb54d72294a15d02b8398521affd9e065328450391a5e81a4a0b247`
