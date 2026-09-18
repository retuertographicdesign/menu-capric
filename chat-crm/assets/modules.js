/* ============================================================
   CONTENIDO DE LOS 9 MÓDULOS DE CHAT CRM
   ------------------------------------------------------------
   Este archivo es el "contenido" de la web: si mañana cambia una
   funcionalidad, se edita aquí y la página se actualiza sola.
   El diseño vive en index.html / assets/site.css.

   Cada módulo tiene:
     key    identificador interno
     icon   SVG en línea (24x24, trazo)
     es/en  name  → etiqueta de la pestaña
            short → frase corta (rejilla "Todo en un solo panel")
            title → titular del bloque de detalle
            sub   → subtítulo del bloque
            cards → tarjetas de detalle [{t: título, p: texto}]
            chips → (opcional) etiquetas sueltas: canales, plugins…
   ============================================================ */

const ICONS = {
  inbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  channels:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  widget:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h6M7 12h4"/></svg>',
  bots:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 2h6"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/><path d="M2 13v3M22 13v3"/></svg>',
  ai:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4L12 3z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z"/></svg>',
  kb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h5"/></svg>',
  tickets:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 5v2M13 11v2M13 17v2"/></svg>',
  campaigns:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 5.5a9 9 0 0 1 0 13"/></svg>',
  integrations:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 10v4.5A1.5 1.5 0 0 0 8 16h6"/><path d="M14 6.5h3.5A1.5 1.5 0 0 1 19 8v3"/></svg>',
};

const MODULES = [
  {
    key:'inbox', icon:ICONS.inbox,
    es:{
      name:'Bandeja compartida',
      short:'Todos los canales en un único inbox de equipo.',
      title:'Bandeja de entrada compartida',
      sub:'El centro de trabajo del equipo, en tiempo real.',
      cards:[
        {t:'Conexión de canales', p:'Se conectan en pocos clics. Admite varias cuentas de una misma red: varias páginas de Facebook, cuentas de Instagram o números de WhatsApp.'},
        {t:'Agentes por canal', p:'Cada canal puede tener asignados sus propios agentes para mantener la atención ordenada.'},
        {t:'Colaboración en equipo', p:'Varios miembros trabajan sobre las mismas conversaciones, se traspasan chats y se enrutan al departamento adecuado.'},
        {t:'Notas internas', p:'Notas y mensajes privados entre agentes para coordinarse sin que el cliente lo vea.'},
        {t:'Respuestas con IA', p:'Genera respuestas con el contexto de la conversación y reescribe, amplía, acorta o corrige tono y ortografía.'},
        {t:'Respuestas guardadas', p:'Las respuestas frecuentes se guardan y se insertan en segundos.'},
        {t:'Voz, capturas y vídeo', p:'Notas de voz, capturas de pantalla, screencasts, texto a voz y transcripción de audios.'},
        {t:'Organización', p:'Etiquetas, campos personalizados, fijar o silenciar chats y bloquear visitantes molestos.'}
      ]
    },
    en:{
      name:'Shared inbox',
      short:'Every channel in a single team inbox.',
      title:'Shared team inbox',
      sub:'The team’s workspace, in real time.',
      cards:[
        {t:'Channel connection', p:'Connected in a few clicks. Supports several accounts on the same network: multiple Facebook pages, Instagram accounts or WhatsApp numbers.'},
        {t:'Agents per channel', p:'Each channel can have its own assigned agents to keep support organised.'},
        {t:'Team collaboration', p:'Several members work on the same conversations, hand chats over and route them to the right department.'},
        {t:'Internal notes', p:'Private notes and messages between agents, so they can coordinate without the customer seeing it.'},
        {t:'AI replies', p:'Generates answers using the conversation context, and rewrites, expands, shortens or fixes tone and spelling.'},
        {t:'Saved replies', p:'Frequent answers are stored and inserted in seconds.'},
        {t:'Voice, screenshots and video', p:'Voice notes, screenshots, screencasts, text to speech and audio transcription.'},
        {t:'Organisation', p:'Tags, custom fields, pinning or muting chats and blocking troublesome visitors.'}
      ]
    }
  },
  {
    key:'channels', icon:ICONS.channels,
    es:{
      name:'Canales',
      short:'WhatsApp, Instagram, Messenger, SMS, Telegram y más.',
      title:'Todos los canales que ya usan tus clientes',
      sub:'Cada mensaje llega a la misma bandeja, venga de donde venga.',
      cards:[
        {t:'Chat web', p:'Widget propio configurable.'},
        {t:'WhatsApp Business', p:'Atención, pedidos y avisos.'},
        {t:'Messenger', p:'Integrado con páginas de Facebook.'},
        {t:'Instagram DM', p:'Mensajes de la cuenta de empresa.'},
        {t:'SMS (Twilio)', p:'Llega incluso sin internet.'},
        {t:'Telegram', p:'Mensajería rápida y privada.'},
        {t:'Viber · LINE', p:'Europa del Este, Japón y Asia.'},
        {t:'WeChat · Zalo', p:'China y Vietnam.'},
        {t:'Canal API', p:'Cualquier otra plataforma o app propia.'}
      ]
    },
    en:{
      name:'Channels',
      short:'WhatsApp, Instagram, Messenger, SMS, Telegram and more.',
      title:'Every channel your customers already use',
      sub:'Every message lands in the same inbox, wherever it comes from.',
      cards:[
        {t:'Web chat', p:'Your own configurable widget.'},
        {t:'WhatsApp Business', p:'Support, orders and notifications.'},
        {t:'Messenger', p:'Integrated with Facebook pages.'},
        {t:'Instagram DM', p:'Messages from the business account.'},
        {t:'SMS (Twilio)', p:'Gets through even without internet.'},
        {t:'Telegram', p:'Fast, private messaging.'},
        {t:'Viber · LINE', p:'Eastern Europe, Japan and Asia.'},
        {t:'WeChat · Zalo', p:'China and Vietnam.'},
        {t:'API channel', p:'Any other platform or in-house app.'}
      ]
    }
  },
  {
    key:'widget', icon:ICONS.widget,
    es:{
      name:'Widget web',
      short:'Un único punto de contacto instalado en la web.',
      title:'Widget de chat para la web',
      sub:'Un único punto de contacto con todos los canales, personalizable e instalable en minutos.',
      cards:[
        {t:'Página de inicio', p:'Se diseña con componentes y arrastrar y soltar, y puede mostrar las caras del equipo de soporte.'},
        {t:'Chat en vivo', p:'Espacio propio para conversar, con historial y opciones como adjuntos, emojis o indicador de escritura.'},
        {t:'Base de conocimiento', p:'Artículos de ayuda dentro del widget, con buscador y valoración de cada artículo.'},
        {t:'Tickets en la web', p:'El cliente ve sus tickets, responde y recibe actualizaciones sin salir de la web.'},
        {t:'Hasta 4 páginas', p:'Cada página del widget con su propio diseño y contenido.'},
        {t:'Estilo de marca', p:'Colores, tamaño de ventana y fuente, botón, icono, estilo y título.'}
      ],
      chips_title:'Plugins y código embebido',
      chips:['WordPress','Shopify','Wix','Joomla','OpenCart','Magento','PrestaShop','Cualquier web']
    },
    en:{
      name:'Web widget',
      short:'A single point of contact installed on your site.',
      title:'Chat widget for your website',
      sub:'One point of contact for every channel, brandable and installed in minutes.',
      cards:[
        {t:'Home page', p:'Built with drag-and-drop components, and it can show the faces of the support team.'},
        {t:'Live chat', p:'A dedicated space to talk, with history and options such as attachments, emojis or a typing indicator.'},
        {t:'Knowledge base', p:'Help articles inside the widget, with search and per-article ratings.'},
        {t:'Tickets on the site', p:'Customers see their tickets, reply and get updates without leaving your website.'},
        {t:'Up to 4 pages', p:'Each widget page with its own design and content.'},
        {t:'Brand styling', p:'Colours, window and font size, button, icon, style and title.'}
      ],
      chips_title:'Plugins and embed code',
      chips:['WordPress','Shopify','Wix','Joomla','OpenCart','Magento','PrestaShop','Any website']
    }
  },
  {
    key:'bots', icon:ICONS.bots,
    es:{
      name:'Chatbots',
      short:'Flujos visuales con IA y traspaso a humano.',
      title:'Constructor de chatbots sin código',
      sub:'Editor visual de flujos, con IA o por reglas.',
      cards:[
        {t:'Bots a medida', p:'Lógica condicional, datos del cliente en tiempo real y acciones: webhooks, emails, Telegram, Google Sheets.'},
        {t:'IA en cada flujo', p:'Respuestas naturales, detección de intención y memoria de interacciones previas.'},
        {t:'Traspaso a humano', p:'Si el bot no puede resolverlo, pasa la conversación a un agente sin perder el contexto.'},
        {t:'Multicanal', p:'El mismo bot en web, Messenger, Instagram, Telegram, WhatsApp y más.'}
      ]
    },
    en:{
      name:'Chatbots',
      short:'Visual flows with AI and handover to a human.',
      title:'No-code chatbot builder',
      sub:'A visual flow editor, powered by AI or by rules.',
      cards:[
        {t:'Tailored bots', p:'Conditional logic, live customer data and actions: webhooks, emails, Telegram, Google Sheets.'},
        {t:'AI in every flow', p:'Natural answers, intent detection and memory of previous interactions.'},
        {t:'Handover to a human', p:'If the bot cannot solve it, the conversation goes to an agent without losing context.'},
        {t:'Multichannel', p:'The same bot on web, Messenger, Instagram, Telegram, WhatsApp and more.'}
      ]
    }
  },
  {
    key:'ai', icon:ICONS.ai,
    es:{
      name:'Inteligencia artificial',
      short:'Cualquier proveedor, con la API key propia.',
      title:'Inteligencia artificial sin ataduras',
      sub:'El punto más diferencial del producto.',
      cards:[
        {t:'Cualquier proveedor', p:'OpenAI, Claude, Gemini, DeepSeek, Grok, OpenRouter, HuggingFace o modelos autoalojados.'},
        {t:'API key propia', p:'El cliente controla consumo, límites y facturación, y cambia de clave sin cortes.'},
        {t:'Entrenada con tu negocio', p:'Aprende de la base de conocimiento, documentos subidos y enlaces de la web.'},
        {t:'Menos carga al equipo', p:'Resuelve las consultas repetitivas y deja al equipo lo complejo.'}
      ]
    },
    en:{
      name:'Artificial intelligence',
      short:'Any provider, using your own API key.',
      title:'AI with no strings attached',
      sub:'The product’s single biggest differentiator.',
      cards:[
        {t:'Any provider', p:'OpenAI, Claude, Gemini, DeepSeek, Grok, OpenRouter, HuggingFace or self-hosted models.'},
        {t:'Your own API key', p:'The client controls usage, limits and billing, and swaps keys without downtime.'},
        {t:'Trained on your business', p:'It learns from the knowledge base, uploaded documents and links from your site.'},
        {t:'Less load on the team', p:'It handles repetitive questions and leaves the complex ones to people.'}
      ]
    }
  },
  {
    key:'kb', icon:ICONS.kb,
    es:{
      name:'Base de conocimiento',
      short:'Centro de ayuda en dominio propio.',
      title:'Base de conocimiento',
      sub:'Un centro de ayuda de autoservicio.',
      cards:[
        {t:'Web de documentación', p:'Guías, tutoriales y FAQ con buscador y enlaces compartibles.'},
        {t:'Dominio propio', p:'Se publica en el dominio del cliente, sin necesidad de servidor.'},
        {t:'Editor completo', p:'Texto, encabezados, avisos, imágenes, multimedia, código y contenido embebido.'},
        {t:'Fuente para la IA', p:'Entrena al asistente para que responda igual que la documentación.'}
      ]
    },
    en:{
      name:'Knowledge base',
      short:'A help centre on your own domain.',
      title:'Knowledge base',
      sub:'A self-service help centre.',
      cards:[
        {t:'Documentation site', p:'Guides, tutorials and FAQs with search and shareable links.'},
        {t:'Your own domain', p:'Published on the client’s domain, with no server needed.'},
        {t:'Full editor', p:'Text, headings, callouts, images, multimedia, code and embedded content.'},
        {t:'A source for the AI', p:'It trains the assistant to answer exactly like the documentation.'}
      ]
    }
  },
  {
    key:'tickets', icon:ICONS.tickets,
    es:{
      name:'Tickets',
      short:'Emails convertidos en tickets y asignados solos.',
      title:'Sistema de tickets',
      sub:'Cada solicitud, de principio a fin.',
      cards:[
        {t:'Emails a tickets', p:'Los correos entrantes se convierten en tickets con todo el hilo y se responde desde el sistema.'},
        {t:'Asignación automática', p:'Reglas y condiciones reparten los tickets y equilibran la carga del equipo.'},
        {t:'Flujo a medida', p:'Estados, prioridades y tipos de ticket propios para cada forma de trabajar.'}
      ]
    },
    en:{
      name:'Ticketing',
      short:'Emails turned into tickets and assigned on their own.',
      title:'Ticketing system',
      sub:'Every request, from start to finish.',
      cards:[
        {t:'Emails into tickets', p:'Incoming emails become tickets with the full thread, answered from inside the system.'},
        {t:'Automatic assignment', p:'Rules and conditions distribute tickets and balance the team’s workload.'},
        {t:'Custom workflow', p:'Your own statuses, priorities and ticket types for every way of working.'}
      ]
    }
  },
  {
    key:'campaigns', icon:ICONS.campaigns,
    es:{
      name:'Campañas WhatsApp',
      short:'Envíos masivos segmentados y medidos.',
      title:'Campañas de WhatsApp',
      sub:'Promociones, novedades y recordatorios desde el mismo panel.',
      cards:[
        {t:'Lanzamiento rápido', p:'Contactos desde CSV, JSON, la plataforma o Google Sheets. Segmentación, personalización y envío programado.'},
        {t:'Plantillas aprobadas', p:'Plantillas propias o aprobadas por WhatsApp, reutilizables y conformes a sus normas.'},
        {t:'Estadísticas', p:'Enviados, entregados y leídos en tiempo real para mejorar cada campaña.'}
      ]
    },
    en:{
      name:'WhatsApp campaigns',
      short:'Segmented bulk sends, measured end to end.',
      title:'WhatsApp campaigns',
      sub:'Promotions, news and reminders from the same panel.',
      cards:[
        {t:'Quick launch', p:'Contacts from CSV, JSON, the platform itself or Google Sheets. Segmentation, personalisation and scheduled sending.'},
        {t:'Approved templates', p:'Your own or WhatsApp-approved templates, reusable and compliant with their rules.'},
        {t:'Statistics', p:'Sent, delivered and read in real time, to improve every campaign.'}
      ]
    }
  },
  {
    key:'integrations', icon:ICONS.integrations,
    es:{
      name:'Integraciones',
      short:'Antispam, avisos, Google Sheets y API REST.',
      title:'Integraciones',
      sub:'Conecta con las herramientas de siempre.',
      cards:[
        {t:'reCAPTCHA', p:'Protege formularios de spam y bots.'},
        {t:'Cloudflare Turnstile', p:'Antispam sin fricción para el usuario.'},
        {t:'Telegram', p:'Avisos instantáneos de nuevos eventos.'},
        {t:'Twilio', p:'Alertas por SMS para lo crítico.'},
        {t:'Google Sheets', p:'Importa y exporta datos del equipo.'},
        {t:'API REST y webhooks', p:'Integraciones a medida.'}
      ]
    },
    en:{
      name:'Integrations',
      short:'Antispam, alerts, Google Sheets and a REST API.',
      title:'Integrations',
      sub:'Connect it to the tools you already use.',
      cards:[
        {t:'reCAPTCHA', p:'Protects forms from spam and bots.'},
        {t:'Cloudflare Turnstile', p:'Frictionless antispam for the user.'},
        {t:'Telegram', p:'Instant alerts for new events.'},
        {t:'Twilio', p:'SMS alerts for the critical stuff.'},
        {t:'Google Sheets', p:'Import and export your team’s data.'},
        {t:'REST API and webhooks', p:'Tailor-made integrations.'}
      ]
    }
  }
];
