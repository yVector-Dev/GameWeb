// English event texts. For each event: title, text, c.<choice> (button
// label) and r.<choice> (result). Choices with a chance use r.<choice>_ok and
// r.<choice>_fail. Available params: {name} (you), {npc} (person involved).
export default {
  ev: {
    // ── Childhood ───────────────────────────────────────────────────────────
    first_word: {
      title: 'First Word',
      text: 'Your first word was {word}. Your family will be retelling this moment for years.',
    },
    first_steps: {
      title: 'First Steps',
      text: 'You took your first wobbly steps, straight into the coffee table. Nobody was hurt except the table’s pride.',
    },
    toddler_tantrum: {
      title: 'The Candy Aisle',
      text: 'At the supermarket, a wall of candy sits exactly at your eye level. It is calling your name.',
      c: { scream: 'Scream until someone gives in', ask: 'Point and say “please”', sneak: 'Quietly drop a bag into the cart' },
      r: {
        scream: 'You got the candy and the stares of every shopper in the store. Your family was not amused.',
        ask: 'Your family was so charmed by your manners that you got a small treat.',
        sneak_ok: 'Nobody noticed until checkout, and by then it was too late to argue.',
        sneak_fail: 'The bag fell out at checkout. Busted, and no candy for a week.',
      },
    },
    imaginary_friend: {
      title: 'Captain Noodle',
      text: 'You have invented an imaginary friend named Captain Noodle, who insists on a seat at dinner.',
      c: { keep: 'Keep the Captain around', introduce: 'Introduce the Captain to your family', let_go: 'Tell the Captain goodbye' },
      r: {
        keep: 'You and Captain Noodle drew maps of imaginary worlds for months.',
        introduce: 'Your family set an extra plate. Dinner was the funniest it had been in weeks.',
        let_go: 'You decided you were too big for imaginary friends. The Captain saluted and vanished.',
      },
    },
    first_day_school: {
      title: 'First Day of School',
      text: 'The classroom is huge and loud, full of children you have never met.',
      c: { cling: 'Hold on tight to your family', stranger: 'Sit next to a kid who looks nervous too', explore: 'Inspect every shelf and drawer' },
      r: {
        cling: 'It took the teacher a while to coax you inside. You got through the day, barely.',
        stranger: 'By lunchtime the two of you were inseparable. Your first school friend!',
        explore: 'You found the class hamster, the art supplies and the teacher’s secret cookie jar.',
      },
    },
    new_kid: {
      title: 'The New Kid',
      text: 'A new kid named {npc} sits alone at lunch every day, pretending to read the same page.',
      c: { invite: 'Invite {npc} to sit with you', wave: 'Give a friendly wave', ignore: 'Mind your own business', tease: 'Join the others in teasing' },
      r: {
        invite: '{npc} lit up. By the end of the week, you were trading snacks and secrets. A friendship has begun.',
        wave: '{npc} waved back shyly. Maybe someday you will talk.',
        ignore: 'You ate your lunch. {npc} kept reading the same page.',
        tease: 'The others laughed. {npc} did not. It is the kind of thing people remember.',
      },
    },
    lost_tooth: {
      title: 'Wobbly Tooth',
      text: 'Your first baby tooth came out in an apple. The next morning there was a shiny coin under your pillow.',
    },
    science_fair: {
      title: 'The Science Fair',
      text: 'The school science fair is in three weeks. Everyone is talking about volcanoes.',
      c: { work_hard: 'Spend every weekend on an original project', kit: 'Ask your family to buy a ready-made kit', parent: 'Let a grown-up “help” (do it)' },
      r: {
        work_hard_ok: 'Your homemade water filter won first prize. The local paper even ran a photo.',
        work_hard_fail: 'Your project collapsed an hour before judging. You still learned a lot.',
        kit: 'The kit volcano erupted on schedule. Solid, if not original.',
        parent: 'The project looked suspiciously professional. Your teacher raised an eyebrow.',
      },
    },
    stray_puppy: {
      title: 'A Shadow on Four Legs',
      text: 'A scruffy puppy has followed you home from school and is now sitting on the doorstep, tail thumping.',
      c: { adopt: 'Beg to keep it', shelter: 'Take it to the animal shelter', shoo: 'Shoo it away' },
      r: {
        adopt: 'After a long family meeting, the answer was yes. You named the puppy {npc}.',
        shelter: 'The shelter staff thanked you. You visited twice to make sure the puppy was adopted.',
        shoo: 'The puppy eventually wandered off. You thought about it for days.',
      },
    },
    dream_job: {
      title: 'When I Grow Up',
      text: 'Your teacher asks everyone to draw what they want to be when they grow up.',
      c: { doctor: 'A doctor who saves lives', artist: 'A famous artist', inventor: 'An inventor of robots', teacher: 'A teacher, like the one asking' },
      r: {
        doctor: 'You drew yourself in a white coat, healing a giant teddy bear.',
        artist: 'You drew yourself in a gallery full of your own paintings.',
        inventor: 'You drew a robot that does homework. Your teacher laughed and pinned it up.',
        teacher: 'Your teacher was touched and pinned the drawing above the board.',
      },
    },
    time_capsule: {
      title: 'The Time Capsule',
      text: 'Your class is burying a time capsule in the schoolyard, to be opened in twenty years.',
      c: { letter: 'Write a letter to your future self', toy: 'Put in your favorite toy', skip: 'Keep your things, thanks' },
      r: {
        letter: 'You wrote about your dreams and sealed the envelope. Future you had better live up to it.',
        toy: 'It hurt to let go of it, but it felt important.',
        skip: 'You watched the others bury their treasures and kept yours in your pocket.',
      },
    },
    neighbor_groceries: {
      title: 'Heavy Bags',
      text: 'Your elderly neighbor {npc} is struggling up the steps with heavy grocery bags.',
      c: { help: 'Carry the bags', pretend: 'Pretend not to see', charge: 'Offer to carry them for a coin' },
      r: {
        help: '{npc} thanked you with lemonade and stories about the old days. It became a weekly visit.',
        pretend: 'You looked at your shoes. {npc} made it up the steps eventually.',
        charge: '{npc} laughed, paid you, and called you “a future business tycoon”.',
      },
    },
    broken_window: {
      title: 'Crash!',
      text: 'Your ball just went straight through the neighbor’s window. Nobody saw who kicked it.',
      c: { confess: 'Knock on the door and confess', run: 'Run!', blame: 'Say your sibling did it' },
      r: {
        confess: 'The neighbor was surprised and grateful for the honesty. You did chores to pay for the glass.',
        run_ok: 'You got away clean. Your heart pounded for hours.',
        run_fail: 'The neighbor recognized your ball. Your family found out, and it was worse for running.',
        blame: 'Your sibling got grounded for a week and has not forgotten it.',
      },
    },
    bully: {
      title: 'The Lunch-Money Toll',
      text: 'A bigger kid blocks your way and demands your lunch money.',
      c: { stand_up: 'Stand your ground', tell: 'Tell a teacher', avoid: 'Take the long way from now on', befriend: 'Ask why they are doing this' },
      r: {
        stand_up_ok: 'They backed down in front of everyone. Nobody bothered you again.',
        stand_up_fail: 'You got shoved into the lockers. Still, people noticed you did not give in.',
        tell: 'The teacher handled it quietly. Some kids called you a snitch, but the bullying stopped.',
        avoid: 'The long way added ten minutes to every day, but it worked.',
        befriend_ok: 'It turned out they were hungry. You shared your lunch, and an odd friendship was born.',
        befriend_fail: 'They laughed and took the money anyway.',
      },
    },
    school_play: {
      title: 'The School Play',
      text: 'Auditions for the school play are this week. The lead role is a talking dragon.',
      c: { audition: 'Audition for the dragon', backstage: 'Paint the sets', skip: 'Not your thing' },
      r: {
        audition_ok: 'You got the part and roared your way into school legend.',
        audition_fail: 'You froze on your first line. You got the role of “Tree #3”.',
        backstage: 'Your painted castle got its own round of applause.',
        skip: 'You watched from the audience and clapped for your friends.',
      },
    },
    chickenpox: {
      title: 'Spots Everywhere',
      text: 'Chickenpox! A week of itching, oatmeal baths and cartoons.',
    },
    found_wallet: {
      title: 'A Wallet on the Sidewalk',
      text: 'You find a wallet on the sidewalk with an ID card and some cash inside.',
      c: { return: 'Return it to the address on the ID', keep: 'Keep the cash, toss the wallet', leave: 'Leave it where it is' },
      r: {
        return: 'The owner nearly cried. Word of your honesty spread around the neighborhood.',
        keep: 'The money was gone in a week. The guilt lasted longer.',
        leave: 'You walked on. Someone else will deal with it.',
      },
    },
    grandparent_recipe: {
      title: 'The Secret Recipe',
      text: '{npc} offers to teach you the family recipe that nobody else has ever been trusted with.',
      c: { learn: 'Roll up your sleeves', later: 'Maybe another time' },
      r: {
        learn: 'Flour everywhere, laughter everywhere. You now carry a piece of family history.',
        later: '{npc} smiled, but you could tell they were a little disappointed.',
      },
    },
    spelling_bee: {
      title: 'The Spelling Bee',
      text: 'You have been chosen to represent your class at the spelling bee.',
      c: { practice: 'Practice every evening', wing_it: 'Trust your instincts', skip: 'Let someone else go' },
      r: {
        practice_ok: 'You spelled “onomatopoeia” without blinking and took the trophy home.',
        practice_fail: 'You went out on “rhythm”. Still, all that practice paid off in class.',
        wing_it_ok: 'Pure instinct carried you to the final round. Impressive!',
        wing_it_fail: 'You were out in the first round. On the word “cat”. With a K.',
        skip: 'Someone else went. You cheered from the crowd.',
      },
    },
    parent_job_loss: {
      title: 'Tight Times',
      text: '{npc} lost their job. The house is quieter, and the grown-ups whisper about bills.',
      c: { savings: 'Offer your piggy bank', cheer: 'Make a card to cheer them up', quiet: 'Stay out of the way' },
      r: {
        savings: '{npc} hugged you for a long time and did not take a single coin. Well, maybe a few.',
        cheer: 'Your card ended up on the fridge for years.',
        quiet: 'You kept to your room. The house felt heavy for months.',
      },
    },
    summer_camp: {
      title: 'Summer Camp',
      text: 'Your family can send you to one summer camp this year. Which one?',
      c: { sports: 'Sports camp', science: 'Science camp', music: 'Music camp', home: 'Stay home this summer' },
      r: {
        sports: 'Three weeks of running, swimming and sunburn. You came back stronger.',
        science: 'You built a rocket that actually flew. Mostly sideways, but still.',
        music: 'You learned your first real songs around a campfire.',
        home: 'A lazy summer of family picnics and long afternoons.',
      },
    },
    new_sibling: {
      title: 'A New Arrival',
      text: 'Your family has grown: meet your new baby sibling, {npc}! Sleep will be rare for a while.',
    },
    sleepover: {
      title: 'Sleepover',
      text: '{npc} invites you to a sleepover this weekend.',
      c: { go: 'Pack your sleeping bag', host: 'Suggest having it at your place', decline: 'Stay home' },
      r: {
        go: 'Pillow forts, ghost stories and zero sleep. Perfect.',
        host: 'Your family made pancakes in the morning. {npc} still talks about them.',
        decline: '{npc} seemed a little hurt.',
      },
    },
    museum_trip: {
      title: 'Field Trip',
      text: 'On a class trip to the natural history museum, you stood under a dinosaur skeleton and forgot to breathe.',
    },
    learn_bike: {
      title: 'Two Wheels',
      text: 'After many scraped knees, you finally rode a bicycle on your own. Freedom!',
    },

    // ── Teen years ──────────────────────────────────────────────────────────
    first_phone: {
      title: 'Your First Phone',
      text: 'You finally got your own phone. The whole world fits in your pocket.',
      c: { all_in: 'Join every app and group chat', balanced: 'Set some limits', decline: 'Keep it for calls only' },
      r: {
        all_in: 'You are always in the loop now, and always a little tired.',
        balanced: 'Notifications off after nine. Your sleep thanks you.',
        decline: 'You missed some jokes, but read three novels instead.',
      },
    },
    exam_cheat: {
      title: 'The Answers',
      text: 'A classmate whispers that the answers to the big exam are circulating, and offers you a copy.',
      c: { cheat: 'Take the copy', study: 'Study all night instead', report: 'Warn the teacher' },
      r: {
        cheat_ok: 'You aced the exam. Nobody found out, but the grade feels hollow.',
        cheat_fail: 'The teacher had changed the questions. You were caught and your family was called in.',
        study: 'You stumbled into the exam exhausted, but you knew the material cold.',
        report: 'The exam was rewritten. Some classmates were furious with you; the teachers were not.',
      },
    },
    house_party: {
      title: 'The House Party',
      text: 'Someone’s parents are away for the weekend, and the whole grade is invited.',
      c: { wild: 'Go and stay until the end', early: 'Go, but leave early', stay: 'Stay home' },
      r: {
        wild_ok: 'A legendary night. You got home before anyone noticed.',
        wild_fail: 'The neighbors called the police. Your family picked you up. The silence in the car was loud.',
        early: 'You caught the best part and slept in your own bed.',
        stay: 'You heard all about it on Monday. It sounded both amazing and terrible.',
      },
    },
    dare_shoplift: {
      title: 'The Dare',
      text: 'Your friends dare you to swipe a candy bar from the corner store. They are watching.',
      c: { do_it: 'Do it', refuse: 'Refuse', pay: 'Pay for it secretly and pretend' },
      r: {
        do_it_ok: 'You walked out with the candy bar and a racing heart. Your friends cheered. You feel strange about it.',
        do_it_fail: 'The owner caught you at the door, called your family and filed a report.',
        refuse: 'Your friends called you boring. Some of them respected it later.',
        pay: 'Your friends never knew. You kept your conscience and your reputation.',
      },
    },
    start_band: {
      title: 'Garage Band',
      text: 'Some friends are starting a band in a garage and need one more person.',
      c: { join: 'Grab an instrument and join', manage: 'Become their manager', decline: 'Not for you' },
      r: {
        join: 'You are terrible. Everyone is terrible. It is the best thing ever.',
        manage: 'You designed flyers and booked the band’s first rehearsal space.',
        decline: 'You heard them practicing from three streets away. You are glad you declined.',
      },
    },
    band_gig: {
      title: 'The First Gig',
      text: 'Your band got its first real gig: a Friday night at a local café.',
      c: { originals: 'Play your own songs', covers: 'Play safe crowd-pleasers', quit: 'Leave the band before the show' },
      r: {
        originals_ok: 'The café owner asked you back. Someone in the audience was humming your chorus.',
        originals_fail: 'Feedback screeched, a string snapped, and half the crowd left. Rock and roll.',
        covers: 'Everyone sang along. Not art, but definitely fun.',
        quit: 'You walked away. The band played without you and was, honestly, fine.',
      },
    },
    band_reunion: {
      title: 'The Reunion Call',
      text: 'An old bandmate calls: a promoter wants your teenage band for a nostalgia festival.',
      c: { reunite: 'Get the band back together', pitch: 'Pitch the new songs you have written', decline: 'Leave the past in the past' },
      r: {
        reunite: 'Older, slower, louder. The crowd loved it and so did you.',
        pitch_ok: 'A label rep heard your new material and offered a record deal!',
        pitch_fail: 'The label passed. The festival was still a blast.',
        decline: 'You listened to an old recording that night and smiled.',
      },
    },
    part_time_offer: {
      title: 'Weekend Job',
      text: 'Local businesses are hiring teenagers for weekend shifts.',
      c: { shop: 'Work at the corner shop', kitchen: 'Work in a café kitchen', decline: 'Keep your weekends free' },
      r: {
        shop: 'You learned to count change fast and smile at grumpy customers.',
        kitchen: 'Hot, loud and chaotic. You love it more than you expected.',
        decline: 'Your weekends stay yours, for now.',
      },
    },
    friend_in_trouble: {
      title: 'A Friend in Trouble',
      text: '{npc}’s family is losing their home. {npc} quietly asks if they could stay with you for a few weeks.',
      c: { host: 'Ask your family to take {npc} in', lend: 'Give {npc} half your savings', adult: 'Tell a trusted adult who can help', refuse: 'Say you cannot help' },
      r: {
        host: 'It was cramped and your family grumbled, but {npc} will never forget it.',
        lend: '{npc} protested, then accepted with tears in their eyes.',
        adult: 'The school counselor found the family support. {npc} was grateful, if a bit embarrassed.',
        refuse: '{npc} said they understood. Things were never quite the same.',
      },
    },
    scholarship_competition: {
      title: 'The Scholarship Exam',
      text: 'A foundation is offering university scholarships to the best young science students. The exam is next month.',
      c: { prepare: 'Prepare like your future depends on it', relaxed: 'Take it without much preparation', skip: 'Skip it' },
      r: {
        prepare_ok: 'You won! Most of your university tuition will be covered.',
        prepare_fail: 'You missed the cut by a few points. All that studying still sharpened your mind.',
        relaxed_ok: 'Against the odds, you won a partial scholarship.',
        relaxed_fail: 'You did not place. Maybe you should have prepared.',
        skip: 'You spent that month on other things.',
      },
    },
    driving_lesson: {
      title: 'Empty Parking Lot',
      text: '{npc} offers to teach you to drive in an empty parking lot on Sunday morning.',
      c: { careful: 'Take it slow and listen', fast: 'Show off a little', later: 'Maybe next year' },
      r: {
        careful: 'Mirrors, signals, patience. You will be ready for the test.',
        fast_ok: 'You pulled a perfect turn and {npc} laughed out loud.',
        fast_fail: 'You met a lamppost. Gently. {npc} was very quiet on the way home.',
        later: 'The car keys stayed on the hook.',
      },
    },
    sports_tryout: {
      title: 'Team Tryouts',
      text: 'Tryouts for the school team are this afternoon.',
      c: { tryout: 'Give it everything', cheer: 'Cheer from the stands', skip: 'Go home and read' },
      r: {
        tryout_ok: 'You made the team! Practice is brutal and you love it.',
        tryout_fail: 'You did not make it this time. The coach told you to come back next year.',
        cheer: 'You were the loudest voice in the stands.',
        skip: 'You finished a great book instead.',
      },
    },
    dropout_temptation: {
      title: 'Why Bother?',
      text: 'School feels pointless. A cousin says there is warehouse work paying cash right now.',
      c: { drop: 'Leave school and take the job', stay: 'Grit your teeth and stay', counselor: 'Talk to the school counselor' },
      r: {
        drop: 'You walked out of school for the last time. The paychecks are real. So is the worry at home.',
        stay: 'It is hard, but you are still here.',
        counselor: 'The counselor helped you build a plan. School feels a little less pointless.',
      },
    },
    picture_day: {
      title: 'Picture Day',
      text: 'A giant pimple chose picture day to appear. The yearbook will preserve it forever.',
    },
    volunteer_shelter: {
      title: 'Giving Back',
      text: 'Your school asks students to volunteer for a few weekends.',
      c: { animals: 'Help at the animal shelter', food_bank: 'Sort donations at the food bank', busy: 'Too busy right now' },
      r: {
        animals: 'You walked dogs and cleaned cages, and came home covered in fur and happiness.',
        food_bank: 'You sorted tons of food and met people from all over town.',
        busy: 'Maybe next time.',
      },
    },
    viral_video: {
      title: 'Going Viral',
      text: 'A video of you dancing badly at a family party has gone viral overnight.',
      c: { lean_in: 'Lean in and post more', delete: 'Ask for it to be taken down', laugh: 'Laugh along' },
      r: {
        lean_in_ok: 'Your follow-up videos were a hit. A local brand even sent you a small check.',
        lean_in_fail: 'The internet turned on you. The comments were brutal.',
        delete: 'It took weeks, but the video faded away.',
        laugh: 'You owned it. People liked you more for it.',
      },
    },
    career_fair: {
      title: 'Career Fair',
      text: 'The school gym is full of booths from local employers and colleges.',
      c: { tech: 'The technology booth', health: 'The hospital booth', trades: 'The electricians’ booth', people: 'The law and teaching booth' },
      r: {
        tech: 'You spent an hour playing with a robot arm. Something clicked.',
        health: 'A nurse told stories that stayed with you for weeks.',
        trades: 'You wired a light bulb by yourself and felt like a wizard.',
        people: 'A judge and a teacher argued about who has the harder job. You were fascinated.',
      },
    },
    talent_show: {
      title: 'Talent Show',
      text: 'The school talent show needs acts. Sign-ups close today.',
      c: { sing: 'Sing a song', comedy: 'Do a stand-up routine', watch: 'Watch from the crowd' },
      r: {
        sing_ok: 'Your voice cracked once, and nobody cared. Standing ovation.',
        sing_fail: 'You forgot the second verse and hummed it. The crowd hummed along, kindly.',
        comedy_ok: 'The gym roared with laughter. Even the principal laughed.',
        comedy_fail: 'Crickets. One cough. You will laugh about it someday.',
        watch: 'You cheered for every act, even the kid who played the spoons.',
      },
    },
    grandparent_story: {
      title: 'Old Stories',
      text: '{npc} spent an evening telling you stories about growing up. You realized how much you did not know.',
    },

    // ── Adulthood ───────────────────────────────────────────────────────────
    after_school: {
      title: 'What Comes Next',
      text: 'School is over. The future is wide open, which is exciting and terrifying.',
      c: { study: 'Focus on further studies', work: 'Focus on finding work', gap: 'Take a gap year to travel', slow: 'Take it one day at a time' },
      r: {
        study: 'You started reading course catalogs. (You can enroll in the School & Work tab.)',
        work: 'You polished a résumé. Employers will notice the drive for the next few years.',
        gap: 'Hostels, trains and new friends. You came back with stories and a wider view of the world.',
        slow: 'No rush. You will figure it out.',
      },
    },
    roommate: {
      title: 'The Roommate Situation',
      text: 'Your roommate leaves dirty dishes everywhere and “borrows” your food.',
      c: { confront: 'Have a frank talk', clean: 'Just clean it yourself', chart: 'Make a chore chart' },
      r: {
        confront_ok: 'It was awkward, but the dishes started getting washed.',
        confront_fail: 'It turned into a fight. The apartment is tense now.',
        clean: 'Clean kitchen, quiet resentment.',
        chart: 'The chart actually worked. You are a household genius.',
      },
    },
    campus_party: {
      title: 'Campus Party',
      text: 'There is a huge party on campus the night before an important exam.',
      c: { go: 'Go to the party', study: 'Study instead', group: 'Host a study group with snacks' },
      r: {
        go: 'You made a new friend and remembered almost nothing about the exam material.',
        study: 'Quiet night, solid exam.',
        group: 'Half studying, half laughing. Everyone passed.',
      },
    },
    meet_cute: {
      title: 'A Spark',
      text: 'At a friend’s birthday, you keep ending up in the same conversation with {npc}.',
      c: { ask_out: 'Ask {npc} out', numbers: 'Exchange numbers as friends', leave: 'Let the moment go' },
      r: {
        ask_out_ok: '{npc} said yes before you finished the question. You are dating!',
        ask_out_fail: '{npc} smiled kindly and said no. Ouch.',
        numbers: 'You stayed in touch. A good friendship, at least for now.',
        leave: 'You went home early and wondered what might have been.',
      },
    },
    old_flame: {
      title: 'An Old Flame',
      text: 'At a train station, you bump into {npc}, your ex, for the first time in years.',
      c: { coffee: 'Grab a coffee and catch up', rekindle: 'See if there is still something there', nod: 'Nod politely and move on' },
      r: {
        coffee: 'Two hours flew by. You left as friends, which felt right.',
        rekindle_ok: 'There was. You are together again, older and wiser.',
        rekindle_fail: 'There was not. It was a little sad and a little freeing.',
        nod: 'You both smiled and went your separate ways.',
      },
    },
    friend_startup: {
      title: 'The Big Idea',
      text: '{npc}, your friend since childhood, is starting a company and wants you on board.',
      c: { join: 'Quit your plans and join', invest: 'Invest some savings', advice: 'Offer advice, nothing more', decline: 'Wish {npc} luck' },
      r: {
        join: 'Long nights, cheap pizza, huge dreams. You are a startup employee now.',
        invest: 'You wrote a check. {npc} framed a copy of it.',
        advice: 'You spent an evening sketching plans with {npc}. It felt like the old days.',
        decline: '{npc} understood, but was clearly disappointed.',
      },
    },
    startup_outcome: {
      title: 'The Moment of Truth',
      text: 'Years of work later, {npc}’s company faces its make-or-break moment.',
      c: { push: 'Push for a stock listing', sell: 'Support selling to a bigger rival', cash_out: 'Ask to cash out your investment', stand_by: 'Simply stand by {npc}' },
      r: {
        push_ok: 'The listing was a triumph. Your shares are worth a fortune!',
        push_fail: 'Investors backed out at the last minute. The company folded and you lost your job.',
        sell: 'The sale went through. A comfortable payout, and you kept a job at the new owner.',
        cash_out_ok: 'Your investment paid off handsomely.',
        cash_out_fail: 'The company could not pay. Your investment is gone.',
        stand_by: 'Whatever happened with the company, your friendship came out stronger.',
      },
    },
    mentor_offer: {
      title: 'A Mentor Appears',
      text: '{npc}, a respected veteran at work, offers to mentor you.',
      c: { accept: 'Accept gratefully', decline: 'Politely decline', compete: 'Prove you do not need help' },
      r: {
        accept: 'Weekly coffees with {npc} are teaching you more than any course.',
        decline: '{npc} nodded. The offer was not repeated.',
        compete: 'You worked twice as hard to show you could do it alone. It was exhausting.',
      },
    },
    mentor_farewell: {
      title: 'Farewell Speech',
      text: '{npc} is retiring and has asked you to give the farewell speech.',
      c: { heartfelt: 'Speak from the heart', funny: 'Make it funny', decline: 'Say you are not good at speeches' },
      r: {
        heartfelt_ok: 'There was not a dry eye in the room. {npc} hugged you for a long time.',
        heartfelt_fail: 'You got emotional and lost your place. {npc} appreciated it anyway.',
        funny_ok: 'The room was in stitches, {npc} most of all.',
        funny_fail: 'One joke landed badly. Very badly.',
        decline: '{npc} was hurt, though too polite to say so.',
      },
    },
    shady_investment: {
      title: 'MoonPenny',
      text: 'An acquaintance offers you an early spot in “MoonPenny”: early members get paid by the people who join later.',
      c: { buy_in: 'Buy in early', recruit: 'Buy in and recruit your friends', decline: 'Decline', report: 'Report it to the authorities' },
      r: {
        buy_in: 'Within weeks, your money more than doubled. Easy money… right?',
        recruit: 'Your friends joined and your payout was huge. Some of them are now asking questions.',
        decline: 'You kept your savings. It sounded too good to be true.',
        report: 'The scheme was shut down before it grew. Quietly, you saved a lot of people a lot of money.',
      },
    },
    moonpenny_probe: {
      title: 'Investigators at the Door',
      text: 'MoonPenny was a pyramid scheme. Investigators are contacting early members who profited.',
      c: { cooperate: 'Cooperate and pay back', lawyer: 'Hire a lawyer', deny: 'Deny everything', apologize: 'Repay the friends you recruited' },
      r: {
        cooperate: 'You returned the profits. It stung, but the matter was closed.',
        lawyer_ok: 'Your lawyer settled it quietly.',
        lawyer_fail: 'The court was not convinced. Heavy fines and a record.',
        deny_ok: 'They had bigger fish to fry. You got lucky.',
        deny_fail: 'Records showed everything. Huge fines, a criminal record and a damaged reputation.',
        apologize: 'You paid back the friends who trusted you. Most of them forgave you.',
      },
    },
    stress_habit: {
      title: 'Pressure',
      text: 'Deadlines are piling up. On a break, a coworker offers you a cigarette “to take the edge off”.',
      c: { smoke: 'Take it', run: 'Go for a run instead', vent: 'Call a friend to vent' },
      r: {
        smoke: 'It did take the edge off. Then you bought a pack. Then another.',
        run: 'You came back sweaty and clear-headed. It became a habit.',
        vent: 'Twenty minutes of complaining to someone who gets it. Better than any cigarette.',
      },
    },
    health_scare: {
      title: 'A Warning Sign',
      text: 'A cough that will not go away sends you to the doctor. The scan shows warning signs from years of smoking.',
      c: { quit: 'Quit for good', cut_down: 'Cut down a little', ignore: 'Ignore it' },
      r: {
        quit: 'The first weeks were hell. You did not give in.',
        cut_down: 'Fewer cigarettes. The cough stays.',
        ignore: 'You lit one on the way home. Your body keeps the score.',
      },
    },
    recovery_milestone: {
      title: 'Breathing Easy',
      text: 'Years without smoking. You climb stairs without wheezing, and the money you saved adds up.',
    },
    wedding_invite: {
      title: 'Save the Date',
      text: '{npc} is getting married and really wants you there.',
      c: { attend: 'Attend and celebrate', speech: 'Attend and give a toast', skip: 'Send a card instead' },
      r: {
        attend: 'You danced until your feet hurt. {npc} was glowing.',
        speech_ok: 'Your toast made the whole room laugh and then cry. Perfect.',
        speech_fail: 'You told the wrong story. The in-laws did not laugh.',
        skip: '{npc} noticed your absence.',
      },
    },
    car_breakdown: {
      title: 'Smoke Under the Hood',
      text: 'Your car died on the highway, smoke pouring from under the hood.',
      c: { repair: 'Pay a mechanic', diy: 'Watch tutorials and fix it yourself', sell: 'Sell it for scrap' },
      r: {
        repair: 'Expensive, but it runs like new.',
        diy_ok: 'Three videos, two scraped knuckles and one working car. Victory.',
        diy_fail: 'You made it worse. The mechanic’s bill was even bigger.',
        sell: 'You sold it for parts. The bus is fine. Mostly.',
      },
    },
    boss_credit: {
      title: 'Stolen Credit',
      text: 'In a big meeting, your manager presents your project as their own.',
      c: { confront: 'Speak up in the meeting', let_go: 'Let it go', document: 'Keep records and speak up later' },
      r: {
        confront_ok: 'You calmly walked everyone through details only the author would know. People noticed.',
        confront_fail: 'It came across as an outburst. Your manager will not forget it.',
        let_go: 'You let it go. It still bothers you at night.',
        document: 'Your careful records reached the right people. Your next review was glowing.',
      },
    },
    layoffs: {
      title: 'Rumors of Layoffs',
      text: 'Whispers of layoffs are spreading through the company. Everyone is nervous.',
      c: { buyout: 'Volunteer for a severance package', harder: 'Work harder than ever', wait: 'Keep your head down' },
      r: {
        buyout: 'You took the money and walked out into the unknown.',
        harder_ok: 'You survived the cuts. Your boss noticed the effort.',
        harder_fail: 'It was not enough. Your position was cut.',
        wait_ok: 'The storm passed you by.',
        wait_fail: 'Your name was on the list.',
      },
    },
    side_business: {
      title: 'A Taste for Business',
      text: 'Friends keep raving about your cooking. Why not sell it at the weekend market?',
      c: { launch: 'Rent a market stall', catering: 'Cater one event for money', family: 'Keep it for family dinners' },
      r: {
        launch: 'You bought supplies, designed a little sign and opened your stall.',
        catering: 'Exhausting, but the clients loved it and paid well.',
        family: 'Sunday dinners became the highlight of the family’s week.',
      },
    },
    market_success: {
      title: 'A Line Around the Block',
      text: 'Your weekend stall has a line around the block. A restaurant group is sniffing around.',
      c: { expand: 'Open a real restaurant', steady: 'Keep it small and steady', sell_recipe: 'Sell the recipe to the restaurant group' },
      r: {
        expand_ok: 'The restaurant became a neighborhood favorite. You built something real.',
        expand_fail: 'Rent and staff costs crushed you. You closed within a year.',
        steady: 'A nice side income and happy regulars.',
        sell_recipe: 'A generous check. The secret recipe is not a secret anymore.',
      },
    },
    sibling_loan: {
      title: 'A Favor',
      text: '{npc} asks to borrow {amount} to cover rent this month.',
      c: { lend: 'Lend the money', refuse: 'Say no', help_job: 'Help {npc} find better work instead' },
      r: {
        lend: '{npc} promised to pay you back soon.',
        refuse: '{npc} hung up angry.',
        help_job: 'You polished {npc}’s résumé and made calls. It meant a lot.',
      },
    },
    sibling_repay: {
      title: 'An Envelope',
      text: '{npc} shows up at your door with an envelope and a sheepish smile.',
      c: { accept: 'Open it', forgive: 'Tell {npc} to keep it' },
      r: {
        accept_ok: 'The full amount, plus a little extra “for interest”. You laughed together.',
        accept_fail: 'Inside: an IOU and a drawing of a dollar sign. You are not sure whether to laugh.',
        forgive: '{npc} hugged you. Some things are worth more than money.',
      },
    },
    sibling_reckoning: {
      title: 'An Old Grudge',
      text: 'At a family dinner, {npc} brings up the broken window from your childhood: “You let me take the blame.”',
      c: { apologize: 'Apologize sincerely', laugh: 'Try to laugh it off', deny: 'Deny it ever happened' },
      r: {
        apologize: 'Decades late, but {npc} accepted. Something heavy lifted.',
        laugh_ok: 'Everyone laughed, {npc} too. Old wounds can heal.',
        laugh_fail: '{npc} did not find it funny. Dinner ended early.',
        deny: '{npc} stared at you in disbelief. The rift grew deeper.',
      },
    },
    parent_illness: {
      title: 'Needing Help',
      text: '{npc} has been unwell and needs more help at home.',
      c: { care: 'Take care of {npc} yourself', pay: 'Pay for professional care', visit: 'Visit when you can' },
      r: {
        care: 'Exhausting weeks, slow recovery, long conversations. You grew closer than ever.',
        pay: 'A caregiver now visits daily. {npc} is comfortable.',
        visit: 'You visit on weekends. You wish it were more.',
      },
    },
    parent_funeral: {
      title: 'Saying Goodbye',
      text: 'The family gathers to say goodbye to {npc}.',
      c: { eulogy: 'Give the eulogy', quiet: 'Grieve quietly', reconcile: 'Make peace with your sibling' },
      r: {
        eulogy_ok: 'Your words captured {npc} perfectly. People thanked you for weeks.',
        eulogy_fail: 'You could barely get the words out. Everyone understood.',
        quiet: 'You stood at the back and remembered.',
        reconcile: 'Grief opened a door. You and your sibling talked for the first time in years.',
      },
    },
    marathon: {
      title: 'The City Marathon',
      text: 'The city marathon is in six months. Your friends dare you to sign up.',
      c: { train: 'Train for the full marathon', fun_run: 'Do the 5 km fun run', couch: 'Watch from the couch' },
      r: {
        train_ok: 'Forty-two kilometers. You crossed the line in tears. You are a marathoner!',
        train_fail: 'You pulled a muscle at kilometer 28. Next year.',
        fun_run: 'Medal, banana, sunshine. A good day.',
        couch: 'You cheered from the couch. With snacks.',
      },
    },
    jury_duty: {
      title: 'Jury Duty',
      text: 'An official letter arrives: you have been summoned for jury duty.',
      c: { serve: 'Serve', excuse: 'Try to get excused' },
      r: {
        serve: 'Long days, a hard decision, and a new respect for how justice works.',
        excuse_ok: 'Your excuse was accepted.',
        excuse_fail: 'The judge was not impressed. You served anyway, grumbling.',
      },
    },
    midlife_crisis: {
      title: 'Is This It?',
      text: 'You wake up one morning wondering whether this is all there is.',
      c: { car: 'Buy a flashy car', learn: 'Learn something completely new', sabbatical: 'Take a year off', therapy: 'Start therapy' },
      r: {
        car: 'It is shiny, fast and absolutely ridiculous. You love it.',
        learn: 'You signed up for music lessons. Your neighbors are being patient.',
        sabbatical: 'You quit and spent a year walking, reading and resting. You feel like yourself again.',
        therapy: 'Slowly, you learned to be kinder to yourself. Setbacks hurt less now.',
      },
    },
    school_reunion: {
      title: 'Class Reunion',
      text: 'Twenty-odd years later, your old class is having a reunion.',
      c: { attend: 'Go and reconnect', apologize: 'Find the kid you once teased', brag: 'Go and impress everyone', skip: 'Skip it' },
      r: {
        attend: 'Same faces, more wrinkles. You laughed until your cheeks hurt.',
        apologize: 'You apologized for something from decades ago. They were surprised, then grateful.',
        brag_ok: 'Everyone wanted to hear about your life.',
        brag_fail: 'People rolled their eyes when you turned away.',
        skip: 'You saw the photos online. It looked fun.',
      },
    },
    adopt_cat: {
      title: 'An Uninvited Guest',
      text: 'A cat has claimed your doorstep and refuses to leave.',
      c: { adopt: 'Let the cat in', shelter: 'Take it to a shelter' },
      r: {
        adopt: 'The cat moved in, took the best chair and allowed you to call it {npc}.',
        shelter: 'The shelter found it a home within a week.',
      },
    },
    burnout: {
      title: 'Running on Empty',
      text: 'You dread every workday. Sleep does not help anymore.',
      c: { leave: 'Take medical leave', push: 'Push through', quit: 'Quit your job' },
      r: {
        leave: 'A few weeks off. Slowly, the color came back into the world.',
        push: 'You kept going. Your body and mood are paying the price.',
        quit: 'You walked out. For the first time in years, you slept well.',
      },
    },
    home_renovation: {
      title: 'Renovation Fever',
      text: 'Your home could really use a renovation.',
      c: { diy: 'Do it yourself', contractor: 'Hire a contractor', leave: 'Leave it as it is' },
      r: {
        diy_ok: 'It took months, but the result is beautiful and you built it.',
        diy_fail: 'You flooded the bathroom. The repair bill was painful.',
        contractor: 'Expensive, but the place feels brand new.',
        leave: 'The leaky faucet continues its eternal song.',
      },
    },
    grandchild: {
      title: 'A New Generation',
      text: '{npc} has had a baby. You are a grandparent!',
    },
    child_school_trouble: {
      title: 'A Call from School',
      text: 'The school calls: {npc} got into trouble today.',
      c: { talk: 'Sit down and listen', punish: 'Ground them for a month', ignore: 'Kids will be kids' },
      r: {
        talk: 'It turned out something was wrong at school. {npc} is grateful you listened.',
        punish: '{npc} served the sentence, and slammed a lot of doors.',
        ignore: '{npc} wonders whether you even care.',
      },
    },
    child_college: {
      title: 'Accepted!',
      text: '{npc} has been accepted to university. Tuition is expensive.',
      c: { pay: 'Pay for everything', half: 'Pay for half', own_way: 'They must find their own way' },
      r: {
        pay: '{npc} cried and promised to make you proud.',
        half: '{npc} will take a loan for the rest, but is grateful.',
        own_way: '{npc} understood, but it will be a hard few years.',
      },
    },
    lottery_scratch: {
      title: 'Lucky Card',
      text: 'A scratch card tucked into a birthday card turned out to be a winner!',
    },
    noisy_neighbors: {
      title: 'Party Next Door',
      text: 'The new neighbors throw loud parties every night.',
      c: { complain: 'Knock and complain', join: 'If you can’t beat them…', earplugs: 'Buy earplugs' },
      r: {
        complain_ok: 'They apologized and turned it down. Peace returns.',
        complain_fail: 'They turned the music up. Petty war declared.',
        join: 'Great people, terrible music. You slept until noon.',
        earplugs: 'You sleep, mostly.',
      },
    },
    retirement_offer: {
      title: 'One Last Year?',
      text: 'Your colleagues ask whether this will be your last year of work.',
      c: { retire: 'Yes, time to retire', continue: 'Not yet' },
      r: {
        retire: 'A party, a cake, a card signed by everyone. A new chapter begins.',
        continue: 'You still have plenty to give. Everyone is glad you stayed.',
      },
    },
    blackout: {
      title: 'Blackout',
      text: 'A city-wide blackout. You spent the evening playing cards by candlelight with your neighbors.',
    },
    record_surfaces: {
      title: 'An Old Report',
      text: 'During a background check for a new opportunity, the old shoplifting report from your teenage years shows up.',
      c: { explain: 'Explain it honestly', hide: 'Say it must be a mistake' },
      r: {
        explain_ok: 'They appreciated your honesty. It was a long time ago, after all.',
        explain_fail: 'They were polite, but you could feel the doubt.',
        hide_ok: 'Nobody looked further.',
        hide_fail: 'They checked. Being caught lying was much worse than the candy bar.',
      },
    },
    old_secret: {
      title: 'The Corner Store',
      text: 'The corner store you once swiped a candy bar from is closing after forty years.',
      c: { pay_back: 'Leave an envelope with money and a note', souvenir: 'Buy something on the last day', walk_by: 'Walk past' },
      r: {
        pay_back: 'You never knew whether the owner read the note. You felt lighter anyway.',
        souvenir: 'You bought a candy bar and paid for it this time.',
        walk_by: 'The old sign came down a week later.',
      },
    },
    parent_advice: {
      title: 'Just Because',
      text: '{npc} called just to say how proud they are of you.',
    },
    friend_moves_away: {
      title: 'Moving Away',
      text: '{npc} is moving to another city for good.',
      c: { promise: 'Promise to keep in touch', party: 'Throw a farewell party', shrug: 'People come and go' },
      r: {
        promise: 'You set up a monthly call. Let us see if it lasts.',
        party: 'A night of stories and hugs. {npc} left with a full heart.',
        shrug: '{npc} noticed how little you seemed to care.',
      },
    },
    relocation_offer: {
      title: 'A Bigger Role, Far Away',
      text: 'Your company offers you a promotion, but it means moving to another city.',
      c: { accept: 'Take the promotion and move', decline: 'Stay near the people you love' },
      r: {
        accept: 'New city, new title. You miss your people more than you expected.',
        decline: 'Your boss respected the choice. Your family was relieved.',
      },
    },
    bad_flu: {
      title: 'Knocked Out',
      text: 'A nasty flu kept you in bed for two weeks.',
    },
    hobby_spotlight: {
      title: 'Talent Noticed',
      text: 'Years of practice paid off: a local club invited you to show your work.',
    },

    // ── Later life ──────────────────────────────────────────────────────────
    retirement_hobby: {
      title: 'Endless Weekends',
      text: 'Retirement means every day is yours. How will you spend them?',
      c: { garden: 'Start a garden', travel: 'Travel', volunteer: 'Volunteer in the community' },
      r: {
        garden: 'Your tomatoes are the envy of the street.',
        travel: 'Places you only knew from postcards, finally in person.',
        volunteer: 'People in the neighborhood now know you by name.',
      },
    },
    grandkid_visit: {
      title: 'The Grandkids Are Coming',
      text: 'Your grandchildren are spending the weekend with you.',
      c: { teach: 'Teach them something you love', spoil: 'Spoil them rotten', nap: 'Let them watch TV while you nap' },
      r: {
        teach: 'They will remember this weekend for a long time.',
        spoil: 'Ice cream for breakfast. Their parents were not thrilled.',
        nap: 'Everyone was happy, especially you.',
      },
    },
    scam_call: {
      title: 'Urgent Call from “Your Bank”',
      text: 'A caller says your bank account is in danger and asks for your security code.',
      c: { give: 'Give them the code', hang_up: 'Hang up', call_family: 'Call family to check' },
      r: {
        give: 'It was a scam. A chunk of your savings vanished.',
        hang_up: 'You hung up. Your real bank later confirmed it was a scam.',
        call_family: 'Your family helped you report the scam and stayed on the phone for an hour.',
      },
    },
    memoir: {
      title: 'Your Story',
      text: 'You have lived a lot. Maybe it is time to write it down.',
      c: { write: 'Write a memoir', record: 'Record stories for the family', no: 'Some things are better left unwritten' },
      r: {
        write: 'Page after page, your life came back to you.',
        record: 'Your family now has hours of your stories, in your voice.',
        no: 'You keep your memories to yourself.',
      },
    },
    memoir_published: {
      title: 'A Publisher Calls',
      text: 'A small publisher read your manuscript and loved it.',
      c: { publish: 'Publish it', family_only: 'Print copies only for family' },
      r: {
        publish: 'Your book is on a shelf in the local bookstore. People ask you to sign it.',
        family_only: 'Each family member got a bound copy. It is their most treasured book.',
      },
    },
    fall_injury: {
      title: 'A Bad Fall',
      text: 'You slipped on the stairs. Recovery is slow at this age.',
    },
    old_friend_letter: {
      title: 'A Letter',
      text: 'A handwritten letter arrives from {npc}. It begins: “Remember the lunch table?”',
      c: { visit: 'Travel to visit {npc}', reply: 'Write a long reply', keep: 'Keep the letter close' },
      r: {
        visit: 'You sat on a porch together for an afternoon, children again for a few hours.',
        reply: 'You wrote ten pages. {npc} wrote back twelve.',
        keep: 'You read it every few days.',
      },
    },
    mentor_young: {
      title: 'Passing It On',
      text: 'A young person in your neighborhood is struggling to choose a path. You remember someone who once helped you.',
      c: { mentor: 'Offer to mentor them', advice: 'Share a piece of advice', busy: 'You are too tired for this' },
      r: {
        mentor: 'Weekly chats, slow progress, real gratitude. The circle closes.',
        advice: 'One sentence of yours stuck with them for years.',
        busy: 'Maybe someone else will help.',
      },
    },
    downsizing: {
      title: 'Too Much House',
      text: 'The house feels huge and the stairs feel steep.',
      c: { sell: 'Sell and move somewhere smaller', stay: 'Stay with your memories' },
      r: {
        sell: 'You sold the house and moved somewhere small and cozy. The money is welcome.',
        stay: 'Every room holds a story. You are staying.',
      },
    },
    tech_class: {
      title: 'Smartphones for Beginners',
      text: 'The library offers a free class: “Smartphones for beginners”.',
      c: { enroll: 'Sign up', refuse: 'You managed fine without them' },
      r: {
        enroll: 'You can now send video calls. And far too many emojis.',
        refuse: 'Your grandchildren will keep printing photos for you.',
      },
    },
    centenarian_party: {
      title: 'One Hundred',
      text: 'Your one hundredth birthday! The local newspaper sent a photographer.',
    },
    pet_old_age: {
      title: 'Gray Muzzle',
      text: '{npc} has grown old and slow, but still waits by the door for you every day.',
      c: { beach: 'Give {npc} one perfect last day', vet: 'Pay for treatment to buy more time' },
      r: {
        beach: 'A day at the beach, a whole sausage, a long nap in the sun. {npc} passed away peacefully that night.',
        vet: 'The treatment gave {npc} more good days.',
      },
    },
    pet_goodbye: {
      title: 'Goodbye, Old Friend',
      text: '{npc} passed away peacefully, curled up in a favorite spot.',
    },
    time_capsule_open: {
      title: 'Twenty Years Later',
      text: 'Your old class gathers to dig up the time capsule. Inside, among faded drawings, you find {item}.',
      c: { dream_lived: 'Realize you became what you dreamed of', laugh: 'Laugh at your younger self', new_dream: 'Let it inspire a new dream' },
      r: {
        dream_lived: 'Your younger self would be so proud. You held it and grinned for an hour.',
        laugh: 'You and your classmates laughed until you cried.',
        new_dream: 'It reminded you that it is never too late to want something new.',
      },
    },
    neighbor_legacy: {
      title: 'A Letter from the Past',
      text: 'News arrives that {npc}, the neighbor you once helped, has passed away. They left you their old piano and a note: “For the kid with the kind heart.”',
      c: { keep: 'Keep the piano', sell: 'Sell the piano', donate: 'Donate it to the school' },
      r: {
        keep: 'You play it badly and often. It feels like a conversation.',
        sell: 'The money helps. You kept the note.',
        donate: 'The school named the music room after {npc}.',
      },
    },
    sunset_walk: {
      title: 'Evening Walk',
      text: 'You took a slow walk at sunset and noticed everything: birds, kids, the smell of rain.',
    },
    old_photos: {
      title: 'Old Photographs',
      text: 'Going through old photos, you found one of you and your childhood friend at the lunch table.',
    },
  },
} as const;
