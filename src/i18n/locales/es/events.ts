// Textos de los eventos en español. Redacción neutra: se habla de "tú" y a
// las demás personas se las nombra ({npc}).
export default {
  ev: {
    // ── Infancia ────────────────────────────────────────────────────────────
    first_word: {
      title: 'Primera palabra',
      text: 'Tu primera palabra fue {word}. Tu familia contará este momento durante años.',
    },
    first_steps: {
      title: 'Primeros pasos',
      text: 'Diste tus primeros pasos tambaleantes, directo contra la mesita del salón. Solo el orgullo de la mesita salió herido.',
    },
    toddler_tantrum: {
      title: 'El pasillo de los dulces',
      text: 'En el supermercado, una pared de golosinas está justo a la altura de tus ojos. Te está llamando.',
      c: { scream: 'Gritar hasta que alguien ceda', ask: 'Señalar y decir «por favor»', sneak: 'Meter una bolsa en el carrito sin que te vean' },
      r: {
        scream: 'Conseguiste las golosinas y las miradas de todo el supermercado. A tu familia no le hizo gracia.',
        ask: 'Tu familia quedó tan encantada con tus modales que te ganaste un caprichito.',
        sneak_ok: 'Nadie se dio cuenta hasta la caja, y para entonces era tarde para discutir.',
        sneak_fail: 'La bolsa se cayó en la caja. Te pillaron en el acto, y una semana sin golosinas.',
      },
    },
    imaginary_friend: {
      title: 'El Capitán Fideo',
      text: 'Inventaste una amistad imaginaria llamada Capitán Fideo, que exige un sitio en la mesa a la hora de cenar.',
      c: { keep: 'Mantener al Capitán cerca', introduce: 'Presentar al Capitán a tu familia', let_go: 'Despedirte del Capitán' },
      r: {
        keep: 'Tú y el Capitán Fideo dibujaron mapas de mundos imaginarios durante meses.',
        introduce: 'Tu familia puso un plato más. Fue la cena más divertida en semanas.',
        let_go: 'Decidiste que ya era hora de crecer. El Capitán hizo un saludo militar y desapareció.',
      },
    },
    first_day_school: {
      title: 'Primer día de escuela',
      text: 'El aula es enorme y ruidosa, llena de niños y niñas que nunca has visto.',
      c: { cling: 'Aferrarte a tu familia', stranger: 'Sentarte junto a alguien que también parece tener miedo', explore: 'Inspeccionar cada estante y cajón' },
      r: {
        cling: 'A la maestra le costó convencerte para entrar. Superaste el día, a duras penas.',
        stranger: 'A la hora del recreo ya eran inseparables. ¡Tu primera amistad de la escuela!',
        explore: 'Encontraste el hámster de la clase, los materiales de arte y el bote secreto de galletas de la maestra.',
      },
    },
    new_kid: {
      title: 'Alguien nuevo en clase',
      text: 'Una criatura nueva, {npc}, come sola cada día fingiendo leer la misma página.',
      c: { invite: 'Invitar a {npc} a sentarse contigo', wave: 'Saludar con la mano', ignore: 'Ocuparte de tus cosas', tease: 'Unirte a las burlas de los demás' },
      r: {
        invite: '{npc} se iluminó. Al final de la semana intercambiaban meriendas y secretos. Empezó una amistad.',
        wave: '{npc} devolvió el saludo con timidez. Quizá algún día hablen.',
        ignore: 'Comiste tu almuerzo. {npc} siguió leyendo la misma página.',
        tease: 'Los demás se rieron. {npc}, no. Es de esas cosas que la gente recuerda.',
      },
    },
    lost_tooth: {
      title: 'Diente flojo',
      text: 'Tu primer diente de leche se quedó en una manzana. A la mañana siguiente había una moneda brillante bajo la almohada.',
    },
    science_fair: {
      title: 'La feria de ciencias',
      text: 'La feria de ciencias de la escuela es dentro de tres semanas. Todo el mundo habla de volcanes.',
      c: { work_hard: 'Pasar cada fin de semana en un proyecto original', kit: 'Pedir a tu familia un kit prefabricado', parent: 'Dejar que una persona adulta «ayude» (lo haga)' },
      r: {
        work_hard_ok: 'Tu filtro de agua casero ganó el primer premio. Hasta el periódico local publicó una foto.',
        work_hard_fail: 'Tu proyecto se derrumbó una hora antes de la evaluación. Aun así, aprendiste mucho.',
        kit: 'El volcán del kit entró en erupción a su hora. Sólido, aunque poco original.',
        parent: 'El proyecto parecía sospechosamente profesional. La maestra arqueó una ceja.',
      },
    },
    stray_puppy: {
      title: 'Una sombra de cuatro patas',
      text: 'Un cachorro desaliñado te siguió desde la escuela y ahora está en la puerta, moviendo la cola.',
      c: { adopt: 'Suplicar para quedártelo', shelter: 'Llevarlo a un refugio', shoo: 'Espantarlo' },
      r: {
        adopt: 'Tras una larga reunión familiar, la respuesta fue sí. El cachorro se llama {npc}.',
        shelter: 'El personal del refugio te dio las gracias. Volviste dos veces para comprobar que lo adoptaran.',
        shoo: 'El cachorro acabó yéndose. Pensaste en él durante días.',
      },
    },
    dream_job: {
      title: 'Cuando sea mayor',
      text: 'La maestra pide a la clase que dibuje lo que quiere ser en el futuro.',
      c: { doctor: 'Salvar vidas en la medicina', artist: 'Hacer arte y tener fama mundial', inventor: 'Inventar robots', teacher: 'Dar clases, como la maestra' },
      r: {
        doctor: 'Te dibujaste con bata blanca, curando a un oso de peluche gigante.',
        artist: 'Te dibujaste en una galería llena de tus propios cuadros.',
        inventor: 'Dibujaste un robot que hace los deberes. La maestra se rio y lo colgó en la pared.',
        teacher: 'A la maestra le emocionó y colgó el dibujo sobre la pizarra.',
      },
    },
    time_capsule: {
      title: 'La cápsula del tiempo',
      text: 'Tu clase va a enterrar una cápsula del tiempo en el patio, para abrirla dentro de veinte años.',
      c: { letter: 'Escribir una carta a tu yo del futuro', toy: 'Poner tu juguete favorito', skip: 'Quedarte con tus cosas' },
      r: {
        letter: 'Escribiste sobre tus sueños y cerraste el sobre. Tu yo del futuro tendrá que estar a la altura.',
        toy: 'Dolió desprenderse de él, pero se sintió importante.',
        skip: 'Viste a los demás enterrar sus tesoros y guardaste los tuyos en el bolsillo.',
      },
    },
    neighbor_groceries: {
      title: 'Bolsas pesadas',
      text: 'Quien vive en la casa de al lado, {npc}, es de edad avanzada y le cuesta subir la escalera con bolsas pesadas.',
      c: { help: 'Llevar las bolsas', pretend: 'Hacer como que no lo ves', charge: 'Ofrecerte a llevarlas a cambio de una moneda' },
      r: {
        help: '{npc} te lo agradeció con limonada e historias de otros tiempos. Se volvió una visita semanal.',
        pretend: 'Miraste tus zapatos. {npc} subió como pudo.',
        charge: '{npc} se rio, te pagó y predijo que tendrías futuro en los negocios.',
      },
    },
    broken_window: {
      title: '¡Crash!',
      text: 'Tu pelota acaba de atravesar la ventana de la casa vecina. Nadie vio quién la pateó.',
      c: { confess: 'Llamar a la puerta y confesar', run: '¡Correr!', blame: 'Decir que fue tu hermano o tu hermana' },
      r: {
        confess: 'En la casa vecina agradecieron la sinceridad. Hiciste tareas para pagar el cristal.',
        run_ok: 'Te escapaste sin que nadie te viera. El corazón te latió fuerte durante horas.',
        run_fail: 'Reconocieron tu pelota. Tu familia se enteró, y huir lo empeoró todo.',
        blame: 'Quien cargó con la culpa pasó una semana de castigo y no lo ha olvidado.',
      },
    },
    bully: {
      title: 'El peaje del almuerzo',
      text: 'Alguien más grande te cierra el paso y exige el dinero de tu almuerzo.',
      c: { stand_up: 'No ceder', tell: 'Decírselo a la maestra', avoid: 'Ir por otro camino desde ahora', befriend: 'Preguntar por qué lo hace' },
      r: {
        stand_up_ok: 'Se echó atrás delante de todo el mundo. Nadie volvió a molestarte.',
        stand_up_fail: 'Acabaste contra las taquillas de un empujón. Aun así, todos vieron que no cediste.',
        tell: 'La maestra lo resolvió con discreción. Hubo quien te acusó de chivarte, pero el acoso terminó.',
        avoid: 'El camino largo sumaba diez minutos al día, pero funcionó.',
        befriend_ok: 'Resulta que tenía hambre. Compartiste tu almuerzo y nació una amistad inesperada.',
        befriend_fail: 'Se rio y se llevó el dinero igualmente.',
      },
    },
    school_play: {
      title: 'La obra escolar',
      text: 'Las audiciones para la obra de la escuela son esta semana. El papel protagonista es un dragón que habla.',
      c: { audition: 'Presentarte para el dragón', backstage: 'Pintar los decorados', skip: 'No es lo tuyo' },
      r: {
        audition_ok: 'Te dieron el papel y rugiste hasta convertirte en leyenda escolar.',
        audition_fail: 'Te quedaste en blanco en la primera frase. Te tocó el papel de «Árbol n.º 3».',
        backstage: 'Tu castillo pintado se llevó su propio aplauso.',
        skip: 'Lo viste desde el público y aplaudiste a tus amistades.',
      },
    },
    chickenpox: {
      title: 'Granitos por todas partes',
      text: '¡Varicela! Una semana de picor, baños de avena y dibujos animados.',
    },
    found_wallet: {
      title: 'Una cartera en la acera',
      text: 'Encuentras una cartera en la acera con un documento de identidad y algo de dinero.',
      c: { return: 'Devolverla a la dirección del documento', keep: 'Quedarte el dinero y tirar la cartera', leave: 'Dejarla donde está' },
      r: {
        return: 'La dueña casi lloró. La fama de tu honestidad recorrió el barrio.',
        keep: 'El dinero desapareció en una semana. La culpa duró más.',
        leave: 'Seguiste caminando. Que se encargue otra persona.',
      },
    },
    grandparent_recipe: {
      title: 'La receta secreta',
      text: '{npc} se ofrece a enseñarte la receta familiar que nunca había confiado a nadie.',
      c: { learn: 'Arremangarte', later: 'Quizá otro día' },
      r: {
        learn: 'Harina por todas partes, risas por todas partes. Ahora guardas un pedazo de la historia familiar.',
        later: '{npc} sonrió, pero se notó un poco de decepción.',
      },
    },
    spelling_bee: {
      title: 'Concurso de ortografía',
      text: 'Tu clase te eligió para el concurso de ortografía.',
      c: { practice: 'Practicar cada noche', wing_it: 'Confiar en tu instinto', skip: 'Dejar que vaya otra persona' },
      r: {
        practice_ok: 'Deletreaste «otorrinolaringología» sin pestañear y te llevaste el trofeo.',
        practice_fail: 'Caíste en «excepción». Aun así, tanta práctica se notó en clase.',
        wing_it_ok: 'Solo con instinto llegaste a la ronda final. ¡Impresionante!',
        wing_it_fail: 'Quedaste fuera en la primera ronda. Con la palabra «casa». Con K.',
        skip: 'Fue otra persona. Animaste desde el público.',
      },
    },
    parent_job_loss: {
      title: 'Tiempos difíciles',
      text: '{npc} perdió su empleo. La casa está más silenciosa y las personas adultas cuchichean sobre facturas.',
      c: { savings: 'Ofrecer tu hucha', cheer: 'Hacer una tarjeta para animar', quiet: 'No estorbar' },
      r: {
        savings: '{npc} te abrazó largo rato y no aceptó ni una moneda. Bueno, quizá algunas.',
        cheer: 'Tu tarjeta estuvo en la nevera durante años.',
        quiet: 'Te quedaste en tu cuarto. La casa se sintió pesada durante meses.',
      },
    },
    summer_camp: {
      title: 'Campamento de verano',
      text: 'Tu familia puede enviarte a un campamento este año. ¿Cuál?',
      c: { sports: 'Campamento deportivo', science: 'Campamento de ciencias', music: 'Campamento de música', home: 'Quedarte en casa este verano' },
      r: {
        sports: 'Tres semanas de correr, nadar y quemaduras de sol. Volviste con más fuerza.',
        science: 'Construiste un cohete que de verdad voló. Casi siempre de lado, pero voló.',
        music: 'Aprendiste tus primeras canciones de verdad junto a la fogata.',
        home: 'Un verano tranquilo de pícnics familiares y tardes largas.',
      },
    },
    new_sibling: {
      title: 'Una nueva llegada',
      text: 'La familia creció: te presentamos a {npc}, el bebé más nuevo de la casa. Dormir será un lujo durante un tiempo.',
    },
    sleepover: {
      title: 'Pijamada',
      text: '{npc} te invita a una pijamada este fin de semana.',
      c: { go: 'Preparar el saco de dormir', host: 'Proponer hacerla en tu casa', decline: 'Quedarte en casa' },
      r: {
        go: 'Fuertes de almohadas, historias de fantasmas y cero horas de sueño. Perfecto.',
        host: 'Tu familia preparó tortitas por la mañana. {npc} todavía habla de ellas.',
        decline: 'A {npc} pareció dolerle un poco.',
      },
    },
    museum_trip: {
      title: 'Excursión',
      text: 'En una excursión al museo de historia natural, te quedaste bajo un esqueleto de dinosaurio y olvidaste respirar.',
    },
    learn_bike: {
      title: 'Dos ruedas',
      text: 'Tras muchas rodillas raspadas, por fin montaste en bicicleta sin ayuda. ¡Libertad!',
    },

    // ── Adolescencia ────────────────────────────────────────────────────────
    first_phone: {
      title: 'Tu primer teléfono',
      text: 'Por fin tienes tu propio teléfono. El mundo entero cabe en tu bolsillo.',
      c: { all_in: 'Unirte a todas las apps y grupos', balanced: 'Poner algunos límites', decline: 'Usarlo solo para llamadas' },
      r: {
        all_in: 'Ahora te enteras de todo, y siempre tienes un poco de sueño.',
        balanced: 'Notificaciones apagadas después de las nueve. Tu sueño lo agradece.',
        decline: 'Te perdiste algunos chistes, pero leíste tres novelas.',
      },
    },
    exam_cheat: {
      title: 'Las respuestas',
      text: 'Alguien de clase te susurra que las respuestas del examen están circulando y te ofrece una copia.',
      c: { cheat: 'Aceptar la copia', study: 'Estudiar toda la noche', report: 'Avisar a la profesora' },
      r: {
        cheat_ok: 'Sacaste la nota máxima. Nadie se enteró, pero la nota sabe a poco.',
        cheat_fail: 'La profesora había cambiado las preguntas. Te descubrieron y llamaron a tu familia.',
        study: 'Llegaste al examen sin haber dormido, pero sabiéndolo todo.',
        report: 'El examen se rehízo. Parte de la clase se enfadó contigo; el profesorado, no.',
      },
    },
    house_party: {
      title: 'La fiesta en casa',
      text: 'Los padres de alguien se fueron el fin de semana, y todo el curso está invitado.',
      c: { wild: 'Ir y quedarte hasta el final', early: 'Ir, pero salir pronto', stay: 'Quedarte en casa' },
      r: {
        wild_ok: 'Una noche legendaria. Volviste antes de que nadie se diera cuenta.',
        wild_fail: 'Los vecinos llamaron a la policía. Tu familia fue a buscarte. El silencio en el coche fue atronador.',
        early: 'Viviste la mejor parte y dormiste en tu cama.',
        stay: 'El lunes te lo contaron todo. Sonaba increíble y terrible a la vez.',
      },
    },
    dare_shoplift: {
      title: 'El reto',
      text: 'Tus amistades te retan a llevarte una chocolatina de la tienda de la esquina sin pagar. Te están mirando.',
      c: { do_it: 'Hacerlo', refuse: 'Negarte', pay: 'Pagarla a escondidas y fingir' },
      r: {
        do_it_ok: 'Saliste con la chocolatina y el corazón desbocado. El grupo lo celebró. Te quedó una sensación rara.',
        do_it_fail: 'El dueño te atrapó en la puerta, llamó a tu familia y presentó una denuncia.',
        refuse: 'El grupo dijo que no tenías gracia. Algunas personas lo respetaron después.',
        pay: 'El grupo nunca lo supo. Conservaste la conciencia tranquila y la reputación.',
      },
    },
    start_band: {
      title: 'Banda de garaje',
      text: 'Unas amistades están formando una banda en un garaje y necesitan a una persona más.',
      c: { join: 'Tomar un instrumento y unirte', manage: 'Ocuparte de la gestión de la banda', decline: 'No es para ti' },
      r: {
        join: 'Tocas fatal. Todo el mundo toca fatal. Es lo mejor del mundo.',
        manage: 'Diseñaste carteles y reservaste el primer local de ensayo.',
        decline: 'Oías los ensayos a tres calles de distancia. Menos mal que dijiste que no.',
      },
    },
    band_gig: {
      title: 'El primer concierto',
      text: 'La banda consiguió su primer concierto de verdad: un viernes por la noche en un café del barrio.',
      c: { originals: 'Tocar canciones propias', covers: 'Tocar éxitos seguros', quit: 'Dejar la banda antes del concierto' },
      r: {
        originals_ok: 'El dueño del café los volvió a llamar. Alguien del público tarareaba el estribillo.',
        originals_fail: 'Acoples, una cuerda rota y medio público se fue. Rock and roll.',
        covers: 'Todo el mundo cantó. No fue arte, pero fue muy divertido.',
        quit: 'Te fuiste. La banda tocó sin ti y, sinceramente, le fue bien.',
      },
    },
    band_reunion: {
      title: 'La llamada del reencuentro',
      text: 'Alguien de tu antigua banda llama: un promotor quiere a la banda de tu adolescencia en un festival nostálgico.',
      c: { reunite: 'Volver a juntar la banda', pitch: 'Presentar las canciones nuevas que has compuesto', decline: 'Dejar el pasado en el pasado' },
      r: {
        reunite: 'Con más años, más lentitud y más volumen. Al público le encantó, y a ti también.',
        pitch_ok: '¡Una discográfica escuchó el material nuevo y te ofreció un contrato!',
        pitch_fail: 'La discográfica no se interesó. El festival fue genial de todos modos.',
        decline: 'Esa noche escuchaste una grabación antigua y sonreíste.',
      },
    },
    part_time_offer: {
      title: 'Trabajo de fin de semana',
      text: 'Los negocios del barrio contratan adolescentes para los fines de semana.',
      c: { shop: 'Trabajar en la tienda de la esquina', kitchen: 'Trabajar en la cocina de un café', decline: 'Mantener libres los fines de semana' },
      r: {
        shop: 'Aprendiste a contar el cambio rápido y a sonreír a clientes gruñones.',
        kitchen: 'Calor, ruido y caos. Te gusta más de lo que esperabas.',
        decline: 'Los fines de semana siguen siendo tuyos, por ahora.',
      },
    },
    friend_in_trouble: {
      title: 'Una amistad en apuros',
      text: 'La familia de {npc} está perdiendo su casa. En voz baja, {npc} pregunta si podría quedarse contigo unas semanas.',
      c: { host: 'Pedir a tu familia que acoja a {npc}', lend: 'Dar a {npc} la mitad de tus ahorros', adult: 'Contárselo a una persona adulta de confianza que pueda ayudar', refuse: 'Decir que no puedes ayudar' },
      r: {
        host: 'Fue un poco apretado y tu familia refunfuñó, pero {npc} nunca lo olvidará.',
        lend: '{npc} protestó y luego aceptó con lágrimas en los ojos.',
        adult: 'La orientación escolar encontró apoyo para la familia. {npc} te dio las gracias, con algo de vergüenza.',
        refuse: '{npc} dijo que lo entendía. Las cosas nunca volvieron a ser igual.',
      },
    },
    scholarship_competition: {
      title: 'El examen de la beca',
      text: 'Una fundación ofrece becas universitarias a los mejores jóvenes de ciencias. El examen es el mes que viene.',
      c: { prepare: 'Prepararte como si tu futuro dependiera de ello', relaxed: 'Presentarte sin mucha preparación', skip: 'No presentarte' },
      r: {
        prepare_ok: '¡Ganaste! La mayor parte de tu matrícula universitaria estará cubierta.',
        prepare_fail: 'Te quedaste a unos puntos del corte. Aun así, tanto estudio afiló tu mente.',
        relaxed_ok: 'Contra todo pronóstico, ganaste una beca parcial.',
        relaxed_fail: 'No te clasificaste. Quizá deberías haberte preparado.',
        skip: 'Dedicaste ese mes a otras cosas.',
      },
    },
    driving_lesson: {
      title: 'Aparcamiento vacío',
      text: '{npc} se ofrece a enseñarte a conducir en un aparcamiento vacío el domingo por la mañana.',
      c: { careful: 'Ir con calma y escuchar', fast: 'Lucirte un poco', later: 'Quizá el año que viene' },
      r: {
        careful: 'Espejos, intermitentes, paciencia. Llegarás al examen con buena preparación.',
        fast_ok: 'Hiciste un giro perfecto y {npc} soltó una carcajada.',
        fast_fail: 'Conociste a una farola. Con suavidad. {npc} no dijo nada en todo el camino a casa.',
        later: 'Las llaves del coche se quedaron colgadas.',
      },
    },
    sports_tryout: {
      title: 'Pruebas del equipo',
      text: 'Las pruebas para el equipo de la escuela son esta tarde.',
      c: { tryout: 'Darlo todo', cheer: 'Animar desde las gradas', skip: 'Irte a casa a leer' },
      r: {
        tryout_ok: '¡Entraste en el equipo! Los entrenamientos son duros y te encantan.',
        tryout_fail: 'Esta vez no fue posible. El entrenador te dijo que volvieras el año que viene.',
        cheer: 'Tu voz fue la más fuerte de las gradas.',
        skip: 'Terminaste un gran libro.',
      },
    },
    dropout_temptation: {
      title: '¿Para qué?',
      text: 'La escuela parece inútil. Una prima dice que hay trabajo en un almacén, pagado en efectivo, ahora mismo.',
      c: { drop: 'Dejar la escuela y aceptar el trabajo', stay: 'Apretar los dientes y quedarte', counselor: 'Hablar con la orientación escolar' },
      r: {
        drop: 'Saliste de la escuela por última vez. El sueldo es real. La preocupación en casa, también.',
        stay: 'Es difícil, pero sigues ahí.',
        counselor: 'La orientación te ayudó a armar un plan. La escuela parece un poco menos inútil.',
      },
    },
    picture_day: {
      title: 'Día de la foto',
      text: 'Un grano gigante eligió el día de la foto de clase para aparecer. El anuario lo conservará para siempre.',
    },
    volunteer_shelter: {
      title: 'Devolver algo',
      text: 'La escuela pide al alumnado que haga voluntariado algunos fines de semana.',
      c: { animals: 'Ayudar en el refugio de animales', food_bank: 'Clasificar donaciones en el banco de alimentos', busy: 'Ahora no hay tiempo' },
      r: {
        animals: 'Paseaste perros y limpiaste jaulas, y volviste a casa con pelos por todas partes y el corazón contento.',
        food_bank: 'Clasificaste toneladas de comida y conociste gente de toda la ciudad.',
        busy: 'Quizá la próxima vez.',
      },
    },
    viral_video: {
      title: 'Viral',
      text: 'Un vídeo tuyo bailando fatal en una fiesta familiar se volvió viral de la noche a la mañana.',
      c: { lean_in: 'Aprovecharlo y publicar más', delete: 'Pedir que lo retiren', laugh: 'Reírte también' },
      r: {
        lean_in_ok: 'Los siguientes vídeos fueron un éxito. Una marca local hasta te envió un pequeño pago.',
        lean_in_fail: 'Internet se volvió en tu contra. Los comentarios fueron crueles.',
        delete: 'Tardó semanas, pero el vídeo desapareció.',
        laugh: 'Lo asumiste con humor. La gente te apreció aún más.',
      },
    },
    career_fair: {
      title: 'Feria de profesiones',
      text: 'El gimnasio de la escuela está lleno de puestos de empresas y universidades.',
      c: { tech: 'El puesto de tecnología', health: 'El puesto del hospital', trades: 'El puesto de electricistas', people: 'El puesto de derecho y docencia' },
      r: {
        tech: 'Pasaste una hora jugando con un brazo robótico. Algo hizo clic.',
        health: 'Una enfermera contó historias que te acompañaron durante semanas.',
        trades: 'Conectaste una bombilla sin ayuda y sentiste que tenías poderes mágicos.',
        people: 'Una jueza y un profesor discutieron quién tiene el trabajo más difícil. Te fascinó.',
      },
    },
    talent_show: {
      title: 'Concurso de talentos',
      text: 'El concurso de talentos de la escuela necesita números. Las inscripciones cierran hoy.',
      c: { sing: 'Cantar una canción', comedy: 'Hacer un monólogo de humor', watch: 'Mirar desde el público' },
      r: {
        sing_ok: 'Se te quebró la voz una vez y a nadie le importó. Ovación de pie.',
        sing_fail: 'Olvidaste la segunda estrofa y la tarareaste. El público la tarareó contigo, con cariño.',
        comedy_ok: 'El gimnasio estalló en carcajadas. Hasta la dirección se rio.',
        comedy_fail: 'Grillos. Una tos. Algún día te reirás de esto.',
        watch: 'Aplaudiste cada número, incluso a quien tocó las cucharas.',
      },
    },
    grandparent_story: {
      title: 'Historias antiguas',
      text: '{npc} pasó una noche contándote historias de su juventud. Te diste cuenta de lo mucho que no sabías.',
    },

    // ── Vida adulta ─────────────────────────────────────────────────────────
    after_school: {
      title: '¿Y ahora qué?',
      text: 'La escuela terminó. El futuro está completamente abierto, lo cual emociona y asusta.',
      c: { study: 'Centrarte en seguir estudiando', work: 'Centrarte en encontrar trabajo', gap: 'Tomarte un año sabático para viajar', slow: 'Ir con calma, día a día' },
      r: {
        study: 'Empezaste a leer catálogos de cursos. (La matrícula está en la pestaña Estudios y trabajo.)',
        work: 'Puliste tu currículum. Las empresas notarán ese empuje durante los próximos años.',
        gap: 'Albergues, trenes y nuevas amistades. Volviste con historias y una mirada más amplia.',
        slow: 'Sin prisa. Ya lo irás descubriendo.',
      },
    },
    roommate: {
      title: 'El asunto del piso compartido',
      text: 'Quien comparte piso contigo deja platos sucios por todas partes y «toma prestada» tu comida.',
      c: { confront: 'Tener una charla franca', clean: 'Limpiarlo todo por tu cuenta', chart: 'Hacer un cuadro de tareas' },
      r: {
        confront_ok: 'Fue incómodo, pero los platos empezaron a lavarse.',
        confront_fail: 'Acabó en discusión. El ambiente en el piso está tenso.',
        clean: 'Cocina limpia, resentimiento silencioso.',
        chart: 'El cuadro funcionó de verdad. Tienes un don para la organización doméstica.',
      },
    },
    campus_party: {
      title: 'Fiesta en el campus',
      text: 'Hay una fiesta enorme en el campus la noche antes de un examen importante.',
      c: { go: 'Ir a la fiesta', study: 'Estudiar', group: 'Organizar un grupo de estudio con aperitivos' },
      r: {
        go: 'Hiciste una nueva amistad y no recordaste casi nada del temario.',
        study: 'Noche tranquila, examen sólido.',
        group: 'Mitad estudio, mitad risas. Todo el grupo aprobó.',
      },
    },
    meet_cute: {
      title: 'Una chispa',
      text: 'En el cumpleaños de una amistad, siempre acabas en la misma conversación con {npc}.',
      c: { ask_out: 'Invitar a {npc} a salir', numbers: 'Intercambiar contactos como amistad', leave: 'Dejar pasar el momento' },
      r: {
        ask_out_ok: '{npc} dijo que sí antes de que terminaras la pregunta. ¡Están saliendo!',
        ask_out_fail: '{npc} sonrió con amabilidad y dijo que no. Auch.',
        numbers: 'Siguieron en contacto. Una buena amistad, al menos por ahora.',
        leave: 'Te fuiste temprano y te preguntaste qué podría haber pasado.',
      },
    },
    old_flame: {
      title: 'Un viejo amor',
      text: 'En una estación de tren te cruzas con {npc}, con quien saliste hace años, por primera vez en mucho tiempo.',
      c: { coffee: 'Tomar un café y ponerse al día', rekindle: 'Ver si todavía queda algo', nod: 'Saludar con educación y seguir' },
      r: {
        coffee: 'Dos horas volaron. Se despidieron como amistad, y se sintió bien.',
        rekindle_ok: 'Quedaba algo. Vuelven a estar juntos, con más años y más sabiduría.',
        rekindle_fail: 'No quedaba nada. Fue un poco triste y un poco liberador.',
        nod: 'Sonrieron y cada quien siguió su camino.',
      },
    },
    friend_startup: {
      title: 'La gran idea',
      text: '{npc}, tu amistad desde la infancia, está creando una empresa y te quiere en el equipo.',
      c: { join: 'Dejar tus planes y unirte', invest: 'Invertir parte de tus ahorros', advice: 'Dar consejos, nada más', decline: 'Desear suerte a {npc}' },
      r: {
        join: 'Noches largas, pizza barata, sueños enormes. Ahora trabajas en una startup.',
        invest: 'Firmaste el cheque. {npc} enmarcó una copia.',
        advice: 'Pasaste una noche bosquejando planes con {npc}. Fue como en los viejos tiempos.',
        decline: '{npc} lo entendió, pero la decepción se notaba.',
      },
    },
    startup_outcome: {
      title: 'La hora de la verdad',
      text: 'Años de trabajo después, la empresa de {npc} llega a su momento decisivo.',
      c: { push: 'Apostar por salir a bolsa', sell: 'Apoyar la venta a un competidor más grande', cash_out: 'Pedir recuperar tu inversión', stand_by: 'Simplemente estar al lado de {npc}' },
      r: {
        push_ok: 'La salida a bolsa fue un triunfo. ¡Tus acciones valen una fortuna!',
        push_fail: 'Los inversores se retiraron en el último momento. La empresa cerró y perdiste tu empleo.',
        sell: 'La venta se cerró. Un buen pago, y conservaste un empleo con la nueva dueña de la empresa.',
        cash_out_ok: 'Tu inversión dio un rendimiento excelente.',
        cash_out_fail: 'La empresa no pudo pagar. Tu inversión se perdió.',
        stand_by: 'Pasara lo que pasara con la empresa, la amistad salió más fuerte.',
      },
    },
    mentor_offer: {
      title: 'Aparece una mentoría',
      text: '{npc}, una persona veterana y respetada en el trabajo, se ofrece a guiarte.',
      c: { accept: 'Aceptar con gratitud', decline: 'Rechazar con educación', compete: 'Demostrar que no necesitas ayuda' },
      r: {
        accept: 'Los cafés semanales con {npc} te enseñan más que cualquier curso.',
        decline: '{npc} asintió. La oferta no se repitió.',
        compete: 'Trabajaste el doble para demostrar que podías hacerlo sin ayuda. Fue agotador.',
      },
    },
    mentor_farewell: {
      title: 'Discurso de despedida',
      text: '{npc} se jubila y te ha pedido que des el discurso de despedida.',
      c: { heartfelt: 'Hablar con el corazón', funny: 'Hacerlo divertido', decline: 'Decir que no se te dan bien los discursos' },
      r: {
        heartfelt_ok: 'No quedó un ojo seco en la sala. {npc} te dio un largo abrazo.',
        heartfelt_fail: 'Te emocionaste y perdiste el hilo. A {npc} le gustó igualmente.',
        funny_ok: 'La sala se partía de risa, {npc} más que nadie.',
        funny_fail: 'Un chiste cayó mal. Muy mal.',
        decline: 'A {npc} le dolió, aunque prefirió no decir nada.',
      },
    },
    shady_investment: {
      title: 'MoonPenny',
      text: 'Un conocido te ofrece entrar pronto en «MoonPenny»: a quienes entran primero les pagan quienes llegan después.',
      c: { buy_in: 'Entrar pronto', recruit: 'Entrar y reclutar a tus amistades', decline: 'Rechazarlo', report: 'Denunciarlo a las autoridades' },
      r: {
        buy_in: 'En semanas, tu dinero se multiplicó por más de dos. Dinero fácil… ¿verdad?',
        recruit: 'Tus amistades entraron y tu ganancia fue enorme. Algunas ya están haciendo preguntas.',
        decline: 'Conservaste tus ahorros. Sonaba demasiado bueno para ser verdad.',
        report: 'El esquema se desmanteló antes de crecer. Sin hacer ruido, ahorraste a mucha gente mucho dinero.',
      },
    },
    moonpenny_probe: {
      title: 'Investigación a la puerta',
      text: 'MoonPenny era una estafa piramidal. La investigación busca a quienes entraron pronto y ganaron dinero.',
      c: { cooperate: 'Cooperar y devolver las ganancias', lawyer: 'Contratar asesoría legal', deny: 'Negarlo todo', apologize: 'Devolver el dinero a las amistades que reclutaste' },
      r: {
        cooperate: 'Devolviste las ganancias. Dolió, pero el caso se cerró.',
        lawyer_ok: 'Tu defensa llegó a un acuerdo discreto.',
        lawyer_fail: 'El tribunal no quedó convencido. Multas fuertes y antecedentes penales.',
        deny_ok: 'La investigación tenía peces más gordos. Tuviste suerte.',
        deny_fail: 'Los registros lo mostraban todo. Multas enormes, antecedentes penales y reputación dañada.',
        apologize: 'Devolviste el dinero a quienes confiaron en ti. La mayoría te perdonó.',
      },
    },
    stress_habit: {
      title: 'Presión',
      text: 'Los plazos se acumulan. En un descanso, alguien del trabajo te ofrece un cigarrillo «para relajarte».',
      c: { smoke: 'Aceptarlo', run: 'Salir a correr', vent: 'Llamar a una amistad para desahogarte' },
      r: {
        smoke: 'Sí que relajó. Luego compraste un paquete. Luego otro.',
        run: 'Volviste con la camiseta empapada y la cabeza despejada. Se convirtió en costumbre.',
        vent: 'Veinte minutos quejándote con alguien que te entiende. Mejor que cualquier cigarrillo.',
      },
    },
    health_scare: {
      title: 'Una señal de alarma',
      text: 'Una tos que no se va te lleva a consulta médica. La prueba muestra señales de alarma de años de tabaco.',
      c: { quit: 'Dejarlo para siempre', cut_down: 'Reducirlo un poco', ignore: 'Ignorarlo' },
      r: {
        quit: 'Las primeras semanas fueron un infierno. No cediste.',
        cut_down: 'Menos cigarrillos. La tos sigue.',
        ignore: 'Encendiste uno de camino a casa. El cuerpo pasa factura.',
      },
    },
    recovery_milestone: {
      title: 'Respirar con calma',
      text: 'Años sin fumar. Subes escaleras sin silbidos en el pecho, y el dinero ahorrado se acumula.',
    },
    wedding_invite: {
      title: 'Reserva la fecha',
      text: '{npc} se casa y quiere de verdad que estés allí.',
      c: { attend: 'Ir y celebrar', speech: 'Ir y hacer un brindis', skip: 'Enviar una tarjeta' },
      r: {
        attend: 'Bailaste hasta que te dolieron los pies. {npc} estaba radiante.',
        speech_ok: 'Tu brindis hizo reír a toda la sala y luego llorar. Perfecto.',
        speech_fail: 'Contaste la historia equivocada. La otra familia no se rio.',
        skip: '{npc} notó tu ausencia.',
      },
    },
    car_breakdown: {
      title: 'Humo bajo el capó',
      text: 'Tu coche murió en la autopista, con humo saliendo del capó.',
      c: { repair: 'Pagar un taller', diy: 'Ver tutoriales y arreglarlo por tu cuenta', sell: 'Venderlo como chatarra' },
      r: {
        repair: 'Caro, pero funciona como nuevo.',
        diy_ok: 'Tres vídeos, dos nudillos raspados y un coche que funciona. Victoria.',
        diy_fail: 'Lo empeoraste. La factura del taller fue todavía mayor.',
        sell: 'Lo vendiste por piezas. El autobús sirve. Casi siempre.',
      },
    },
    boss_credit: {
      title: 'Mérito robado',
      text: 'En una reunión importante, tu jefatura presenta tu proyecto como si fuera propio.',
      c: { confront: 'Hablar en la reunión', let_go: 'Dejarlo pasar', document: 'Guardar registros y hablar después' },
      r: {
        confront_ok: 'Con calma, explicaste detalles que solo la autoría conocería. Todo el mundo lo notó.',
        confront_fail: 'Pareció un arrebato. Tu jefatura no lo olvidará.',
        let_go: 'Lo dejaste pasar. Todavía te molesta por las noches.',
        document: 'Tus registros llegaron a las personas adecuadas. Tu siguiente evaluación fue brillante.',
      },
    },
    layoffs: {
      title: 'Rumores de despidos',
      text: 'Los rumores de recortes se extienden por la empresa. Hay nervios por todas partes.',
      c: { buyout: 'Acogerte a un plan de salida voluntaria', harder: 'Trabajar más que nunca', wait: 'No llamar la atención' },
      r: {
        buyout: 'Tomaste el dinero y saliste hacia lo desconocido.',
        harder_ok: 'Sobreviviste a los recortes. Tu jefatura notó el esfuerzo.',
        harder_fail: 'No fue suficiente. Tu puesto desapareció.',
        wait_ok: 'La tormenta pasó de largo.',
        wait_fail: 'Tu nombre estaba en la lista.',
      },
    },
    side_business: {
      title: 'Olfato para los negocios',
      text: 'Tus amistades no paran de elogiar tu cocina. ¿Por qué no venderla en el mercado del fin de semana?',
      c: { launch: 'Alquilar un puesto en el mercado', catering: 'Hacer un catering pagado, una vez', family: 'Reservarla para las comidas familiares' },
      r: {
        launch: 'Compraste ingredientes, diseñaste un cartelito y abriste tu puesto.',
        catering: 'Agotador, pero la clientela quedó encantada y pagó bien.',
        family: 'Las comidas del domingo se volvieron lo mejor de la semana familiar.',
      },
    },
    market_success: {
      title: 'Cola hasta la esquina',
      text: 'Tu puesto del fin de semana tiene cola hasta la esquina. Un grupo de restaurantes está interesado.',
      c: { expand: 'Abrir un restaurante de verdad', steady: 'Mantenerlo pequeño y estable', sell_recipe: 'Vender la receta al grupo de restaurantes' },
      r: {
        expand_ok: 'El restaurante se volvió el favorito del barrio. Construiste algo real.',
        expand_fail: 'El alquiler y los sueldos te ahogaron. Cerraste en menos de un año.',
        steady: 'Un buen ingreso extra y una clientela fiel.',
        sell_recipe: 'Un cheque generoso. La receta secreta ya no es secreta.',
      },
    },
    sibling_loan: {
      title: 'Un favor',
      text: '{npc} te pide {amount} prestados para pagar el alquiler de este mes.',
      c: { lend: 'Prestar el dinero', refuse: 'Decir que no', help_job: 'Ayudar a {npc} a encontrar un trabajo mejor' },
      r: {
        lend: '{npc} prometió devolvértelo pronto.',
        refuse: '{npc} colgó con enfado.',
        help_job: 'Revisaste el currículum de {npc} e hiciste llamadas. Significó mucho.',
      },
    },
    sibling_repay: {
      title: 'Un sobre',
      text: '{npc} aparece en tu puerta con un sobre y una sonrisa avergonzada.',
      c: { accept: 'Abrir el sobre', forgive: 'Decir a {npc} que se lo quede' },
      r: {
        accept_ok: 'La cantidad completa, y un poquito más «de intereses». Se rieron juntos.',
        accept_fail: 'Dentro: un pagaré y un dibujo de un símbolo de moneda. No sabes si reír.',
        forgive: '{npc} te abrazó. Algunas cosas valen más que el dinero.',
      },
    },
    sibling_reckoning: {
      title: 'Un viejo rencor',
      text: 'En una cena familiar, {npc} recuerda la ventana rota de la infancia: «Dejaste que me culparan a mí».',
      c: { apologize: 'Pedir perdón con sinceridad', laugh: 'Intentar tomarlo con humor', deny: 'Negar que ocurriera' },
      r: {
        apologize: 'Décadas tarde, pero {npc} lo aceptó. Algo pesado se levantó.',
        laugh_ok: 'Todo el mundo se rio, {npc} también. Las viejas heridas pueden sanar.',
        laugh_fail: 'A {npc} no le hizo gracia. La cena terminó pronto.',
        deny: '{npc} te miró sin poder creerlo. La distancia creció.',
      },
    },
    parent_illness: {
      title: 'Necesitando ayuda',
      text: '{npc} tiene la salud delicada y necesita más ayuda en casa.',
      c: { care: 'Cuidar de {npc} en persona', pay: 'Pagar cuidados profesionales', visit: 'Visitar cuando puedas' },
      r: {
        care: 'Semanas agotadoras, recuperación lenta, largas conversaciones. Nunca habían estado tan cerca.',
        pay: 'Una cuidadora viene ahora cada día. {npc} está en buenas manos.',
        visit: 'Visitas los fines de semana. Te gustaría que fuera más.',
      },
    },
    parent_funeral: {
      title: 'Despedida',
      text: 'La familia se reúne para despedir a {npc}.',
      c: { eulogy: 'Dar el discurso de despedida', quiet: 'Vivir el duelo en silencio', reconcile: 'Hacer las paces con quien está en conflicto en la familia' },
      r: {
        eulogy_ok: 'Tus palabras retrataron a {npc} a la perfección. Te dieron las gracias durante semanas.',
        eulogy_fail: 'Las palabras apenas salieron. Todo el mundo lo entendió.',
        quiet: 'Te quedaste al fondo, recordando.',
        reconcile: 'El duelo abrió una puerta. Por primera vez en años, hablaron de verdad.',
      },
    },
    marathon: {
      title: 'El maratón de la ciudad',
      text: 'El maratón de la ciudad es dentro de seis meses. Tus amistades te retan a inscribirte.',
      c: { train: 'Entrenar para el maratón completo', fun_run: 'Hacer la carrera popular de 5 km', couch: 'Verlo desde el sofá' },
      r: {
        train_ok: 'Cuarenta y dos kilómetros. Cruzaste la meta llorando. ¡Maratón completado!',
        train_fail: 'Te lesionaste un músculo en el kilómetro 28. El año que viene.',
        fun_run: 'Medalla, plátano, sol. Un buen día.',
        couch: 'Animaste desde el sofá. Con aperitivos.',
      },
    },
    jury_duty: {
      title: 'Jurado popular',
      text: 'Llega una carta oficial: te han convocado para formar parte de un jurado.',
      c: { serve: 'Acudir', excuse: 'Pedir una exención' },
      r: {
        serve: 'Días largos, una decisión difícil y un nuevo respeto por la justicia.',
        excuse_ok: 'Aceptaron tu justificación.',
        excuse_fail: 'Al juez no le convenció. Acudiste de todos modos, refunfuñando.',
      },
    },
    midlife_crisis: {
      title: '¿Esto es todo?',
      text: 'Una mañana te despiertas preguntándote si la vida es solo esto.',
      c: { car: 'Comprar un coche llamativo', learn: 'Aprender algo totalmente nuevo', sabbatical: 'Tomarte un año de pausa', therapy: 'Empezar terapia' },
      r: {
        car: 'Es brillante, rápido y absolutamente ridículo. Te encanta.',
        learn: 'Empezaste clases de música. El vecindario está teniendo paciencia.',
        sabbatical: 'Dejaste el empleo y pasaste un año caminando, leyendo y descansando. Vuelves a reconocerte.',
        therapy: 'Poco a poco aprendiste a tratarte con más amabilidad. Los reveses duelen menos.',
      },
    },
    school_reunion: {
      title: 'Reencuentro de clase',
      text: 'Unos veinte años después, tu antigua clase organiza un reencuentro.',
      c: { attend: 'Ir y reencontrarte con todos', apologize: 'Buscar a la persona de la que te burlabas', brag: 'Ir y deslumbrar', skip: 'No ir' },
      r: {
        attend: 'Las mismas caras, más arrugas. Te reíste hasta que te dolieron las mejillas.',
        apologize: 'Pediste perdón por algo de hace décadas. La sorpresa se volvió gratitud.',
        brag_ok: 'Todo el mundo quería saber de tu vida.',
        brag_fail: 'Pusieron los ojos en blanco en cuanto te diste la vuelta.',
        skip: 'Viste las fotos en internet. Parecía divertido.',
      },
    },
    adopt_cat: {
      title: 'Visita sin invitación',
      text: 'Un gato ha decidido que tu puerta es suya y se niega a irse.',
      c: { adopt: 'Dejar entrar al gato', shelter: 'Llevarlo a un refugio' },
      r: {
        adopt: 'El gato se mudó, se adueñó del mejor sillón y aceptó el nombre {npc}.',
        shelter: 'El refugio le encontró un hogar en una semana.',
      },
    },
    burnout: {
      title: 'Al límite',
      text: 'Cada día de trabajo es una tortura. Dormir ya no ayuda.',
      c: { leave: 'Pedir una baja médica', push: 'Aguantar', quit: 'Renunciar' },
      r: {
        leave: 'Unas semanas de pausa. Poco a poco, el color volvió al mundo.',
        push: 'Seguiste adelante. Tu cuerpo y tu ánimo están pagando el precio.',
        quit: 'Te fuiste. Por primera vez en años, dormiste bien.',
      },
    },
    home_renovation: {
      title: 'Fiebre de reformas',
      text: 'Tu casa necesita una reforma de verdad.',
      c: { diy: 'Hacerlo por tu cuenta', contractor: 'Contratar a una empresa', leave: 'Dejarla como está' },
      r: {
        diy_ok: 'Llevó meses, pero quedó precioso, y lo hiciste tú.',
        diy_fail: 'Inundaste el baño. La reparación salió cara.',
        contractor: 'Caro, pero la casa parece nueva.',
        leave: 'El grifo que gotea sigue con su canción eterna.',
      },
    },
    grandchild: {
      title: 'Una nueva generación',
      text: '{npc} tuvo un bebé. ¡Ahora tienes nietos!',
    },
    child_school_trouble: {
      title: 'Llamada de la escuela',
      text: 'Llaman de la escuela: {npc} se metió en problemas hoy.',
      c: { talk: 'Sentarte a escuchar', punish: 'Un mes de castigo', ignore: 'Cosas de la edad' },
      r: {
        talk: 'Pasaba algo en la escuela. {npc} agradece que le escucharas.',
        punish: '{npc} cumplió el castigo y dio muchos portazos.',
        ignore: '{npc} se pregunta si te importa.',
      },
    },
    child_college: {
      title: '¡Admisión!',
      text: '{npc} entró en la universidad. La matrícula es cara.',
      c: { pay: 'Pagarlo todo', half: 'Pagar la mitad', own_way: 'Que encuentre su propio camino' },
      r: {
        pay: '{npc} lloró y prometió que te haría sentir orgullo.',
        half: '{npc} pedirá un préstamo para el resto, pero lo agradece.',
        own_way: '{npc} lo entendió, pero serán unos años difíciles.',
      },
    },
    lottery_scratch: {
      title: 'Rasca y gana',
      text: '¡Un rasca y gana que venía en una tarjeta de cumpleaños tenía premio!',
    },
    noisy_neighbors: {
      title: 'Fiesta al lado',
      text: 'El nuevo vecindario hace fiestas ruidosas cada noche.',
      c: { complain: 'Llamar y quejarte', join: 'Si no puedes con ellos…', earplugs: 'Comprar tapones para los oídos' },
      r: {
        complain_ok: 'Se disculparon y bajaron el volumen. Vuelve la paz.',
        complain_fail: 'Subieron la música. Guerra fría declarada.',
        join: 'Gente estupenda, música horrible. Dormiste hasta el mediodía.',
        earplugs: 'Duermes. Casi siempre.',
      },
    },
    retirement_offer: {
      title: '¿Un año más?',
      text: 'En el trabajo te preguntan si este será tu último año.',
      c: { retire: 'Sí, hora de jubilarse', continue: 'Todavía no' },
      r: {
        retire: 'Una fiesta, una tarta, una tarjeta firmada por todo el mundo. Empieza un nuevo capítulo.',
        continue: 'Aún tienes mucho que aportar. Todos se alegran de que te quedes.',
      },
    },
    blackout: {
      title: 'Apagón',
      text: 'Un apagón en toda la ciudad. Pasaste la noche jugando a las cartas a la luz de las velas con el vecindario.',
    },
    record_surfaces: {
      title: 'Una denuncia antigua',
      text: 'En una verificación de antecedentes para una nueva oportunidad aparece la denuncia de la chocolatina de tu adolescencia.',
      c: { explain: 'Explicarlo con honestidad', hide: 'Decir que debe de ser un error' },
      r: {
        explain_ok: 'Valoraron tu honestidad. Al fin y al cabo, fue hace mucho tiempo.',
        explain_fail: 'Fueron amables, pero la duda quedó en el aire.',
        hide_ok: 'Nadie investigó más.',
        hide_fail: 'Lo comprobaron. Que te pillaran mintiendo fue mucho peor que la chocolatina.',
      },
    },
    old_secret: {
      title: 'La tienda de la esquina',
      text: 'La tienda de la que te llevaste una chocolatina sin pagar cierra después de cuarenta años.',
      c: { pay_back: 'Dejar un sobre con dinero y una nota', souvenir: 'Comprar algo el último día', walk_by: 'Pasar de largo' },
      r: {
        pay_back: 'Nunca supiste si el dueño leyó la nota. Aun así, sentiste alivio.',
        souvenir: 'Compraste una chocolatina, y esta vez la pagaste.',
        walk_by: 'El viejo cartel desapareció una semana después.',
      },
    },
    parent_advice: {
      title: 'Porque sí',
      text: '{npc} llamó solo para decirte el orgullo que siente por ti.',
    },
    friend_moves_away: {
      title: 'Mudanza',
      text: '{npc} se muda a otra ciudad para siempre.',
      c: { promise: 'Prometer mantener el contacto', party: 'Organizar una fiesta de despedida', shrug: 'La gente viene y va' },
      r: {
        promise: 'Acordaron una llamada al mes. A ver si dura.',
        party: 'Una noche de historias y abrazos. {npc} se fue con el corazón lleno.',
        shrug: '{npc} notó lo poco que parecía importarte.',
      },
    },
    relocation_offer: {
      title: 'Un puesto mejor, lejos',
      text: 'Tu empresa te ofrece un ascenso, pero implica mudarte a otra ciudad.',
      c: { accept: 'Aceptar el ascenso y mudarte', decline: 'Quedarte cerca de quienes quieres' },
      r: {
        accept: 'Nueva ciudad, nuevo puesto. Echas de menos a tu gente más de lo que esperabas.',
        decline: 'Tu jefatura respetó la decisión. Tu familia sintió alivio.',
      },
    },
    bad_flu: {
      title: 'Fuera de combate',
      text: 'Una gripe fuerte te dejó en cama dos semanas.',
    },
    hobby_spotlight: {
      title: 'Talento reconocido',
      text: 'Años de práctica dieron fruto: un club local te invitó a mostrar tu trabajo.',
    },

    // ── Tercera edad ────────────────────────────────────────────────────────
    retirement_hobby: {
      title: 'Fines de semana sin fin',
      text: 'Con la jubilación, todos los días son tuyos. ¿Cómo los vas a vivir?',
      c: { garden: 'Empezar un huerto', travel: 'Viajar', volunteer: 'Hacer voluntariado en el barrio' },
      r: {
        garden: 'Tus tomates son la envidia de la calle.',
        travel: 'Lugares que solo conocías por postales, por fin en persona.',
        volunteer: 'Ahora el vecindario te conoce por tu nombre.',
      },
    },
    grandkid_visit: {
      title: 'Vienen los nietos',
      text: 'Tus nietos pasarán el fin de semana contigo.',
      c: { teach: 'Enseñarles algo que te apasiona', spoil: 'Consentirlos sin límite', nap: 'Dejarles la tele y echarte una siesta' },
      r: {
        teach: 'Recordarán este fin de semana durante mucho tiempo.',
        spoil: 'Helado para desayunar. A sus padres no les hizo gracia.',
        nap: 'Todo el mundo quedó feliz, sobre todo tú.',
      },
    },
    scam_call: {
      title: 'Llamada urgente de «tu banco»',
      text: 'Alguien llama diciendo que tu cuenta corre peligro y te pide tu código de seguridad.',
      c: { give: 'Darle el código', hang_up: 'Colgar', call_family: 'Llamar a tu familia para comprobarlo' },
      r: {
        give: 'Era una estafa. Parte de tus ahorros desapareció.',
        hang_up: 'Colgaste. Tu banco de verdad confirmó después que era una estafa.',
        call_family: 'Tu familia te ayudó a denunciar la estafa y se quedó una hora al teléfono.',
      },
    },
    memoir: {
      title: 'Tu historia',
      text: 'Has vivido mucho. Quizá sea hora de ponerlo por escrito.',
      c: { write: 'Escribir unas memorias', record: 'Grabar historias para la familia', no: 'Hay cosas que mejor no escribir' },
      r: {
        write: 'Página tras página, tu vida volvió a tu memoria.',
        record: 'Tu familia tiene ahora horas de tus historias, con tu voz.',
        no: 'Te guardas tus recuerdos.',
      },
    },
    memoir_published: {
      title: 'Llama una editorial',
      text: 'Una pequeña editorial leyó tu manuscrito y le encantó.',
      c: { publish: 'Publicarlo', family_only: 'Imprimir copias solo para la familia' },
      r: {
        publish: 'Tu libro está en la estantería de la librería del barrio. Te piden firmas.',
        family_only: 'Cada persona de la familia recibió una copia encuadernada. Es su libro más preciado.',
      },
    },
    fall_injury: {
      title: 'Una mala caída',
      text: 'Te resbalaste en la escalera. A esta edad, la recuperación es lenta.',
    },
    old_friend_letter: {
      title: 'Una carta',
      text: 'Llega una carta escrita a mano por {npc}. Empieza así: «¿Te acuerdas de la mesa del comedor?».',
      c: { visit: 'Viajar para visitar a {npc}', reply: 'Escribir una larga respuesta', keep: 'Guardar la carta cerca' },
      r: {
        visit: 'Pasaron una tarde en un porche, volviendo a la infancia por unas horas.',
        reply: 'Escribiste diez páginas. {npc} respondió con doce.',
        keep: 'La relees cada pocos días.',
      },
    },
    mentor_young: {
      title: 'Pasar el testigo',
      text: 'Una persona joven del barrio no sabe qué camino tomar. Recuerdas a quien un día te ayudó.',
      c: { mentor: 'Ofrecerte a guiarle', advice: 'Dar un consejo', busy: 'Ahora no tienes energía para esto' },
      r: {
        mentor: 'Charlas semanales, progreso lento, gratitud sincera. El círculo se cierra.',
        advice: 'Una frase tuya le acompañó durante años.',
        busy: 'Quizá otra persona le ayude.',
      },
    },
    downsizing: {
      title: 'Demasiada casa',
      text: 'La casa se siente enorme y la escalera, empinada.',
      c: { sell: 'Vender y mudarte a algo más pequeño', stay: 'Quedarte con tus recuerdos' },
      r: {
        sell: 'Vendiste la casa y te mudaste a un lugar pequeño y acogedor. El dinero viene bien.',
        stay: 'Cada habitación guarda una historia. Te quedas.',
      },
    },
    tech_class: {
      title: 'Teléfonos para principiantes',
      text: 'La biblioteca ofrece un curso gratuito: «Teléfonos inteligentes para principiantes».',
      c: { enroll: 'Apuntarte', refuse: 'Te las arreglaste muy bien sin ellos' },
      r: {
        enroll: 'Ahora haces videollamadas. Y mandas demasiados emojis.',
        refuse: 'Tus nietos seguirán imprimiéndote las fotos.',
      },
    },
    centenarian_party: {
      title: 'Cien años',
      text: '¡Tu centésimo cumpleaños! El periódico local envió a un fotógrafo.',
    },
    pet_old_age: {
      title: 'Hocico canoso',
      text: '{npc} envejeció y perdió el ritmo, pero sigue esperándote en la puerta cada día.',
      c: { beach: 'Regalar a {npc} un último día perfecto', vet: 'Pagar un tratamiento para ganar tiempo' },
      r: {
        beach: 'Un día de playa, una salchicha entera, una larga siesta al sol. {npc} se fue en paz esa noche.',
        vet: 'El tratamiento dio a {npc} más días buenos.',
      },
    },
    pet_goodbye: {
      title: 'Adiós, fiel compañía',
      text: '{npc} se fue en paz, en su rincón favorito.',
    },
    time_capsule_open: {
      title: 'Veinte años después',
      text: 'Tu antigua clase se reúne para desenterrar la cápsula del tiempo. Dentro, entre dibujos descoloridos, encuentras {item}.',
      c: { dream_lived: 'Darte cuenta de que cumpliste tu sueño', laugh: 'Reírte de tu yo más joven', new_dream: 'Dejar que inspire un nuevo sueño' },
      r: {
        dream_lived: 'Tu yo de la infancia sentiría mucho orgullo. Lo sostuviste sonriendo durante una hora.',
        laugh: 'Tú y tu clase se rieron hasta llorar.',
        new_dream: 'Te recordó que nunca es tarde para desear algo nuevo.',
      },
    },
    neighbor_legacy: {
      title: 'Una carta del pasado',
      text: 'Llega la noticia de que {npc}, a quien ayudaste en tu infancia, ha fallecido. Te dejó su viejo piano y una nota: «Para la criatura de buen corazón».',
      c: { keep: 'Quedarte el piano', sell: 'Vender el piano', donate: 'Donarlo a la escuela' },
      r: {
        keep: 'Lo tocas mal y a menudo. Se siente como una conversación.',
        sell: 'El dinero ayuda. Guardaste la nota.',
        donate: 'La escuela puso a la sala de música el nombre de {npc}.',
      },
    },
    sunset_walk: {
      title: 'Paseo al atardecer',
      text: 'Diste un paseo lento al atardecer y te fijaste en todo: pájaros, niños, olor a lluvia.',
    },
    old_photos: {
      title: 'Fotos antiguas',
      text: 'Repasando fotos antiguas, encontraste una tuya con tu amistad de la infancia en la mesa del comedor.',
    },
  },
} as const;
