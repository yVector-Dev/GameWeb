// Textos dos eventos em português brasileiro. Redação neutra: o jogador é
// tratado por "você" e as outras pessoas pelo nome ({npc}).
export default {
  ev: {
    // ── Infância ────────────────────────────────────────────────────────────
    first_word: {
      title: 'Primeira palavra',
      text: 'Sua primeira palavra foi {word}. A família vai contar essa história por anos.',
    },
    first_steps: {
      title: 'Primeiros passos',
      text: 'Você deu seus primeiros passos trôpegos, direto na mesinha de centro. Só o orgulho da mesinha saiu ferido.',
    },
    toddler_tantrum: {
      title: 'O corredor dos doces',
      text: 'No supermercado, uma parede de doces está exatamente na altura dos seus olhos. Ela chama seu nome.',
      c: { scream: 'Gritar até alguém ceder', ask: 'Apontar e dizer “por favor”', sneak: 'Colocar um pacote no carrinho, discretamente' },
      r: {
        scream: 'Você ganhou o doce e os olhares de todo o mercado. A família não achou graça.',
        ask: 'A família ficou tão encantada com a educação que você ganhou um docinho.',
        sneak_ok: 'Ninguém percebeu até o caixa, e aí já era tarde para discutir.',
        sneak_fail: 'O pacote caiu no caixa. Flagra, e nada de doce por uma semana.',
      },
    },
    imaginary_friend: {
      title: 'Capitão Talharim',
      text: 'Você inventou uma amizade imaginária chamada Capitão Talharim, que exige lugar à mesa no jantar.',
      c: { keep: 'Manter o Capitão por perto', introduce: 'Apresentar o Capitão à família', let_go: 'Dar tchau ao Capitão' },
      r: {
        keep: 'Você e o Capitão Talharim desenharam mapas de mundos imaginários por meses.',
        introduce: 'A família pôs um prato a mais. Foi o jantar mais divertido em semanas.',
        let_go: 'Você decidiu que já era grande demais para isso. O Capitão bateu continência e sumiu.',
      },
    },
    first_day_school: {
      title: 'Primeiro dia de aula',
      text: 'A sala é enorme e barulhenta, cheia de crianças que você nunca viu.',
      c: { cling: 'Agarrar-se à família', stranger: 'Sentar ao lado de alguém que também parece ter medo', explore: 'Inspecionar cada prateleira e gaveta' },
      r: {
        cling: 'A professora levou um tempo para convencer você a entrar. O dia passou, a duras penas.',
        stranger: 'Na hora do lanche vocês já eram inseparáveis. Sua primeira amizade da escola!',
        explore: 'Você achou o hamster da turma, o material de arte e o pote secreto de biscoitos da professora.',
      },
    },
    new_kid: {
      title: 'Gente nova na turma',
      text: 'Uma criança nova, {npc}, almoça sozinha todo dia, fingindo ler a mesma página.',
      c: { invite: 'Chamar {npc} para sentar com você', wave: 'Dar um aceno simpático', ignore: 'Cuidar da sua vida', tease: 'Entrar na zoação dos outros' },
      r: {
        invite: '{npc} se iluminou. No fim da semana, vocês trocavam lanches e segredos. Começou uma amizade.',
        wave: '{npc} acenou de volta, com timidez. Talvez um dia vocês conversem.',
        ignore: 'Você almoçou. {npc} continuou lendo a mesma página.',
        tease: 'Os outros riram. {npc} não. É o tipo de coisa que as pessoas lembram.',
      },
    },
    lost_tooth: {
      title: 'Dente mole',
      text: 'Seu primeiro dente de leite ficou preso numa maçã. Na manhã seguinte, havia uma moeda brilhante debaixo do travesseiro.',
    },
    science_fair: {
      title: 'Feira de ciências',
      text: 'A feira de ciências da escola é daqui a três semanas. Todo mundo fala em vulcões.',
      c: { work_hard: 'Passar todos os fins de semana num projeto original', kit: 'Pedir à família um kit pronto', parent: 'Deixar um adulto “ajudar” (fazer tudo)' },
      r: {
        work_hard_ok: 'Seu filtro de água caseiro ganhou o primeiro lugar. Até o jornal do bairro publicou uma foto.',
        work_hard_fail: 'O projeto desabou uma hora antes da avaliação. Mesmo assim, você aprendeu muito.',
        kit: 'O vulcão do kit entrou em erupção na hora certa. Sólido, ainda que pouco original.',
        parent: 'O projeto parecia profissional demais. A professora levantou uma sobrancelha.',
      },
    },
    stray_puppy: {
      title: 'Uma sombra de quatro patas',
      text: 'Um filhote desgrenhado seguiu você da escola até em casa e agora está na porta, abanando o rabo.',
      c: { adopt: 'Implorar para ficar com ele', shelter: 'Levar ao abrigo de animais', shoo: 'Enxotar o filhote' },
      r: {
        adopt: 'Depois de uma longa reunião de família, a resposta foi sim. O filhote ganhou o nome {npc}.',
        shelter: 'A equipe do abrigo agradeceu. Você voltou duas vezes para ter certeza de que ele foi adotado.',
        shoo: 'O filhote acabou indo embora. Você pensou nele por dias.',
      },
    },
    dream_job: {
      title: 'Quando eu crescer',
      text: 'A professora pede para a turma desenhar o que quer ser quando crescer.',
      c: { doctor: 'Trabalhar salvando vidas na medicina', artist: 'Fazer arte e ter fama no mundo todo', inventor: 'Inventar robôs', teacher: 'Dar aulas, como a professora' },
      r: {
        doctor: 'Você se desenhou de jaleco branco, curando um ursinho gigante.',
        artist: 'Você se desenhou numa galeria cheia das suas próprias pinturas.',
        inventor: 'Você desenhou um robô que faz a lição de casa. A professora riu e pendurou o desenho.',
        teacher: 'A professora se emocionou e pendurou o desenho acima da lousa.',
      },
    },
    time_capsule: {
      title: 'A cápsula do tempo',
      text: 'Sua turma vai enterrar uma cápsula do tempo no pátio, para ser aberta daqui a vinte anos.',
      c: { letter: 'Escrever uma carta para seu eu do futuro', toy: 'Colocar seu brinquedo favorito', skip: 'Guardar suas coisas, valeu' },
      r: {
        letter: 'Você escreveu sobre seus sonhos e lacrou o envelope. Seu eu do futuro que se cuide.',
        toy: 'Doeu se desfazer dele, mas pareceu importante.',
        skip: 'Você viu a turma enterrar seus tesouros e manteve os seus no bolso.',
      },
    },
    neighbor_groceries: {
      title: 'Sacolas pesadas',
      text: 'Quem mora ao lado, {npc}, tem idade avançada e está com dificuldade de subir a escada com sacolas pesadas.',
      c: { help: 'Carregar as sacolas', pretend: 'Fingir que não viu', charge: 'Oferecer ajuda por uma moeda' },
      r: {
        help: '{npc} agradeceu com limonada e histórias dos velhos tempos. Virou uma visita semanal.',
        pretend: 'Você olhou para os próprios sapatos. {npc} acabou subindo, devagar.',
        charge: '{npc} riu, pagou e previu que você teria um futuro nos negócios.',
      },
    },
    broken_window: {
      title: 'Crash!',
      text: 'Sua bola acabou de atravessar a janela da casa vizinha. Ninguém viu quem chutou.',
      c: { confess: 'Bater na porta e confessar', run: 'Correr!', blame: 'Dizer que foi seu irmão ou sua irmã' },
      r: {
        confess: 'A vizinhança ficou surpresa e grata pela honestidade. Você fez tarefas para pagar o vidro.',
        run_ok: 'Você escapou sem ninguém ver. O coração disparou por horas.',
        run_fail: 'Reconheceram sua bola. A família descobriu, e fugir piorou tudo.',
        blame: 'Quem levou a culpa ficou de castigo por uma semana e nunca esqueceu.',
      },
    },
    bully: {
      title: 'O pedágio do lanche',
      text: 'Uma criança maior bloqueia seu caminho e exige o dinheiro do seu lanche.',
      c: { stand_up: 'Não ceder', tell: 'Contar para a professora', avoid: 'Fazer outro caminho a partir de agora', befriend: 'Perguntar por que está fazendo isso' },
      r: {
        stand_up_ok: 'A criança recuou na frente de todo mundo. Ninguém mais incomodou você.',
        stand_up_fail: 'Você levou um empurrão contra os armários. Ainda assim, todos viram que você não cedeu.',
        tell: 'A professora resolveu com discrição. Alguns chamaram você de dedo-duro, mas o bullying parou.',
        avoid: 'O caminho mais longo somou dez minutos ao dia, mas funcionou.',
        befriend_ok: 'A criança estava com fome. Você dividiu o lanche, e nasceu uma amizade improvável.',
        befriend_fail: 'A criança riu e levou o dinheiro mesmo assim.',
      },
    },
    school_play: {
      title: 'A peça da escola',
      text: 'Os testes para a peça da escola são nesta semana. O papel principal é um dragão falante.',
      c: { audition: 'Fazer o teste para o dragão', backstage: 'Pintar os cenários', skip: 'Não é a sua praia' },
      r: {
        audition_ok: 'Você ganhou o papel e rugiu direto para a lenda da escola.',
        audition_fail: 'Você travou na primeira fala. Ficou com o papel de “Árvore nº 3”.',
        backstage: 'Seu castelo pintado ganhou aplausos próprios.',
        skip: 'Você assistiu da plateia e aplaudiu as amizades.',
      },
    },
    chickenpox: {
      title: 'Bolinhas por todo lado',
      text: 'Catapora! Uma semana de coceira, banhos de aveia e desenhos animados.',
    },
    found_wallet: {
      title: 'Uma carteira na calçada',
      text: 'Você encontra uma carteira na calçada, com documento e algum dinheiro dentro.',
      c: { return: 'Devolver no endereço do documento', keep: 'Ficar com o dinheiro e jogar a carteira fora', leave: 'Deixar onde está' },
      r: {
        return: 'A dona da carteira quase chorou. A fama da sua honestidade correu o bairro.',
        keep: 'O dinheiro sumiu em uma semana. A culpa durou mais.',
        leave: 'Você seguiu em frente. Outra pessoa que resolva.',
      },
    },
    grandparent_recipe: {
      title: 'A receita secreta',
      text: '{npc} oferece ensinar a receita da família que ninguém mais teve a honra de aprender.',
      c: { learn: 'Arregaçar as mangas', later: 'Talvez outro dia' },
      r: {
        learn: 'Farinha para todo lado, risadas para todo lado. Agora você carrega um pedaço da história da família.',
        later: '{npc} sorriu, mas deu para notar uma pontinha de decepção.',
      },
    },
    spelling_bee: {
      title: 'Concurso de soletração',
      text: 'A turma escolheu você para o concurso de soletração.',
      c: { practice: 'Treinar toda noite', wing_it: 'Confiar no instinto', skip: 'Deixar outra pessoa ir' },
      r: {
        practice_ok: 'Você soletrou “otorrinolaringologista” sem piscar e levou o troféu para casa.',
        practice_fail: 'Você caiu em “exceção”. Mesmo assim, o treino rendeu nas aulas.',
        wing_it_ok: 'Só no instinto, você chegou à rodada final. Impressionante!',
        wing_it_fail: 'Você saiu na primeira rodada. Na palavra “casa”. Com Z.',
        skip: 'Outra pessoa foi. Você torceu da plateia.',
      },
    },
    parent_job_loss: {
      title: 'Tempos difíceis',
      text: '{npc} perdeu o emprego. A casa está mais quieta, e os adultos cochicham sobre contas.',
      c: { savings: 'Oferecer seu cofrinho', cheer: 'Fazer um cartão para animar', quiet: 'Ficar fora do caminho' },
      r: {
        savings: '{npc} abraçou você por muito tempo e não aceitou nenhuma moeda. Bom, talvez algumas.',
        cheer: 'Seu cartão ficou na geladeira por anos.',
        quiet: 'Você ficou no quarto. A casa pareceu pesada por meses.',
      },
    },
    summer_camp: {
      title: 'Acampamento de férias',
      text: 'Sua família pode mandar você para um acampamento neste ano. Qual?',
      c: { sports: 'Acampamento de esportes', science: 'Acampamento de ciências', music: 'Acampamento de música', home: 'Ficar em casa nas férias' },
      r: {
        sports: 'Três semanas de corrida, natação e queimadura de sol. Você voltou mais forte.',
        science: 'Você construiu um foguete que voou de verdade. Quase sempre de lado, mas voou.',
        music: 'Você aprendeu suas primeiras músicas de verdade em volta da fogueira.',
        home: 'Férias preguiçosas de piqueniques em família e tardes longas.',
      },
    },
    new_sibling: {
      title: 'Chegou mais um',
      text: 'A família cresceu: conheça {npc}, o bebê mais novo da casa! Dormir vai ser raro por um tempo.',
    },
    sleepover: {
      title: 'Festa do pijama',
      text: '{npc} convida você para dormir lá neste fim de semana.',
      c: { go: 'Arrumar o saco de dormir', host: 'Sugerir que seja na sua casa', decline: 'Ficar em casa' },
      r: {
        go: 'Cabaninha de travesseiros, histórias de fantasma e zero horas de sono. Perfeito.',
        host: 'Sua família fez panquecas de manhã. {npc} fala delas até hoje.',
        decline: '{npc} pareceu sentir um pouco de mágoa.',
      },
    },
    museum_trip: {
      title: 'Excursão',
      text: 'Numa excursão ao museu de história natural, você parou sob um esqueleto de dinossauro e esqueceu de respirar.',
    },
    learn_bike: {
      title: 'Duas rodas',
      text: 'Depois de muitos joelhos ralados, você finalmente andou de bicicleta sem ajuda. Liberdade!',
    },

    // ── Adolescência ────────────────────────────────────────────────────────
    first_phone: {
      title: 'Seu primeiro celular',
      text: 'Você finalmente ganhou seu próprio celular. O mundo inteiro cabe no bolso.',
      c: { all_in: 'Entrar em todos os apps e grupos', balanced: 'Criar alguns limites', decline: 'Usar só para ligações' },
      r: {
        all_in: 'Agora você está sempre por dentro de tudo, e sempre com um pouco de sono.',
        balanced: 'Notificações desligadas depois das nove. Seu sono agradece.',
        decline: 'Você perdeu algumas piadas, mas leu três romances.',
      },
    },
    exam_cheat: {
      title: 'As respostas',
      text: 'Alguém da turma cochicha que as respostas da prova estão circulando e oferece uma cópia.',
      c: { cheat: 'Pegar a cópia', study: 'Estudar a noite inteira', report: 'Avisar a professora' },
      r: {
        cheat_ok: 'Você gabaritou. Ninguém descobriu, mas a nota tem gosto de nada.',
        cheat_fail: 'A professora tinha trocado as questões. O flagra foi inevitável, e chamaram sua família.',
        study: 'Você chegou à prova morrendo de sono, mas sabendo tudo.',
        report: 'A prova foi refeita. Parte da turma ficou furiosa com você; os professores, não.',
      },
    },
    house_party: {
      title: 'A festa em casa',
      text: 'Os pais de alguém viajaram no fim de semana, e a série inteira foi convidada.',
      c: { wild: 'Ir e ficar até o fim', early: 'Ir, mas sair cedo', stay: 'Ficar em casa' },
      r: {
        wild_ok: 'Uma noite lendária. Você chegou antes que alguém percebesse.',
        wild_fail: 'A vizinhança chamou a polícia. Sua família foi buscar você. O silêncio no carro foi ensurdecedor.',
        early: 'Você pegou a melhor parte e dormiu na própria cama.',
        stay: 'Na segunda, você ouviu tudo. Pareceu incrível e terrível ao mesmo tempo.',
      },
    },
    dare_shoplift: {
      title: 'O desafio',
      text: 'As amizades desafiam você a pegar um chocolate da mercearia da esquina sem pagar. Estão olhando.',
      c: { do_it: 'Topar', refuse: 'Recusar', pay: 'Pagar escondido e fingir' },
      r: {
        do_it_ok: 'Você saiu com o chocolate e o coração disparado. A turma vibrou. Você ficou com uma sensação estranha.',
        do_it_fail: 'O dono pegou você na porta, ligou para sua família e registrou uma ocorrência.',
        refuse: 'A turma disse que você era sem graça. Algumas pessoas respeitaram isso depois.',
        pay: 'A turma nunca soube. Você manteve a consciência limpa e a reputação.',
      },
    },
    start_band: {
      title: 'Banda de garagem',
      text: 'Algumas amizades estão montando uma banda numa garagem e precisam de mais uma pessoa.',
      c: { join: 'Pegar um instrumento e entrar', manage: 'Virar a pessoa que empresaria a banda', decline: 'Não é para você' },
      r: {
        join: 'Você toca mal. Todo mundo toca mal. É a melhor coisa do mundo.',
        manage: 'Você fez cartazes e reservou o primeiro estúdio de ensaio da banda.',
        decline: 'Você ouvia os ensaios a três ruas de distância. Que bom que recusou.',
      },
    },
    band_gig: {
      title: 'O primeiro show',
      text: 'A banda conseguiu o primeiro show de verdade: uma sexta à noite num café do bairro.',
      c: { originals: 'Tocar as músicas próprias', covers: 'Tocar sucessos garantidos', quit: 'Sair da banda antes do show' },
      r: {
        originals_ok: 'O dono do café chamou vocês de novo. Alguém na plateia cantarolava o refrão.',
        originals_fail: 'Microfonia, corda arrebentada e metade do público foi embora. Rock and roll.',
        covers: 'Todo mundo cantou junto. Não foi arte, mas foi muito divertido.',
        quit: 'Você saiu. A banda tocou sem você e foi, sinceramente, bem.',
      },
    },
    band_reunion: {
      title: 'A ligação da reunião',
      text: 'Alguém da antiga banda liga: um produtor quer a banda da sua adolescência num festival nostálgico.',
      c: { reunite: 'Reunir a banda', pitch: 'Apresentar as músicas novas que você compôs', decline: 'Deixar o passado no passado' },
      r: {
        reunite: 'Mais velhos, mais lentos, mais altos. O público adorou, e você também.',
        pitch_ok: 'Uma gravadora ouviu o material novo e ofereceu um contrato!',
        pitch_fail: 'A gravadora recusou. O festival foi incrível mesmo assim.',
        decline: 'Naquela noite, você ouviu uma gravação antiga e sorriu.',
      },
    },
    part_time_offer: {
      title: 'Trabalho de fim de semana',
      text: 'Negócios do bairro estão contratando adolescentes para os fins de semana.',
      c: { shop: 'Trabalhar na lojinha da esquina', kitchen: 'Trabalhar na cozinha de um café', decline: 'Manter os fins de semana livres' },
      r: {
        shop: 'Você aprendeu a contar troco rápido e a sorrir para clientes rabugentos.',
        kitchen: 'Quente, barulhento e caótico. Você gostou mais do que esperava.',
        decline: 'Os fins de semana continuam seus, por enquanto.',
      },
    },
    friend_in_trouble: {
      title: 'Uma amizade em apuros',
      text: 'A família de {npc} está perdendo a casa. Em voz baixa, {npc} pergunta se poderia ficar com você por algumas semanas.',
      c: { host: 'Pedir à sua família para receber {npc}', lend: 'Dar metade das suas economias a {npc}', adult: 'Contar a um adulto de confiança que possa ajudar', refuse: 'Dizer que não pode ajudar' },
      r: {
        host: 'Ficou apertado e a família reclamou, mas {npc} nunca vai esquecer.',
        lend: '{npc} protestou, depois aceitou com lágrimas nos olhos.',
        adult: 'A orientação escolar encontrou apoio para a família. {npc} agradeceu, com um pouco de vergonha.',
        refuse: '{npc} disse que entendia. As coisas nunca mais foram as mesmas.',
      },
    },
    scholarship_competition: {
      title: 'A prova da bolsa',
      text: 'Uma fundação oferece bolsas universitárias para os melhores jovens de ciências. A prova é no mês que vem.',
      c: { prepare: 'Estudar como se o futuro dependesse disso', relaxed: 'Fazer sem muita preparação', skip: 'Não fazer' },
      r: {
        prepare_ok: 'Você ganhou! A maior parte das mensalidades da faculdade estará coberta.',
        prepare_fail: 'Ficou a poucos pontos da nota de corte. Todo aquele estudo afiou sua mente mesmo assim.',
        relaxed_ok: 'Contra todas as probabilidades, você ganhou uma bolsa parcial.',
        relaxed_fail: 'Você não se classificou. Talvez devesse ter estudado.',
        skip: 'Você passou aquele mês fazendo outras coisas.',
      },
    },
    driving_lesson: {
      title: 'Estacionamento vazio',
      text: '{npc} se oferece para ensinar você a dirigir num estacionamento vazio no domingo de manhã.',
      c: { careful: 'Ir com calma e prestar atenção', fast: 'Exibir-se um pouco', later: 'Talvez no ano que vem' },
      r: {
        careful: 'Espelhos, setas, paciência. Você vai chegar à prova com preparo de sobra.',
        fast_ok: 'Você fez uma curva perfeita e {npc} gargalhou.',
        fast_fail: 'Você conheceu um poste. De leve. {npc} ficou bem quieto na volta.',
        later: 'A chave do carro ficou no gancho.',
      },
    },
    sports_tryout: {
      title: 'Seletiva do time',
      text: 'A seletiva do time da escola é hoje à tarde.',
      c: { tryout: 'Dar tudo de si', cheer: 'Torcer da arquibancada', skip: 'Ir para casa ler' },
      r: {
        tryout_ok: 'Você entrou no time! O treino é puxado e você adora.',
        tryout_fail: 'Desta vez não deu. O técnico pediu para você voltar no ano que vem.',
        cheer: 'Sua voz foi a mais alta da arquibancada.',
        skip: 'Você terminou um ótimo livro.',
      },
    },
    dropout_temptation: {
      title: 'Para quê?',
      text: 'A escola parece inútil. Uma prima diz que há trabalho num armazém, pagando em dinheiro, agora.',
      c: { drop: 'Largar a escola e aceitar o trabalho', stay: 'Cerrar os dentes e ficar', counselor: 'Conversar com a orientação escolar' },
      r: {
        drop: 'Você saiu da escola pela última vez. O salário é real. A preocupação em casa também.',
        stay: 'É difícil, mas você continua lá.',
        counselor: 'A orientação ajudou você a montar um plano. A escola parece um pouco menos inútil.',
      },
    },
    picture_day: {
      title: 'Dia da foto',
      text: 'Uma espinha gigante escolheu o dia da foto da turma para aparecer. O anuário vai preservá-la para sempre.',
    },
    volunteer_shelter: {
      title: 'Retribuindo',
      text: 'A escola pede que os estudantes façam trabalho voluntário em alguns fins de semana.',
      c: { animals: 'Ajudar no abrigo de animais', food_bank: 'Separar doações no banco de alimentos', busy: 'Sem tempo agora' },
      r: {
        animals: 'Você passeou com cães e limpou canis, e voltou para casa com pelos por toda parte e o coração feliz.',
        food_bank: 'Você separou toneladas de comida e conheceu gente de toda a cidade.',
        busy: 'Fica para a próxima.',
      },
    },
    viral_video: {
      title: 'Viralizou',
      text: 'Um vídeo seu dançando mal numa festa de família viralizou da noite para o dia.',
      c: { lean_in: 'Abraçar a fama e postar mais', delete: 'Pedir para tirarem do ar', laugh: 'Rir junto' },
      r: {
        lean_in_ok: 'Os vídeos seguintes fizeram sucesso. Uma marca local até mandou um pequeno cachê.',
        lean_in_fail: 'A internet se voltou contra você. Os comentários foram cruéis.',
        delete: 'Levou semanas, mas o vídeo sumiu.',
        laugh: 'Você assumiu a situação. As pessoas gostaram ainda mais de você.',
      },
    },
    career_fair: {
      title: 'Feira de profissões',
      text: 'O ginásio da escola está cheio de estandes de empresas e faculdades.',
      c: { tech: 'O estande de tecnologia', health: 'O estande do hospital', trades: 'O estande de eletricistas', people: 'O estande de direito e educação' },
      r: {
        tech: 'Você passou uma hora brincando com um braço robótico. Algo fez sentido.',
        health: 'Uma enfermeira contou histórias que ficaram com você por semanas.',
        trades: 'Você ligou uma lâmpada sem ajuda e sentiu ter poderes mágicos.',
        people: 'Uma juíza e um professor discutiram quem tem o trabalho mais difícil. Você achou fascinante.',
      },
    },
    talent_show: {
      title: 'Show de talentos',
      text: 'O show de talentos da escola precisa de números. As inscrições fecham hoje.',
      c: { sing: 'Cantar uma música', comedy: 'Fazer stand-up', watch: 'Assistir da plateia' },
      r: {
        sing_ok: 'Sua voz falhou uma vez, e ninguém ligou. Aplausos de pé.',
        sing_fail: 'Você esqueceu a segunda estrofe e cantarolou. A plateia cantarolou junto, com carinho.',
        comedy_ok: 'O ginásio explodiu em risadas. Até a direção riu.',
        comedy_fail: 'Grilos. Uma tosse. Um dia você vai rir disso.',
        watch: 'Você aplaudiu todos os números, inclusive quem tocou colheres.',
      },
    },
    grandparent_story: {
      title: 'Histórias antigas',
      text: '{npc} passou uma noite contando histórias da juventude. Você percebeu o quanto não sabia.',
    },

    // ── Vida adulta ─────────────────────────────────────────────────────────
    after_school: {
      title: 'E agora?',
      text: 'A escola acabou. O futuro está escancarado, o que é empolgante e assustador.',
      c: { study: 'Focar nos estudos', work: 'Focar em arrumar trabalho', gap: 'Tirar um ano sabático para viajar', slow: 'Ir com calma, um dia de cada vez' },
      r: {
        study: 'Você começou a ler catálogos de cursos. (A matrícula fica na aba Estudo e trabalho.)',
        work: 'Você caprichou no currículo. Empregadores vão notar essa garra nos próximos anos.',
        gap: 'Albergues, trens e novas amizades. Você voltou com histórias e um olhar mais amplo.',
        slow: 'Sem pressa. Você vai descobrir.',
      },
    },
    roommate: {
      title: 'A questão da república',
      text: 'Quem divide o apartamento com você deixa louça suja por todo lado e “pega emprestada” sua comida.',
      c: { confront: 'Ter uma conversa franca', clean: 'Limpar tudo por conta própria', chart: 'Criar uma escala de tarefas' },
      r: {
        confront_ok: 'Foi constrangedor, mas a louça começou a ser lavada.',
        confront_fail: 'Virou briga. O clima no apartamento está tenso.',
        clean: 'Cozinha limpa, ressentimento silencioso.',
        chart: 'A escala funcionou de verdade. Você é um gênio da organização doméstica.',
      },
    },
    campus_party: {
      title: 'Festa no campus',
      text: 'Vai rolar uma festa enorme no campus na véspera de uma prova importante.',
      c: { go: 'Ir à festa', study: 'Estudar', group: 'Organizar um grupo de estudo com petiscos' },
      r: {
        go: 'Você fez uma nova amizade e não lembrou quase nada da matéria.',
        study: 'Noite tranquila, prova sólida.',
        group: 'Metade estudo, metade risada. Todo mundo passou.',
      },
    },
    meet_cute: {
      title: 'Uma faísca',
      text: 'No aniversário de uma amizade, você sempre acaba na mesma conversa com {npc}.',
      c: { ask_out: 'Chamar {npc} para sair', numbers: 'Trocar contatos como amizade', leave: 'Deixar o momento passar' },
      r: {
        ask_out_ok: '{npc} disse sim antes de você terminar a pergunta. Vocês estão namorando!',
        ask_out_fail: '{npc} sorriu com gentileza e disse não. Ai.',
        numbers: 'Vocês mantiveram contato. Uma boa amizade, pelo menos por enquanto.',
        leave: 'Você foi embora cedo e ficou imaginando o que poderia ter sido.',
      },
    },
    old_flame: {
      title: 'Uma antiga paixão',
      text: 'Numa estação de trem, você esbarra em {npc}, com quem já namorou, pela primeira vez em anos.',
      c: { coffee: 'Tomar um café e colocar o papo em dia', rekindle: 'Ver se ainda existe algo', nod: 'Acenar educadamente e seguir' },
      r: {
        coffee: 'Duas horas voaram. Vocês saíram como amizade, e isso pareceu certo.',
        rekindle_ok: 'Existia. Vocês estão juntos de novo, com mais idade e mais sabedoria.',
        rekindle_fail: 'Não existia. Foi um pouco triste e um pouco libertador.',
        nod: 'Vocês sorriram e seguiram caminhos separados.',
      },
    },
    friend_startup: {
      title: 'A grande ideia',
      text: '{npc}, sua amizade de infância, está abrindo uma empresa e quer você no time.',
      c: { join: 'Largar seus planos e entrar', invest: 'Investir parte das economias', advice: 'Dar conselhos, só isso', decline: 'Desejar boa sorte a {npc}' },
      r: {
        join: 'Noites longas, pizza barata, sonhos enormes. Agora você trabalha numa startup.',
        invest: 'Você assinou o cheque. {npc} emoldurou uma cópia.',
        advice: 'Você passou uma noite rabiscando planos com {npc}. Pareceu os velhos tempos.',
        decline: '{npc} entendeu, mas a decepção ficou clara.',
      },
    },
    startup_outcome: {
      title: 'A hora da verdade',
      text: 'Anos de trabalho depois, a empresa de {npc} chega ao momento decisivo.',
      c: { push: 'Defender a abertura de capital', sell: 'Apoiar a venda para uma concorrente maior', cash_out: 'Pedir para resgatar seu investimento', stand_by: 'Simplesmente ficar ao lado de {npc}' },
      r: {
        push_ok: 'A abertura de capital foi um triunfo. Suas ações valem uma fortuna!',
        push_fail: 'Os investidores desistiram na última hora. A empresa fechou e você perdeu o emprego.',
        sell: 'A venda saiu. Um bom pagamento, e você manteve um emprego na nova dona.',
        cash_out_ok: 'Seu investimento rendeu muito bem.',
        cash_out_fail: 'A empresa não pôde pagar. Seu investimento se foi.',
        stand_by: 'Independentemente do destino da empresa, a amizade saiu mais forte.',
      },
    },
    mentor_offer: {
      title: 'Surge uma mentoria',
      text: '{npc}, alguém respeitado e experiente no trabalho, oferece mentoria a você.',
      c: { accept: 'Aceitar com gratidão', decline: 'Recusar educadamente', compete: 'Provar que não precisa de ajuda' },
      r: {
        accept: 'Os cafés semanais com {npc} ensinam mais do que qualquer curso.',
        decline: '{npc} assentiu. A oferta não se repetiu.',
        compete: 'Você trabalhou em dobro para mostrar que dava conta. Foi exaustivo.',
      },
    },
    mentor_farewell: {
      title: 'Discurso de despedida',
      text: '{npc} vai se aposentar e pediu que você faça o discurso de despedida.',
      c: { heartfelt: 'Falar com o coração', funny: 'Fazer um discurso engraçado', decline: 'Dizer que não leva jeito para discursos' },
      r: {
        heartfelt_ok: 'Não sobrou um olho seco na sala. {npc} deu um longo abraço em você.',
        heartfelt_fail: 'Você se emocionou e se perdeu. {npc} gostou mesmo assim.',
        funny_ok: 'A sala morreu de rir, {npc} mais do que todos.',
        funny_fail: 'Uma piada caiu mal. Muito mal.',
        decline: '{npc} sentiu a mágoa, mas preferiu não dizer nada.',
      },
    },
    shady_investment: {
      title: 'MoonPenny',
      text: 'Um conhecido oferece uma vaga antecipada no “MoonPenny”: quem entra cedo é pago por quem entra depois.',
      c: { buy_in: 'Entrar cedo', recruit: 'Entrar e recrutar as amizades', decline: 'Recusar', report: 'Denunciar às autoridades' },
      r: {
        buy_in: 'Em semanas, seu dinheiro mais que dobrou. Dinheiro fácil… certo?',
        recruit: 'As amizades entraram e seu ganho foi enorme. Algumas pessoas já estão fazendo perguntas.',
        decline: 'Você guardou suas economias. Parecia bom demais para ser verdade.',
        report: 'O esquema foi desmontado antes de crescer. Discretamente, você poupou muita gente de perder muito dinheiro.',
      },
    },
    moonpenny_probe: {
      title: 'Investigação na porta',
      text: 'O MoonPenny era uma pirâmide financeira. A investigação está procurando quem entrou cedo e lucrou.',
      c: { cooperate: 'Cooperar e devolver o lucro', lawyer: 'Contratar advocacia', deny: 'Negar tudo', apologize: 'Ressarcir as amizades que você recrutou' },
      r: {
        cooperate: 'Você devolveu os lucros. Doeu, mas o caso foi encerrado.',
        lawyer_ok: 'A defesa fez um acordo discreto.',
        lawyer_fail: 'O tribunal não se convenceu. Multas pesadas e uma ficha criminal.',
        deny_ok: 'A investigação tinha peixes maiores para pescar. Sorte sua.',
        deny_fail: 'Os registros mostravam tudo. Multas enormes, ficha criminal e reputação manchada.',
        apologize: 'Você ressarciu quem confiou em você. A maioria perdoou.',
      },
    },
    stress_habit: {
      title: 'Pressão',
      text: 'Os prazos se acumulam. No intervalo, alguém do trabalho oferece um cigarro “para aliviar”.',
      c: { smoke: 'Aceitar', run: 'Sair para correr', vent: 'Ligar para uma amizade e desabafar' },
      r: {
        smoke: 'Aliviou mesmo. Depois você comprou um maço. Depois outro.',
        run: 'Você voltou com a camiseta ensopada e a cabeça limpa. Virou hábito.',
        vent: 'Vinte minutos reclamando com alguém que entende. Melhor que qualquer cigarro.',
      },
    },
    health_scare: {
      title: 'Sinal de alerta',
      text: 'Uma tosse que não passa leva você ao médico. O exame mostra sinais de alerta de anos de cigarro.',
      c: { quit: 'Parar de vez', cut_down: 'Diminuir um pouco', ignore: 'Ignorar' },
      r: {
        quit: 'As primeiras semanas foram um inferno. Você não cedeu.',
        cut_down: 'Menos cigarros. A tosse continua.',
        ignore: 'Você acendeu um no caminho de casa. O corpo cobra a conta.',
      },
    },
    recovery_milestone: {
      title: 'Respirando melhor',
      text: 'Anos sem fumar. Você sobe escadas sem chiado, e o dinheiro economizado se acumula.',
    },
    wedding_invite: {
      title: 'Reserve a data',
      text: '{npc} vai se casar e faz questão da sua presença.',
      c: { attend: 'Ir e comemorar', speech: 'Ir e fazer um brinde', skip: 'Mandar um cartão' },
      r: {
        attend: 'Você dançou até os pés doerem. {npc} estava radiante.',
        speech_ok: 'Seu brinde fez a sala rir e depois chorar. Perfeito.',
        speech_fail: 'Você contou a história errada. A família do outro lado não riu.',
        skip: '{npc} notou sua ausência.',
      },
    },
    car_breakdown: {
      title: 'Fumaça no capô',
      text: 'Seu carro morreu na estrada, com fumaça saindo do capô.',
      c: { repair: 'Pagar uma oficina', diy: 'Ver tutoriais e consertar por conta própria', sell: 'Vender como sucata' },
      r: {
        repair: 'Caro, mas está rodando como novo.',
        diy_ok: 'Três vídeos, duas juntas raladas e um carro funcionando. Vitória.',
        diy_fail: 'Você piorou tudo. A conta da oficina ficou ainda maior.',
        sell: 'Você vendeu para peças. O ônibus serve. Quase sempre.',
      },
    },
    boss_credit: {
      title: 'Crédito roubado',
      text: 'Numa reunião importante, sua chefia apresenta seu projeto como se fosse dela.',
      c: { confront: 'Falar na reunião', let_go: 'Deixar para lá', document: 'Guardar registros e falar depois' },
      r: {
        confront_ok: 'Com calma, você explicou detalhes que só a autoria conheceria. Todo mundo notou.',
        confront_fail: 'Pareceu um ataque de nervos. Sua chefia não vai esquecer.',
        let_go: 'Você deixou para lá. Ainda incomoda à noite.',
        document: 'Seus registros cuidadosos chegaram às pessoas certas. Sua avaliação seguinte foi brilhante.',
      },
    },
    layoffs: {
      title: 'Boatos de demissão',
      text: 'Boatos de cortes se espalham pela empresa. Todo mundo está nervoso.',
      c: { buyout: 'Aderir ao plano de demissão voluntária', harder: 'Trabalhar mais do que nunca', wait: 'Ficar na sua' },
      r: {
        buyout: 'Você pegou o dinheiro e saiu rumo ao desconhecido.',
        harder_ok: 'Você sobreviveu aos cortes. A chefia notou o esforço.',
        harder_fail: 'Não foi suficiente. Seu cargo foi cortado.',
        wait_ok: 'A tempestade passou longe.',
        wait_fail: 'Seu nome estava na lista.',
      },
    },
    side_business: {
      title: 'Gosto pelos negócios',
      text: 'As amizades vivem elogiando sua comida. Por que não vender na feira de fim de semana?',
      c: { launch: 'Alugar uma barraca na feira', catering: 'Fazer um bufê pago, uma vez', family: 'Guardar para os almoços de família' },
      r: {
        launch: 'Você comprou os ingredientes, fez uma plaquinha e abriu sua barraca.',
        catering: 'Exaustivo, mas a clientela adorou e pagou bem.',
        family: 'Os almoços de domingo viraram o ponto alto da semana da família.',
      },
    },
    market_success: {
      title: 'Fila dobrando a esquina',
      text: 'Sua barraca de fim de semana tem fila dobrando a esquina. Um grupo de restaurantes está de olho.',
      c: { expand: 'Abrir um restaurante de verdade', steady: 'Manter pequeno e estável', sell_recipe: 'Vender a receita ao grupo de restaurantes' },
      r: {
        expand_ok: 'O restaurante virou o favorito do bairro. Você construiu algo real.',
        expand_fail: 'Aluguel e salários esmagaram as contas. Você fechou em menos de um ano.',
        steady: 'Uma boa renda extra e uma clientela fiel.',
        sell_recipe: 'Um cheque generoso. A receita secreta não é mais segredo.',
      },
    },
    sibling_loan: {
      title: 'Um favor',
      text: '{npc} pede {amount} emprestados para pagar o aluguel deste mês.',
      c: { lend: 'Emprestar o dinheiro', refuse: 'Dizer não', help_job: 'Ajudar {npc} a encontrar um trabalho melhor' },
      r: {
        lend: '{npc} prometeu devolver logo.',
        refuse: '{npc} desligou com raiva.',
        help_job: 'Você revisou o currículo de {npc} e fez ligações. Isso significou muito.',
      },
    },
    sibling_repay: {
      title: 'Um envelope',
      text: '{npc} aparece na sua porta com um envelope e um sorriso sem graça.',
      c: { accept: 'Abrir o envelope', forgive: 'Dizer a {npc} que fique com o dinheiro' },
      r: {
        accept_ok: 'O valor completo, mais um pouquinho “de juros”. Vocês riram juntos.',
        accept_fail: 'Dentro: uma nota promissória e um desenho de um cifrão. Você não sabe se ri.',
        forgive: '{npc} abraçou você. Algumas coisas valem mais que dinheiro.',
      },
    },
    sibling_reckoning: {
      title: 'Uma mágoa antiga',
      text: 'Num jantar de família, {npc} relembra a janela quebrada da infância: “Você me deixou levar a culpa.”',
      c: { apologize: 'Pedir desculpas sinceras', laugh: 'Tentar levar na brincadeira', deny: 'Negar que isso aconteceu' },
      r: {
        apologize: 'Décadas depois, mas {npc} aceitou. Algo pesado saiu das costas.',
        laugh_ok: 'Todo mundo riu, {npc} também. Feridas antigas podem cicatrizar.',
        laugh_fail: '{npc} não achou graça. O jantar acabou cedo.',
        deny: '{npc} encarou você sem acreditar. A distância aumentou.',
      },
    },
    parent_illness: {
      title: 'Precisando de ajuda',
      text: '{npc} anda com a saúde frágil e precisa de mais ajuda em casa.',
      c: { care: 'Cuidar de {npc} pessoalmente', pay: 'Pagar cuidado profissional', visit: 'Visitar quando puder' },
      r: {
        care: 'Semanas exaustivas, recuperação lenta, longas conversas. Vocês nunca estiveram tão próximos.',
        pay: 'Uma cuidadora agora vem todos os dias. {npc} está em boas mãos.',
        visit: 'Você visita aos fins de semana. Queria que fosse mais.',
      },
    },
    parent_funeral: {
      title: 'Despedida',
      text: 'A família se reúne para se despedir de {npc}.',
      c: { eulogy: 'Fazer o discurso de despedida', quiet: 'Viver o luto em silêncio', reconcile: 'Fazer as pazes com quem está em conflito na família' },
      r: {
        eulogy_ok: 'Suas palavras retrataram {npc} com perfeição. Agradeceram você por semanas.',
        eulogy_fail: 'As palavras mal saíram. Todos entenderam.',
        quiet: 'Você ficou no fundo, lembrando.',
        reconcile: 'O luto abriu uma porta. Pela primeira vez em anos, vocês conversaram de verdade.',
      },
    },
    marathon: {
      title: 'A maratona da cidade',
      text: 'A maratona da cidade é daqui a seis meses. As amizades desafiam você a se inscrever.',
      c: { train: 'Treinar para a maratona completa', fun_run: 'Fazer a corrida recreativa de 5 km', couch: 'Assistir do sofá' },
      r: {
        train_ok: 'Quarenta e dois quilômetros. Você cruzou a linha chorando. Maratona completa!',
        train_fail: 'Você distendeu um músculo no quilômetro 28. Ano que vem.',
        fun_run: 'Medalha, banana, sol. Um bom dia.',
        couch: 'Você torceu do sofá. Com petiscos.',
      },
    },
    jury_duty: {
      title: 'Júri popular',
      text: 'Chega uma carta oficial: sua presença foi convocada para compor o júri.',
      c: { serve: 'Comparecer', excuse: 'Pedir dispensa' },
      r: {
        serve: 'Dias longos, uma decisão difícil e um novo respeito pela justiça.',
        excuse_ok: 'Sua justificativa foi aceita.',
        excuse_fail: 'O juiz não se convenceu. Você serviu assim mesmo, resmungando.',
      },
    },
    midlife_crisis: {
      title: 'É só isso?',
      text: 'Você acorda numa manhã se perguntando se a vida é só isso.',
      c: { car: 'Comprar um carro chamativo', learn: 'Aprender algo totalmente novo', sabbatical: 'Tirar um ano de pausa', therapy: 'Começar terapia' },
      r: {
        car: 'É brilhante, rápido e absolutamente ridículo. Você ama.',
        learn: 'Você começou aulas de música. A vizinhança está sendo paciente.',
        sabbatical: 'Você saiu do emprego e passou um ano caminhando, lendo e descansando. Voltou a se reconhecer.',
        therapy: 'Aos poucos, você aprendeu a se tratar com mais gentileza. Os contratempos doem menos.',
      },
    },
    school_reunion: {
      title: 'Reencontro da turma',
      text: 'Uns vinte anos depois, sua antiga turma marcou um reencontro.',
      c: { attend: 'Ir e reencontrar todo mundo', apologize: 'Procurar a criança que você zoava', brag: 'Ir e impressionar', skip: 'Não ir' },
      r: {
        attend: 'Os mesmos rostos, mais rugas. Você riu até a bochecha doer.',
        apologize: 'Você pediu desculpas por algo de décadas atrás. A surpresa virou gratidão.',
        brag_ok: 'Todo mundo quis saber da sua vida.',
        brag_fail: 'Reviraram os olhos quando você se virou.',
        skip: 'Você viu as fotos on-line. Pareceu divertido.',
      },
    },
    adopt_cat: {
      title: 'Hóspede sem convite',
      text: 'Um gato decidiu que a sua porta é dele e se recusa a ir embora.',
      c: { adopt: 'Deixar o gato entrar', shelter: 'Levar a um abrigo' },
      r: {
        adopt: 'O gato se mudou, tomou a melhor poltrona e aceitou o nome {npc}.',
        shelter: 'O abrigo encontrou um lar para ele em uma semana.',
      },
    },
    burnout: {
      title: 'No limite',
      text: 'Cada dia de trabalho é um tormento. Dormir já não ajuda.',
      c: { leave: 'Tirar licença médica', push: 'Aguentar firme', quit: 'Pedir demissão' },
      r: {
        leave: 'Algumas semanas de pausa. Aos poucos, a cor voltou ao mundo.',
        push: 'Você continuou. O corpo e o humor estão pagando o preço.',
        quit: 'Você saiu. Pela primeira vez em anos, dormiu bem.',
      },
    },
    home_renovation: {
      title: 'Febre de reforma',
      text: 'Sua casa está precisando muito de uma reforma.',
      c: { diy: 'Fazer por conta própria', contractor: 'Contratar uma empreiteira', leave: 'Deixar como está' },
      r: {
        diy_ok: 'Levou meses, mas ficou lindo, e foi você quem fez.',
        diy_fail: 'Você inundou o banheiro. O conserto saiu caro.',
        contractor: 'Caro, mas a casa parece nova.',
        leave: 'A torneira pingando continua sua canção eterna.',
      },
    },
    grandchild: {
      title: 'Uma nova geração',
      text: '{npc} teve um bebê. Você agora tem netos!',
    },
    child_school_trouble: {
      title: 'Ligação da escola',
      text: 'A escola liga: {npc} se meteu em confusão hoje.',
      c: { talk: 'Sentar e ouvir', punish: 'Um mês de castigo', ignore: 'Criança é assim mesmo' },
      r: {
        talk: 'Havia algo errado na escola. {npc} agradece pela escuta.',
        punish: '{npc} cumpriu o castigo e bateu muitas portas.',
        ignore: '{npc} se pergunta se você se importa.',
      },
    },
    child_college: {
      title: 'Aprovação!',
      text: '{npc} passou na faculdade. As mensalidades são caras.',
      c: { pay: 'Pagar tudo', half: 'Pagar metade', own_way: 'Que encontre seu próprio caminho' },
      r: {
        pay: '{npc} chorou e prometeu dar orgulho a você.',
        half: '{npc} vai pegar um crédito para o resto, mas agradece.',
        own_way: '{npc} entendeu, mas serão anos difíceis.',
      },
    },
    lottery_scratch: {
      title: 'Raspadinha da sorte',
      text: 'Uma raspadinha que veio num cartão de aniversário estava premiada!',
    },
    noisy_neighbors: {
      title: 'Festa ao lado',
      text: 'A nova vizinhança faz festas barulhentas todas as noites.',
      c: { complain: 'Bater e reclamar', join: 'Se não pode vencê-los…', earplugs: 'Comprar protetores de ouvido' },
      r: {
        complain_ok: 'Pediram desculpas e baixaram o som. A paz voltou.',
        complain_fail: 'Aumentaram o som. Guerra fria declarada.',
        join: 'Gente ótima, música péssima. Você dormiu até o meio-dia.',
        earplugs: 'Você dorme. Quase sempre.',
      },
    },
    retirement_offer: {
      title: 'Mais um ano?',
      text: 'As pessoas do trabalho perguntam se este será seu último ano.',
      c: { retire: 'Sim, hora de se aposentar', continue: 'Ainda não' },
      r: {
        retire: 'Uma festa, um bolo, um cartão assinado por todos. Começa um novo capítulo.',
        continue: 'Você ainda tem muito a oferecer. Todos gostaram de saber que você fica.',
      },
    },
    blackout: {
      title: 'Apagão',
      text: 'Um apagão na cidade inteira. Você passou a noite jogando cartas à luz de velas com a vizinhança.',
    },
    record_surfaces: {
      title: 'Um registro antigo',
      text: 'Numa checagem de antecedentes para uma nova oportunidade, aparece a ocorrência do chocolate da sua adolescência.',
      c: { explain: 'Explicar com honestidade', hide: 'Dizer que deve ser um engano' },
      r: {
        explain_ok: 'Valorizaram sua honestidade. Afinal, foi há muito tempo.',
        explain_fail: 'Foram educados, mas a dúvida ficou no ar.',
        hide_ok: 'Ninguém foi a fundo.',
        hide_fail: 'Verificaram. A mentira descoberta foi muito pior que o chocolate.',
      },
    },
    old_secret: {
      title: 'A mercearia da esquina',
      text: 'A mercearia de onde você pegou um chocolate sem pagar vai fechar depois de quarenta anos.',
      c: { pay_back: 'Deixar um envelope com dinheiro e um bilhete', souvenir: 'Comprar algo no último dia', walk_by: 'Passar reto' },
      r: {
        pay_back: 'Você nunca soube se o dono leu o bilhete. Mesmo assim, ficou mais leve.',
        souvenir: 'Você comprou um chocolate, e desta vez pagou.',
        walk_by: 'A placa antiga foi retirada uma semana depois.',
      },
    },
    parent_advice: {
      title: 'Só porque sim',
      text: '{npc} ligou só para dizer o orgulho que sente de você.',
    },
    friend_moves_away: {
      title: 'De mudança',
      text: '{npc} vai se mudar para outra cidade de vez.',
      c: { promise: 'Prometer manter contato', party: 'Fazer uma festa de despedida', shrug: 'As pessoas vêm e vão' },
      r: {
        promise: 'Vocês marcaram uma chamada por mês. Vamos ver se dura.',
        party: 'Uma noite de histórias e abraços. {npc} partiu de coração cheio.',
        shrug: '{npc} percebeu o quanto você parecia não se importar.',
      },
    },
    relocation_offer: {
      title: 'Cargo maior, bem longe',
      text: 'Sua empresa oferece uma promoção, mas isso significa mudar de cidade.',
      c: { accept: 'Aceitar a promoção e se mudar', decline: 'Ficar perto de quem você ama' },
      r: {
        accept: 'Cidade nova, cargo novo. Você sente mais falta das pessoas do que esperava.',
        decline: 'A chefia respeitou a escolha. A família ficou aliviada.',
      },
    },
    bad_flu: {
      title: 'Nocaute',
      text: 'Uma gripe forte deixou você de cama por duas semanas.',
    },
    hobby_spotlight: {
      title: 'Talento reconhecido',
      text: 'Anos de prática valeram a pena: um clube local convidou você para mostrar seu trabalho.',
    },

    // ── Terceira idade ──────────────────────────────────────────────────────
    retirement_hobby: {
      title: 'Fins de semana sem fim',
      text: 'Na aposentadoria, todos os dias são seus. Como você vai aproveitá-los?',
      c: { garden: 'Começar uma horta', travel: 'Viajar', volunteer: 'Fazer voluntariado no bairro' },
      r: {
        garden: 'Seus tomates são a inveja da rua.',
        travel: 'Lugares que você só conhecia por cartões-postais, finalmente ao vivo.',
        volunteer: 'Agora a vizinhança conhece você pelo nome.',
      },
    },
    grandkid_visit: {
      title: 'Os netos vêm aí',
      text: 'Seus netos vão passar o fim de semana com você.',
      c: { teach: 'Ensinar algo que você ama', spoil: 'Mimar sem limites', nap: 'Deixar a TV ligada e tirar um cochilo' },
      r: {
        teach: 'Eles vão lembrar deste fim de semana por muito tempo.',
        spoil: 'Sorvete no café da manhã. Os pais não adoraram.',
        nap: 'Todo mundo ficou feliz, principalmente você.',
      },
    },
    scam_call: {
      title: 'Ligação urgente do “seu banco”',
      text: 'Alguém liga dizendo que sua conta corre perigo e pede seu código de segurança.',
      c: { give: 'Passar o código', hang_up: 'Desligar', call_family: 'Ligar para a família para conferir' },
      r: {
        give: 'Era golpe. Uma parte das suas economias sumiu.',
        hang_up: 'Você desligou. O banco de verdade confirmou depois que era golpe.',
        call_family: 'A família ajudou você a denunciar o golpe e ficou uma hora ao telefone.',
      },
    },
    memoir: {
      title: 'Sua história',
      text: 'Você viveu muito. Talvez seja hora de pôr tudo no papel.',
      c: { write: 'Escrever um livro de memórias', record: 'Gravar histórias para a família', no: 'Algumas coisas é melhor não escrever' },
      r: {
        write: 'Página após página, a vida voltou à sua memória.',
        record: 'A família agora tem horas de histórias na sua voz.',
        no: 'Você guarda suas memórias para si.',
      },
    },
    memoir_published: {
      title: 'Uma editora liga',
      text: 'Uma pequena editora leu seu manuscrito e adorou.',
      c: { publish: 'Publicar', family_only: 'Imprimir cópias só para a família' },
      r: {
        publish: 'Seu livro está na estante da livraria do bairro. Pedem seu autógrafo.',
        family_only: 'Cada pessoa da família ganhou uma cópia encadernada. É o livro mais precioso da casa.',
      },
    },
    fall_injury: {
      title: 'Uma queda feia',
      text: 'Você escorregou na escada. Nesta idade, a recuperação é lenta.',
    },
    old_friend_letter: {
      title: 'Uma carta',
      text: 'Chega uma carta escrita à mão por {npc}. Ela começa assim: “Lembra da mesa do recreio?”',
      c: { visit: 'Viajar para visitar {npc}', reply: 'Escrever uma longa resposta', keep: 'Guardar a carta por perto' },
      r: {
        visit: 'Vocês passaram uma tarde numa varanda, crianças de novo por algumas horas.',
        reply: 'Você escreveu dez páginas. {npc} respondeu com doze.',
        keep: 'Você relê a carta a cada poucos dias.',
      },
    },
    mentor_young: {
      title: 'Passando adiante',
      text: 'Alguém jovem do bairro não sabe que caminho seguir. Você lembra de quem um dia ajudou você.',
      c: { mentor: 'Oferecer mentoria', advice: 'Dar um conselho', busy: 'Falta energia para isso agora' },
      r: {
        mentor: 'Conversas semanais, progresso lento, gratidão verdadeira. O ciclo se fecha.',
        advice: 'Uma frase sua ficou na cabeça daquela pessoa por anos.',
        busy: 'Talvez outra pessoa ajude.',
      },
    },
    downsizing: {
      title: 'Casa grande demais',
      text: 'A casa parece enorme, e a escada, íngreme.',
      c: { sell: 'Vender e ir para um lugar menor', stay: 'Ficar com as memórias' },
      r: {
        sell: 'Você vendeu a casa e foi para um lugar pequeno e aconchegante. O dinheiro é bem-vindo.',
        stay: 'Cada cômodo guarda uma história. Você fica.',
      },
    },
    tech_class: {
      title: 'Celular para iniciantes',
      text: 'A biblioteca oferece um curso gratuito: “Celular para iniciantes”.',
      c: { enroll: 'Inscrever-se', refuse: 'Você se virou muito bem sem isso' },
      r: {
        enroll: 'Agora você faz chamadas de vídeo. E manda emojis demais.',
        refuse: 'Os netos vão continuar imprimindo fotos para você.',
      },
    },
    centenarian_party: {
      title: 'Cem anos',
      text: 'Seu centésimo aniversário! O jornal local mandou um fotógrafo.',
    },
    pet_old_age: {
      title: 'Focinho grisalho',
      text: '{npc} envelheceu e perdeu o ritmo, mas ainda espera por você na porta todos os dias.',
      c: { beach: 'Dar a {npc} um último dia perfeito', vet: 'Pagar um tratamento para ganhar mais tempo' },
      r: {
        beach: 'Um dia na praia, uma linguiça inteira, uma longa soneca ao sol. {npc} partiu em paz naquela noite.',
        vet: 'O tratamento deu a {npc} mais dias bons.',
      },
    },
    pet_goodbye: {
      title: 'Adeus, companhia fiel',
      text: '{npc} partiu em paz, no seu cantinho favorito.',
    },
    time_capsule_open: {
      title: 'Vinte anos depois',
      text: 'Sua antiga turma se reúne para desenterrar a cápsula do tempo. Lá dentro, entre desenhos desbotados, você encontra {item}.',
      c: { dream_lived: 'Perceber que você realizou o sonho', laugh: 'Rir do seu eu mais novo', new_dream: 'Deixar que isso inspire um novo sonho' },
      r: {
        dream_lived: 'Seu eu criança sentiria muito orgulho. Você segurou aquilo sorrindo por uma hora.',
        laugh: 'Você e a turma riram até chorar.',
        new_dream: 'Isso lembrou você de que nunca é tarde para querer algo novo.',
      },
    },
    neighbor_legacy: {
      title: 'Uma carta do passado',
      text: 'Chega a notícia de que {npc}, que você ajudou na infância, faleceu. Deixou para você um piano antigo e um bilhete: “Para a criança de bom coração.”',
      c: { keep: 'Ficar com o piano', sell: 'Vender o piano', donate: 'Doar para a escola' },
      r: {
        keep: 'Você toca mal e com frequência. Parece uma conversa.',
        sell: 'O dinheiro ajuda. Você guardou o bilhete.',
        donate: 'A escola deu à sala de música o nome de {npc}.',
      },
    },
    sunset_walk: {
      title: 'Caminhada ao entardecer',
      text: 'Você fez uma caminhada lenta ao pôr do sol e reparou em tudo: pássaros, crianças, cheiro de chuva.',
    },
    old_photos: {
      title: 'Fotos antigas',
      text: 'Revendo fotos antigas, você encontrou uma sua com sua amizade de infância, na mesa do recreio.',
    },
  },
} as const;
