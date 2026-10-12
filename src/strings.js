// Textos de la web en los dos idiomas. Para cambiar un texto, se edita aquí y se ejecuta `node build.js`.
module.exports = {
  es: {
    lang: 'es',
    path: '/',
    other: { code: 'en', label: 'English', short: 'EN', href: '/en/' },
    title: 'Atempo Psychology · Adelina Arocena, psicóloga clínica online',
    description: 'Clínica de psicología online en español e inglés con Adelina Arocena: terapia individual, de pareja y sexual para adultos, estés donde estés.',
    skip: 'Saltar al contenido',
    nav: { about: 'Sobre mí', help: 'Terapia', fees: 'Honorarios', faq: 'Preguntas', contact: 'Primera consulta' },
    hero: {
      term: 'a tempo',
      gram: '(it.) loc. musical',
      def: 'Indicación que pide volver al tiempo original después de haberlo acelerado o detenido.',
      title: 'Clínica de psicología online para volver a <em>tu propio ritmo.</em>',
      lead: 'Soy Adelina Arocena, psicóloga clínica, sexóloga y terapeuta de pareja. Acompaño a adultos y parejas en español y en inglés, estés donde estés.',
      cta: 'Pedir una primera consulta',
      ctaFree: 'Reservar llamada gratuita de {n} min',
      facts: ['Online, por videollamada', 'Español e inglés', 'Adultos y parejas', 'Sesiones de 50 min'],
      cta2: 'Cómo trabajo',
      photo: 'Foto de Adelina',
      caption: 'Adelina Arocena, fundadora de Atempo',
      bpm: 'el pulso de alguien en calma'
    },
    about: {
      kicker: 'Sobre mí',
      title: 'Nací en Estados Unidos, crecí entre raíces uruguayas y llevo diez años viviendo en España.',
      p1: 'He vivido en varios países y sé lo que es empezar de cero lejos de lo conocido. Por eso trabajo con personas de todas partes del mundo, en el idioma en el que mejor puedan expresarse: español o inglés.',
      p2: 'Dar el paso de escribir a una psicóloga por primera vez puede ser difícil. Mi trabajo empieza ahí: que desde el primer mensaje sientas un espacio cálido y seguro. Entiendo la terapia como un trabajo en equipo, en el que vamos comprendiendo juntos tu historia, tus recursos y lo que necesitas ahora.',
      credsTitle: 'Formación',
      approachTitle: 'Enfoques',
      creds: ['Grado en Psicología', 'Máster en Psicología Clínica', 'Máster en Sexología, Terapia Sexual y Terapia de Pareja'],
      quoteTitle: '¿Por qué Atempo?',
      quote: 'Atempo nace del ritmo, del equilibrio y de volver a tu propio paso. También es un pequeño juego con “a tiempo”. Quería una marca que se sintiera mía y que reflejara cómo ha crecido mi práctica y los valores que la guían: un lugar de conexión, crecimiento y calidez, donde bajar el ritmo, entenderte mejor y avanzar hacia un cambio que tenga sentido para ti.',
      quoteBy: 'Adelina, fundadora de Atempo'
    },
    help: {
      kicker: 'Terapia',
      title: 'En qué te puedo acompañar',
      services: [
        { n: 'I', name: 'Terapia individual', text: 'Para adultos que se sienten desbordados, estancados o simplemente con ganas de cambiar algo. Un espacio para entenderte y moverte con más calma por lo que estás viviendo.' },
        { n: 'II', name: 'Terapia de pareja', text: 'Para parejas que quieren volver a escucharse: conflictos que se repiten, distancia, cambios de etapa o decisiones difíciles.' },
        { n: 'III', name: 'Terapia sexual', text: 'Para hablar de sexualidad sin vergüenza y con rigor clínico, en solitario o en pareja.' }
      ],
      listTitle: 'Suelo acompañar a personas que quieren trabajar:',
      list: ['Trauma y duelo', 'Ansiedad', 'Estrés y sensación de desborde', 'Autoestima y confianza en ti', 'Problemas de pareja', 'Rupturas', 'Poner límites', 'Regulación emocional', 'Cambios vitales y adaptación', 'Crecimiento personal'],
      forTitle: 'Y muchas veces, con',
      forList: ['personas expatriadas', 'parejas', 'introvertidos', 'extrovertidos']
    },
    steps: {
      kicker: 'Cómo es empezar',
      title: 'Cómo organizaremos tu proceso de terapia',
      items: [
        { t: 'Me escribes', d: 'Rellenas el formulario con lo básico y te respondo para coordinar la primera sesión.' },
        { t: 'Nos conocemos', d: 'En la primera sesión me cuentas qué te trae y vemos si encajamos.' },
        { t: 'Hacemos un plan', d: 'Definimos juntas o juntos hacia dónde quieres ir y a qué ritmo.' },
        { t: 'Trabajamos', d: 'Sesiones online de 50 minutos, adaptadas a lo que vas necesitando.' },
        { t: 'Lo notas', d: 'Revisamos el camino de vez en cuando para que el cambio se sienta en tu vida, no solo en la consulta.' }
      ]
    },
    fees: {
      kicker: 'Honorarios',
      title: 'Sesiones online de 50 minutos',
      items: [
        { name: 'Terapia individual', price: '65 €' },
        { name: 'Terapia de pareja', price: '75 €' },
        { name: 'Terapia sexual', price: '65 €' }
      ],
      note: 'Todas las sesiones son online, en español o en inglés.',
      hoursTitle: 'Horario',
      cancelTitle: 'Cancelaciones',
      cancel: 'Puedes cancelar o cambiar tu cita sin coste avisando con {n} horas de antelación.'
    },
    faq: {
      kicker: 'Preguntas',
      title: 'Lo que suele preguntarse antes de empezar',
      items: [
        { q: '¿La terapia online funciona igual que la presencial?', a: 'Para la mayoría de las personas, sí. La investigación muestra que la terapia online puede ser tan eficaz como la presencial, y te ahorra desplazamientos: solo necesitas un dispositivo, buena conexión y un sitio donde hablar con tranquilidad. No es lo indicado para todo el mundo; si tienes dudas, escríbeme y lo valoramos.' },
        { q: '¿En qué idioma son las sesiones?', a: 'En español o en inglés, los dos son mis idiomas nativos. Puedes elegir el que te resulte más cómodo, o combinar los dos.' },
        { q: '¿Atiendes a menores?', a: 'No. Atempo trabaja solo con personas mayores de 18 años.' },
        { q: '¿Desde qué países puedo hacer terapia contigo?', a: 'Estés donde estés, aquí estoy para ti.' },
        { q: '¿Y si tengo una emergencia?', a: 'Atempo no es un servicio de urgencias. Si tu vida o la de otra persona corre peligro, llama al 112 o al número de emergencias de tu país. En España también puedes llamar al 024, la línea de atención a la conducta suicida, gratuita y disponible las 24 horas.' }
      ]
    },
    contact: {
      kicker: 'Primera consulta',
      title: 'Si has llegado hasta aquí, <em>bienvenida, bienvenido.</em>',
      lead: 'Cuéntame lo básico y te escribo para coordinar la primera sesión. No hace falta que lo expliques todo ahora.',
      crisis: 'Atempo no es un servicio de urgencias. Si estás en peligro, llama al 112 o al número de emergencias de tu país (en España, también al 024).',
      name: 'Nombre', email: 'Correo electrónico', phone: 'Teléfono (opcional)', where: 'País o ciudad desde donde te conectarías (opcional)',
      type: '¿Qué tipo de terapia buscas?', typeOpts: ['Individual', 'De pareja', 'Sexual', 'Aún no lo sé'],
      language: 'Idioma de las sesiones', langOpts: ['Español', 'Inglés', 'Los dos'],
      message: 'En pocas palabras, ¿qué te gustaría trabajar?', messageHint: 'Opcional. No incluyas detalles que prefieras contar en sesión.',
      adult: 'Soy mayor de 18 años',
      privacy: 'He leído la <a href="/{{lp}}privacidad.html">política de privacidad</a> y acepto que se usen estos datos solo para responderme.',
      send: 'Enviar', sending: 'Enviando…',
      ok: 'Gracias. He recibido tu mensaje y te responderé lo antes posible.',
      fail: 'No se ha podido enviar. Escríbeme directamente a',
      direct: 'También puedes escribirme a'
    },
    footer: {
      line: 'Clínica de psicología online en español e inglés.',
      legal: 'Aviso legal y privacidad',
      top: 'Volver arriba'
    },
    motion: { pause: 'Pausar movimiento', play: 'Reanudar movimiento' }
  },

  en: {
    lang: 'en',
    path: '/en/',
    other: { code: 'es', label: 'Español', short: 'ES', href: '/' },
    title: 'Atempo Psychology · Adelina Arocena, online clinical psychologist',
    description: 'Online psychology clinic in English and Spanish with Adelina Arocena: individual, couples and sex therapy for adults, wherever you are.',
    skip: 'Skip to content',
    nav: { about: 'About', help: 'Therapy', fees: 'Fees', faq: 'FAQ', contact: 'Book a first session' },
    hero: {
      term: 'a tempo',
      gram: '(It.) musical direction',
      def: 'A marking that asks the player to return to the original pace after it has sped up or slowed down.',
      title: 'Online psychology clinic to find <em>your own pace again.</em>',
      lead: 'I’m Adelina Arocena, a clinical psychologist, sexologist and couples therapist. I work with adults and couples in English and Spanish, wherever you are.',
      cta: 'Book a first session',
      ctaFree: 'Book a free {n}-min call',
      facts: ['Online, by video call', 'English and Spanish', 'Adults and couples', '50-minute sessions'],
      cta2: 'How I work',
      photo: 'Photo of Adelina',
      caption: 'Adelina Arocena, founder of Atempo',
      bpm: 'the pulse of someone at rest'
    },
    about: {
      kicker: 'About me',
      title: 'Born in the USA, raised with Uruguayan roots, and living in Spain for the past ten years.',
      p1: 'I’ve lived in several countries and I know what it takes to start over far from everything familiar. That’s why I work with people from all over the world, in whichever language lets them express themselves: English or Spanish.',
      p2: 'Reaching out to a therapist for the first time can be difficult. My work starts right there: making the space feel warm and safe from your very first message. I see therapy as a collaboration, where we build an understanding of your story, your strengths and what you need right now.',
      credsTitle: 'Training',
      approachTitle: 'Approaches',
      creds: ['Bachelor’s in Psychology', 'Master’s in Clinical Psychology', 'Master’s in Sexology, Sex Therapy and Couples Therapy'],
      quoteTitle: 'Why Atempo?',
      quote: 'Atempo is inspired by rhythm, balance and returning to your own pace, and it’s also a gentle play on “a tiempo”, Spanish for “in time”. I wanted a brand that felt personal to me and reflected how my practice has grown and the values that guide it: a place of connection, growth and warmth, where people can slow down, understand themselves better and move towards meaningful change.',
      quoteBy: 'Adelina, founder of Atempo'
    },
    help: {
      kicker: 'Therapy',
      title: 'How I can help',
      services: [
        { n: 'I', name: 'Individual therapy', text: 'For adults who feel overwhelmed, stuck, or simply ready for something to change. A space to understand yourself and move through what you’re living with more ease.' },
        { n: 'II', name: 'Couples therapy', text: 'For couples who want to hear each other again: recurring conflict, distance, new life stages or hard decisions.' },
        { n: 'III', name: 'Sex therapy', text: 'To talk about sexuality without shame and with clinical care, on your own or as a couple.' }
      ],
      listTitle: 'I commonly support clients experiencing:',
      list: ['Trauma and loss', 'Anxiety', 'Stress and overwhelm', 'Self-esteem and confidence', 'Relationship problems', 'Breakups', 'Setting boundaries', 'Emotional regulation', 'Life transitions', 'Personal growth'],
      forTitle: 'And often, with',
      forList: ['expats', 'couples', 'introverts', 'extroverts']
    },
    steps: {
      kicker: 'Getting started',
      title: 'How we’ll organise your therapy process',
      items: [
        { t: 'You get in touch', d: 'Fill in the short form and I’ll reply to arrange your first session.' },
        { t: 'We meet', d: 'In the first session you tell me what brings you here and we see if we’re a good fit.' },
        { t: 'We make a plan', d: 'Together we set where you want to go, and at what pace.' },
        { t: 'We do the work', d: '50-minute online sessions, adapted to what you need along the way.' },
        { t: 'You feel it', d: 'We check in on the path now and then, so the change shows up in your life, not just in the session.' }
      ]
    },
    fees: {
      kicker: 'Fees',
      title: '50-minute online sessions',
      items: [
        { name: 'Individual therapy', price: '€65' },
        { name: 'Couples therapy', price: '€75' },
        { name: 'Sex therapy', price: '€65' }
      ],
      note: 'All sessions are held online, in English or Spanish.',
      hoursTitle: 'Hours',
      cancelTitle: 'Cancellations',
      cancel: 'You can cancel or move your appointment free of charge with {n} hours’ notice.'
    },
    faq: {
      kicker: 'FAQ',
      title: 'What people usually ask before starting',
      items: [
        { q: 'Does online therapy work as well as in person?', a: 'For most people, yes. Research shows online therapy can be just as effective as in-person therapy, and it saves you the commute: all you need is a device, a stable connection and a quiet place to talk. It isn’t right for everyone, so if you’re unsure, write to me and we’ll talk it through.' },
        { q: 'What language are sessions in?', a: 'English or Spanish, both are my native languages. Choose whichever feels more comfortable, or use both.' },
        { q: 'Do you see under-18s?', a: 'No. Atempo works only with adults aged 18 and over.' },
        { q: 'Which countries can I join from?', a: 'Wherever you are, I’m here for you.' },
        { q: 'What if I have an emergency?', a: 'Atempo is not a crisis service. If your life or someone else’s is at risk, call 112 or your local emergency number. In Spain you can also call 024, a free 24-hour suicide prevention line.' }
      ]
    },
    contact: {
      kicker: 'First session',
      title: 'If you’ve made it this far, <em>welcome.</em>',
      lead: 'Tell me the basics and I’ll write back to arrange a first session. You don’t need to explain everything now.',
      crisis: 'Atempo is not a crisis service. If you are in danger, call 112 or your local emergency number (in Spain, also 024).',
      name: 'Name', email: 'Email', phone: 'Phone (optional)', where: 'Country or city you’d join from (optional)',
      type: 'What kind of therapy are you looking for?', typeOpts: ['Individual', 'Couples', 'Sex therapy', 'Not sure yet'],
      language: 'Session language', langOpts: ['English', 'Spanish', 'Both'],
      message: 'In a few words, what would you like to work on?', messageHint: 'Optional. Leave out anything you’d rather share in session.',
      adult: 'I am 18 or older',
      privacy: 'I have read the <a href="/{{lp}}privacy.html">privacy policy</a> and agree to this data being used only to reply to me.',
      send: 'Send', sending: 'Sending…',
      ok: 'Thank you. I’ve received your message and will reply as soon as I can.',
      fail: 'Something went wrong. Please write to me directly at',
      direct: 'You can also write to me at'
    },
    footer: {
      line: 'Online psychology clinic in English and Spanish.',
      legal: 'Legal notice and privacy',
      top: 'Back to top'
    },
    motion: { pause: 'Pause motion', play: 'Resume motion' }
  }
};
