# LifePaths

RPG de texto e simulador de vida para navegador. Você acompanha uma pessoa do nascimento à morte, toma decisões, desenvolve atributos e constrói uma história em que **escolhas antigas voltam anos depois**: o colega novo que você acolheu na escola pode oferecer sociedade numa startup; um furto por desafio na adolescência pode aparecer numa checagem de antecedentes aos 30.

- Single-player, gratuito, sem login, sem anúncios, sem analytics e sem backend.
- Toda a simulação roda no navegador, com conteúdo escrito previamente e sorteios controlados por regras e por um gerador pseudoaleatório com seed.
- Idiomas: inglês (padrão), português brasileiro e espanhol. A troca é imediata, sem reiniciar a partida, e o histórico já escrito também muda de idioma.

## Jogar sem instalar nada

Abra o arquivo **`jogar/index.html`** no navegador (duplo clique). Ele é autocontido: o JavaScript e o CSS estão embutidos, sem servidor e sem internet. Os saves ficam no navegador, como na versão hospedada.

Para regenerar esse arquivo depois de mudar o código: `npm run build:single`.

## Publicar no GitHub Pages

Duas opções, ambas sem servidor:

- **Mais simples (sem Actions):** em *Settings → Pages*, escolha *Deploy from a branch*, a branch `main` e a pasta **`/docs`**. A pasta `docs/` já contém o jogo em arquivo único.
- **Automática:** em *Settings → Pages*, escolha *Source: GitHub Actions*. O workflow `.github/workflows/pages.yml` roda os testes, gera o build e publica a cada push na `main`.

Depois de alterar o código na primeira opção, rode `npm run build:single` para atualizar `docs/index.html`.

## Requisitos

- Node.js 20.19+ ou 22.12+ (testado com Node 22)
- npm 10+

## Instalação e execução

```bash
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Verifica tipos (`tsc -b`) e gera os arquivos estáticos em `dist/` |
| `npm run build:single` | Gera `jogar/index.html`, um arquivo único que abre direto do disco |
| `npm run preview` | Serve o conteúdo de `dist/` localmente para conferência |
| `npm test` | Roda todos os testes (Vitest) |
| `npm run typecheck` | Só a verificação de tipos |
| `npm run i18n:check` | Verifica chaves e parâmetros ausentes ou divergentes entre os três idiomas |

## Publicação estática

`npm run build` gera `dist/` com HTML, CSS e JS. Os caminhos são relativos (`base: './'` em `vite.config.ts`), então a pasta funciona em qualquer hospedagem estática e em qualquer subpasta:

- **GitHub Pages**: publique o conteúdo de `dist/` (por exemplo, na branch `gh-pages` ou via GitHub Actions com `actions/upload-pages-artifact`).
- **Netlify / Vercel / Cloudflare Pages**: comando de build `npm run build`, diretório de saída `dist`.
- **Qualquer servidor**: copie `dist/` para a pasta pública (nginx, Apache, S3 + CloudFront…).

Não há rotas no servidor (a navegação é interna), então não é preciso configurar redirecionamentos.

## Como jogar

1. **Nova vida**: escolha nome, sobrenome e pronomes (ou gere uma personagem aleatória). Família, cidade, condição financeira e traços de personalidade são sorteados.
2. A cada ano você tem um **orçamento de ações** (2 na primeira infância, 3 na infância, 4 na adolescência, 5 na vida adulta e 4 na velhice). Atividades, interações com pessoas, candidaturas a vagas, matrículas e a prova de direção consomem ações.
3. **Envelhecer** (Age Up) processa o ano uma única vez: envelhecimento, escola e cursos, trabalho, receitas e despesas, relações, consequências agendadas, eventos e a verificação de fim da vida.
4. Quando surge uma **decisão obrigatória**, não é possível envelhecer nem agir até resolvê-la. Cada escolha mostra custos, requisitos e chance de sucesso, e o resultado aparece logo em seguida com as mudanças (“Conhecimento +4”).
5. Ao morrer, você vê um **resumo da trajetória** com título narrativo, destaques, formação, carreira, finanças, relações e conquistas.

## Países e moedas

Cada vida nasce num país sorteado entre 12: Estados Unidos, Canadá, Reino Unido, Alemanha, Espanha, Portugal, Japão, Brasil, México, Argentina, Índia e Nigéria. O dinheiro aparece na moeda real do país (US$, R$, €, ¥, ₹, ₦…), formatado conforme o idioma. Os valores de câmbio, nível de preços, salários, rede de proteção, mensalidades, impostos, mortalidade e mercado de trabalho são aproximações da realidade (2024-2025), definidos em `src/content/countries.ts`.

A dificuldade sai dessas proporções, e não de regras especiais:
- **Fácil** (Canadá, Alemanha): salários altos em relação aos preços e proteção social forte.
- **Moderada** (EUA, Reino Unido, Espanha, Japão): salários razoáveis; nos EUA a faculdade é cara.
- **Difícil** (Brasil, México, Portugal): salário compra pouco e o auxílio é baixo.
- **Muito difícil** (Argentina, Índia, Nigéria): renda muito baixa perto dos preços, quase nenhum auxílio, menos vagas e mais mortalidade.

## Arquitetura

```
src/
  engine/        Motor de simulação puro, sem React e sem texto visível
    types.ts         Modelo de dados (GameState serializável em JSON)
    rng.ts           PRNG mulberry32 com estado salvo no save
    core.ts          Transições imutáveis, log, atributos, utilidades
    conditions.ts    Condições declarativas e descrição de requisitos
    effects.ts       Aplicação de efeitos declarativos
    events.ts        Elegibilidade, sorteio, agendamento e escolhas
    yearCycle.ts     Age Up e regra simplificada de mortalidade
    education.ts, career.ts, finance.ts, relationships.ts, activities.ts
    achievements.ts, summary.ts, character.ts, people.ts, guards.ts
    index.ts         API pública usada pela interface
  content/       Dados do jogo (sem texto visível, só IDs)
    events/          Eventos por fase da vida (childhood, teen, adult, elder)
    careers.ts, courses.ts, activities.ts, items.ts, achievements.ts, titles.ts, names.ts
  i18n/
    translate.ts     t(), plurais (Intl.PluralRules), variantes de gênero, fallback, formatação
    locales/{en,pt-BR,es}/   ui.ts, content.ts, events.ts
  persistence/   Slots no localStorage, envelope versionado, validação, migração, configurações
  ui/            React: telas, painéis, componentes e CSS
tests/           Vitest
```

Princípios:

- **Motor puro e determinístico.** Toda operação recebe o estado e devolve um novo estado (`transition()` clona o estado e restaura o gerador pela seed salva). Mesma seed e mesmas escolhas reproduzem a mesma vida, e recarregar a página não refaz sorteios, porque o estado do gerador é salvo a cada operação.
- **Texto fora do código.** O motor só produz chaves e parâmetros nomeados (`{ key: 'log.job.promoted', params: { job: { t: 'career.it.l2' } } }`). O histórico guarda essas chaves, e por isso muda de idioma.
- **Conteúdo declarativo.** Eventos, profissões, cursos e conquistas são dados. Condições (`stat`, `flag`, `npc`, `employed`…) servem ao mesmo tempo para a elegibilidade e para mostrar requisitos na interface.
- **Monetização inexistente e isolada.** Não há lojas, anúncios nem pontos de integração misturados às regras.

## Sistemas implementados

- **Personagem**: nome, pronomes, contexto familiar (1 ou 2 responsáveis, irmãos, avós, 4 níveis de condição financeira), cidade fictícia e 2 traços de personalidade (11 possíveis) que alteram ganhos, desempenho e reações. Seis atributos de 0 a 100: saúde, felicidade, conhecimento, habilidades sociais, disciplina e reputação. Ganhos ficam menores em atributos altos, e atributos acima de 70 caem um pouco no ano em que não são praticados.
- **Educação**: escola dos 6 aos 17 anos com desempenho anual (estudo, leitura, disciplina e felicidade) e repetência; evasão e supletivo; 13 cursos (técnicos, graduações e mestrado) com duração, mensalidade, requisitos, nota mínima, reprovação e desligamento. Pagamento por economias, ajuda da família (conforme a condição financeira) ou crédito estudantil (3% ao ano, com teto); bolsas conquistadas em eventos; carteira de motorista.
- **Carreira**: 14 profissões com 3 a 5 níveis (varejo, cozinha, armazém, entregas, elétrica, TI, enfermagem, medicina, direito, ensino, engenharia, negócios, design e música), além de uma carreira de startup alcançável por evento. Requisitos de idade, formação, atributos e hobbies; chance de contratação visível; desempenho anual; promoções com critérios explícitos (anos no cargo, desempenho mínimo e requisitos), advertência e demissão; meio período para estudantes; troca de carreira mantendo a experiência; aposentadoria e pensão.
- **Finanças**: salário, imposto progressivo, aposentadoria, auxílio social para adultos sem renda, moradia (família, aluguel pequeno, aluguel confortável, casa própria com financiamento), custo de vida, gasto de estilo de vida proporcional à renda, filhos, manutenção de bens, compras (bicicleta, computador, instrumento, academia, carros, roupas, viagem) com efeitos visíveis. Falta de dinheiro vira dívida a 12% ao ano, com consequências explícitas (retomada do carro, mudança para moradia mais barata, falência como último recurso). Nenhuma ação gera dinheiro ilimitado: o bico só pode ser feito uma vez por ano.
- **Relações**: família, amizades, mentoria, namoro e casamento, ex-parceiros, filhos (biológicos ou adotados) e bichos de estimação. Vínculo de 0 a 100; conversar, passar tempo junto, oferecer apoio, resolver conflitos, pedir dinheiro, encontros, pedido de casamento, término e tentativa de ter filhos. O vínculo esfria quando a pessoa é negligenciada; amizades se desfazem; NPCs envelhecem e morrem; romance só entre adultos.
- **Atividades**: 13 atividades adequadas a cada idade (colo, explorar, brincar, ler, ajudar em casa, hobby, estudar, exercitar, socializar, descansar, voluntariado, habilidades profissionais e bico), com custo, retornos decrescentes e prévia dos ganhos.
- **Eventos**: 107 eventos (86 interativos, com 2 a 4 escolhas) distribuídos entre infância, adolescência, vida adulta e velhice. Cada um tem ID, faixa etária, condições, peso, limite de repetições e intervalo, flags exigidas e produzidas, efeitos imediatos e efeitos futuros agendados. Há 13 cadeias narrativas: amizade de infância → startup → carta na velhice; feira de ciências → bolsa; filhote → velhice do bicho; sonho de infância → cápsula do tempo aberta 20 anos depois; vizinho idoso → herança; janela quebrada → mágoa entre irmãos; receita da família → negócio próprio; furto por desafio → registro ou dívida de consciência; banda de garagem → show → reencontro e gravadora; paixão → reencontro; mentoria → despedida → mentorar alguém; pirâmide financeira → investigação; cigarro → susto de saúde → recuperação.
- **Coerência do mundo**: pessoas mortas não aparecem em interações normais (só em eventos explicitamente sobre a perda, como o funeral); eventos de trabalho exigem emprego; cursos só são concluídos se foram iniciados; consequências agendadas são reavaliadas ao vencer e descartadas se não fizerem mais sentido; só há uma decisão por ano, e as demais são adiadas.
- **Fim da vida**: probabilidade anual que cresce com a idade e com saúde baixa. É uma regra simplificada de jogo, não uma previsão médica. O resumo final traz idade, destaques, formação, carreira, finanças, relações, conquistas (22) e um título narrativo (17 possíveis).
- **Salvamento**: autosave após cada ação, decisão e Age Up; botão Continuar; 3 slots; exportação e importação em JSON; formato versionado com etapa de migração; validação estrutural completa na importação; tratamento de dados corrompidos e de falha ou indisponibilidade do armazenamento; confirmação antes de sobrescrever ou apagar. Nomes importados são limpos e tratados sempre como texto (o React escapa tudo, e não há `dangerouslySetInnerHTML`).
- **Interface**: tema escuro padrão e tema claro; três colunas no desktop e uma vista por vez no celular, com abas; botão Age Up fixo; estados vazios; navegação por teclado (abas com setas, diálogos com foco preso e Esc); foco visível; respeito a `prefers-reduced-motion`, além de uma opção manual para reduzir animações; nenhuma imagem externa.

## Como adicionar conteúdo

### Um evento

1. Adicione a definição em `src/content/events/<fase>.ts` (os helpers de `helpers.ts` deixam os dados curtos):

```ts
{
  id: 'rainy_concert',
  minAge: 16,
  maxAge: 40,
  weight: 6,                       // peso relativo no sorteio
  cooldown: 5, maxTimes: 2,        // repetição
  conditions: [statMin('social', 30)],
  npc: { relation: 'friend', minBond: 40 },   // opcional: vincula uma pessoa ({npc})
  choices: [
    { id: 'go', cost: 80, effects: [happy(4), bond('event', 6)] },
    {
      id: 'sneak',
      chance: chance(0.4, { stats: { social: 0.004 } }),
      success: [happy(6), flag('backstage_pass')],
      failure: [rep(-2)],
      effects: [risk],
    },
    { id: 'stay', effects: [] },   // sempre deixe uma opção sem custo e sem requisitos
  ],
},
```

2. Para uma consequência futura, use `schedule('outro_evento', minAnos, maxAnos, true)` (o `true` leva junto a pessoa vinculada) e marque o evento seguinte como `scheduledOnly: true`.
3. Adicione os textos nos três arquivos `src/i18n/locales/*/events.ts`: `title`, `text`, `c.<escolha>` e `r.<escolha>` (ou `r.<escolha>_ok` / `r.<escolha>_fail` quando houver `chance`).
4. Rode `npm test`. Os testes acusam escolhas sem texto, flags exigidas que nada produz, eventos agendados inexistentes e eventos sem opção sempre disponível.

### Uma profissão

Adicione um item a `CAREERS` em `src/content/careers.ts` (idade mínima, requisitos de contratação, atributo principal e níveis com salário, anos mínimos, desempenho mínimo e requisitos extras) e os textos `career.<id>.name` e `career.<id>.l0…lN` em cada `content.ts`. Em português e espanhol, você pode criar variantes de gênero `l1_m` / `l1_f`; a forma base deve ser neutra, porque é usada com pronomes neutros.

### Uma tradução (novo idioma)

1. Copie `src/i18n/locales/en/` para a pasta do novo código (por exemplo, `fr/`) e traduza os três arquivos.
2. Registre o idioma em `LOCALES` (`src/i18n/translate.ts`) e em `DICTIONARIES` (`src/i18n/locales/index.ts`).
3. Rode `npm run i18n:check`: ele lista chaves ausentes ou desconhecidas e placeholders `{nome}` divergentes.

Regras de redação: use frases completas por chave (não concatene fragmentos), parâmetros nomeados (`{name}`, `{amount}`), sufixos de plural (`_one`, `_other`, resolvidos por `Intl.PluralRules`) e variantes gramaticais (`_m`, `_f`; `_he`, `_she`, `_they` no epitáfio). Valores monetários são parâmetros `{ money: n }`, formatados por idioma com a moeda fictícia `¤`.

## Testes

`npm test` executa 74 testes em `tests/`:

- `limits.test.ts`: limites 0–100 dos atributos, orçamento de ações, retornos decrescentes, bico uma vez por ano, Age Up bloqueado durante uma decisão, nomes não repetidos.
- `events.test.ts`: quantidade e distribuição de eventos, cadeias, 2 a 4 escolhas com ao menos uma sempre possível, flags e agendamentos válidos, elegibilidade (pessoa morta, sem emprego, faixa etária, eventos só agendados, romance só entre adultos).
- `finance.test.ts`: receitas e despesas processadas uma única vez por ano, coerência com o extrato, déficit vira dívida, imposto progressivo, compras sem saldo, dívida sem explosão, falência.
- `consequences.test.ts`: amizade de infância que volta anos depois, consequência descartada quando a pessoa sai da história, vantagem imediata com problema futuro, espera pela idade certa, uma decisão por ano e funeral de um responsável falecido.
- `save.test.ts`: ida e volta em JSON, rejeição de arquivos inválidos, estrangeiros, de versão futura ou danificados, sanitização de nomes, slots, falhas de armazenamento, configurações, determinismo e ausência de novo sorteio ao recarregar.
- `i18n.test.ts`: paridade de chaves e placeholders entre os idiomas, cobertura de todo o conteúdo, chaves usadas no código, fallback, plurais, variantes e formatação de dinheiro.
- `life.test.ts`: vidas completas até a morte, com resumo e histórico 100% traduzíveis nos três idiomas.
- `balance.test.ts`: limites de equilíbrio com um jogador automático (expectativa de vida, riqueza e progressão).
- `ui.test.tsx`: renderização de todas as telas e painéis nos três idiomas, sem chaves cruas nem placeholders vazando.

## Limitações e pendências reais

- Não há herança jogável entre gerações (fora do escopo desta versão).
- Os saves ficam só no `localStorage` do navegador; limpar os dados do site apaga as vidas. A exportação em JSON é o backup.
- O balanceamento foi ajustado com simulações automáticas (`tests/balance.test.ts`), não com testes de jogadores reais; valores de salários, custos e chances provavelmente ainda pedem ajuste fino.
- Os textos em português e espanhol foram escritos para este projeto, com redação neutra em gênero onde possível, mas não passaram por revisão de falantes nativos externos. O espanhol busca uma variante neutra entre Espanha e América Latina e pode soar regional em alguns termos.
- O bundle tem cerca de 640 kB (210 kB com gzip), sobretudo por carregar o texto dos três idiomas de uma vez. Carregar idiomas sob demanda seria uma otimização possível.
- Não há testes automatizados de navegador no repositório: a interface foi verificada com renderização no servidor (Vitest) e manualmente no Chromium (desktop e celular) durante o desenvolvimento.
- Não há som, ilustrações nem animações de personagem: a experiência é deliberadamente tipográfica.
