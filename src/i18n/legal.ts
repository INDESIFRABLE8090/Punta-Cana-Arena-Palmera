import type { Lang } from './config';

/**
 * Textos legales. Describen exactamente cómo funciona el sitio (sin servidor de
 * formularios, sin cookies, sin analítica). Si cambia el funcionamiento —por
 * ejemplo, se añade analítica, pagos o un formulario con servidor— hay que
 * actualizarlos ANTES de publicar. Recomendado: revisión por un abogado.
 */
export type LegalDoc = 'privacy' | 'terms' | 'accessibility' | 'credits';
export const legalDocs: LegalDoc[] = ['privacy', 'terms', 'accessibility', 'credits'];

export const legalSlugs: Record<Lang, Record<LegalDoc, string>> = {
  es: { privacy: 'privacidad', terms: 'condiciones', accessibility: 'accesibilidad', credits: 'creditos' },
  en: { privacy: 'privacy', terms: 'terms', accessibility: 'accessibility', credits: 'credits' },
  pt: { privacy: 'privacidade', terms: 'termos', accessibility: 'acessibilidade', credits: 'creditos' },
};

export interface LegalSection {
  h: string;
  p: string[];
}
export interface LegalText {
  title: string;
  intro: string;
  sections: LegalSection[];
}

type Owner = { name: string; legalName: string; taxId: string; address: string; email: string; whatsapp: string };

const ownerLine: Record<Lang, (o: Owner) => string> = {
  es: (o) =>
    [o.legalName || o.name, o.taxId && `RNC/identificación fiscal: ${o.taxId}`, o.address, o.email && `Correo: ${o.email}`, `WhatsApp: ${o.whatsapp}`].filter(Boolean).join(' · '),
  en: (o) =>
    [o.legalName || o.name, o.taxId && `Tax ID: ${o.taxId}`, o.address, o.email && `Email: ${o.email}`, `WhatsApp: ${o.whatsapp}`].filter(Boolean).join(' · '),
  pt: (o) =>
    [o.legalName || o.name, o.taxId && `Identificação fiscal: ${o.taxId}`, o.address, o.email && `E-mail: ${o.email}`, `WhatsApp: ${o.whatsapp}`].filter(Boolean).join(' · '),
};

export function legalText(lang: Lang, doc: LegalDoc, owner: Owner, updated: string): LegalText {
  const who = ownerLine[lang](owner);
  const T: Record<Lang, Record<LegalDoc, LegalText>> = {
    es: {
      privacy: {
        title: 'Política de privacidad',
        intro: `Última actualización: ${updated}. Esta política explica qué datos se tratan cuando usas este sitio web y cómo ejercer tus derechos.`,
        sections: [
          { h: 'Responsable', p: [who] },
          {
            h: 'Qué datos tratamos',
            p: [
              'Este sitio no tiene formularios conectados a un servidor y no guarda tus datos personales. El constructor de itinerario prepara un mensaje en tu propio navegador; solo cuando tú decides enviarlo por WhatsApp recibimos los datos que incluyas: nombre, fechas, número de personas, edades de menores, hotel o zona de recogida y notas.',
              'Si nos escribes por WhatsApp o por correo, tratamos los datos de esa conversación.',
            ],
          },
          {
            h: 'Para qué y con qué base',
            p: [
              'Usamos esos datos únicamente para responder a tu solicitud, preparar una cotización y, si decides reservar, gestionar la experiencia. La base es tu consentimiento y la aplicación de medidas precontractuales a petición tuya. No los usamos para publicidad ni los vendemos.',
            ],
          },
          {
            h: 'Con quién se comparten',
            p: [
              'WhatsApp (Meta Platforms) transporta los mensajes según su propia política de privacidad. Si confirmas una experiencia, compartimos con el operador local que la presta los datos necesarios para realizarla (por ejemplo, nombre, número de personas y punto de recogida).',
              'El sitio está alojado en GitHub Pages (GitHub, Inc.), que puede registrar datos técnicos como la dirección IP por motivos de seguridad. Estos proveedores pueden tratar datos fuera de tu país, incluidos los Estados Unidos.',
            ],
          },
          {
            h: 'Cookies y almacenamiento local',
            p: [
              'No usamos cookies, analítica, publicidad ni rastreadores. Las fuentes tipográficas se sirven desde este mismo sitio. El navegador guarda en almacenamiento local únicamente qué excursiones añadiste a tu itinerario, para no perder la selección; no incluye datos personales y puedes borrarlo desde la configuración de tu navegador.',
            ],
          },
          {
            h: 'Cuánto tiempo',
            p: ['Conservamos las conversaciones el tiempo necesario para atender tu solicitud y cumplir obligaciones legales. Puedes pedir que las borremos en cualquier momento.'],
          },
          {
            h: 'Tus derechos',
            p: [
              'Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos, y retirar tu consentimiento, escribiéndonos por los canales de contacto indicados arriba. También puedes reclamar ante la autoridad de protección de datos de tu país.',
            ],
          },
          { h: 'Menores', p: ['Las solicitudes deben hacerlas personas mayores de edad. Los datos de menores (por ejemplo, su edad para la tarifa) solo deben facilitarlos sus padres o tutores.'] },
        ],
      },
      terms: {
        title: 'Aviso legal y condiciones de uso',
        intro: `Última actualización: ${updated}.`,
        sections: [
          { h: 'Titular del sitio', p: [who] },
          {
            h: 'Información y cotizaciones',
            p: [
              'La información de este sitio describe las experiencias de forma orientativa. Los precios no se publican: se cotizan según fecha, número de personas y hotel.',
              'Enviar una solicitud no constituye una reserva ni un contrato. Una reserva solo queda confirmada cuando te la confirmamos expresamente por escrito con precio, fecha, punto de recogida y condiciones. En este sitio no se realiza ningún pago.',
            ],
          },
          {
            h: 'Prestación de las experiencias',
            p: [
              'Las experiencias pueden ser prestadas por operadores locales. Antes de confirmar te informamos del proveedor, sus condiciones, requisitos de participación y política de cancelación. Las inclusiones, horarios y disponibilidad pueden variar según el operador, la fecha y las condiciones del mar o del clima.',
            ],
          },
          {
            h: 'Actividades con requisitos',
            p: [
              'Algunas actividades (conducción de buggies, Polaris y ATV, inmersiones, actividades acuáticas, interacción con animales, paseos a caballo, tirolinas) tienen requisitos de edad, salud, seguridad o conducción que fija el operador. Consulta esos requisitos antes de reservar y sigue siempre las instrucciones del personal.',
            ],
          },
          {
            h: 'Imágenes',
            p: [
              'Las imágenes tienen carácter ilustrativo y no representan necesariamente la experiencia exacta, la embarcación, el vehículo ni las instalaciones del día de tu actividad. Las fotografías de terceros se usan conforme a su licencia; los créditos están en la página de créditos.',
            ],
          },
          {
            h: 'Marcas',
            p: [
              'Los nombres de lugares, parques, espectáculos y actividades (por ejemplo, Coco Bongo, Scape Park, Scuba Doo, Dolphin Explorer o Monkeyland) pertenecen a sus respectivos titulares. Se mencionan solo para identificar las experiencias que se pueden cotizar y no implican patrocinio ni afiliación.',
            ],
          },
          {
            h: 'Uso del sitio',
            p: [
              'Puedes usar este sitio para informarte y solicitar cotizaciones. No está permitido copiar sus textos o diseño con fines comerciales ni usarlo para enviar solicitudes falsas o automatizadas.',
            ],
          },
        ],
      },
      accessibility: {
        title: 'Declaración de accesibilidad',
        intro: `Última actualización: ${updated}. Queremos que cualquier persona pueda informarse y pedir su cotización.`,
        sections: [
          {
            h: 'Nivel de cumplimiento',
            p: ['El sitio se ha diseñado con el objetivo de cumplir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, nivel AA, y se revisa con pruebas automáticas en cada versión.'],
          },
          {
            h: 'Qué incluye',
            p: [
              'Navegación completa con teclado y enlace para saltar al contenido; textos alternativos en las imágenes; formularios con etiquetas y mensajes de error accesibles; contraste de color revisado; respeto de la preferencia de movimiento reducido (desactiva la animación 3D y el desplazamiento suave); sonido solo bajo demanda; y el contenido sigue disponible sin JavaScript.',
            ],
          },
          {
            h: 'Limitaciones conocidas',
            p: ['La escena 3D del océano es decorativa y su contenido se ofrece también como texto. Algunas fotografías pueden no describir cada detalle visual.'],
          },
          { h: '¿Encontraste una barrera?', p: [`Escríbenos y te ayudaremos por otro medio y lo corregiremos: ${who}`] },
        ],
      },
      credits: {
        title: 'Créditos de imágenes',
        intro: 'Fotografías de terceros usadas en este sitio, con su autor y licencia. Las imágenes se han recortado y comprimido para la web.',
        sections: [],
      },
    },
    en: {
      privacy: {
        title: 'Privacy policy',
        intro: `Last updated: ${updated}. This policy explains what data is processed when you use this website and how to exercise your rights.`,
        sections: [
          { h: 'Controller', p: [who] },
          {
            h: 'What data we process',
            p: [
              'This website has no forms connected to a server and does not store your personal data. The itinerary builder prepares a message in your own browser; only when you choose to send it on WhatsApp do we receive the details you include: name, dates, number of people, children’s ages, hotel or pickup area and notes.',
              'If you message us on WhatsApp or by email, we process the data in that conversation.',
            ],
          },
          {
            h: 'Purpose and legal basis',
            p: [
              'We use this data only to answer your request, prepare a quote and, if you decide to book, arrange the experience. The legal basis is your consent and steps taken at your request before a contract. We do not use it for advertising and we do not sell it.',
            ],
          },
          {
            h: 'Who it is shared with',
            p: [
              'WhatsApp (Meta Platforms) carries the messages under its own privacy policy. If you confirm an experience, we share with the local operator providing it the data needed to deliver it (for example, name, number of people and pickup point).',
              'The site is hosted on GitHub Pages (GitHub, Inc.), which may log technical data such as IP addresses for security. These providers may process data outside your country, including in the United States.',
            ],
          },
          {
            h: 'Cookies and local storage',
            p: [
              'We do not use cookies, analytics, advertising or trackers. Fonts are served from this same site. Your browser stores locally only which excursions you added to your itinerary, so your selection is not lost; it contains no personal data and you can clear it in your browser settings.',
            ],
          },
          { h: 'How long', p: ['We keep conversations for as long as needed to handle your request and meet legal obligations. You can ask us to delete them at any time.'] },
          {
            h: 'Your rights',
            p: [
              'You can request access, correction, deletion, objection, restriction and portability of your data, and withdraw your consent, by contacting us through the channels above. You may also complain to the data protection authority in your country.',
            ],
          },
          { h: 'Minors', p: ['Requests must be made by adults. Data about minors (for example, their age for pricing) should only be provided by their parents or guardians.'] },
        ],
      },
      terms: {
        title: 'Legal notice and terms of use',
        intro: `Last updated: ${updated}.`,
        sections: [
          { h: 'Site owner', p: [who] },
          {
            h: 'Information and quotes',
            p: [
              'The information on this site describes the experiences for guidance. Prices are not published: they are quoted according to date, number of people and hotel.',
              'Sending a request is not a booking or a contract. A booking is only confirmed when we expressly confirm it in writing with price, date, pickup point and conditions. No payment is made on this site.',
            ],
          },
          {
            h: 'Who provides the experiences',
            p: [
              'Experiences may be provided by local operators. Before you confirm, we tell you the provider, its conditions, participation requirements and cancellation policy. Inclusions, schedules and availability may vary by operator, date and sea or weather conditions.',
            ],
          },
          {
            h: 'Activities with requirements',
            p: [
              'Some activities (driving buggies, Polaris and ATVs, diving, water activities, animal interactions, horseback riding, ziplines) have age, health, safety or driving requirements set by the operator. Check them before booking and always follow the staff’s instructions.',
            ],
          },
          {
            h: 'Images',
            p: [
              'Images are for illustrative purposes and do not necessarily show the exact experience, boat, vehicle or facilities on the day of your activity. Third-party photographs are used under their licence; credits are on the credits page.',
            ],
          },
          {
            h: 'Trademarks',
            p: [
              'Names of places, parks, shows and activities (for example, Coco Bongo, Scape Park, Scuba Doo, Dolphin Explorer or Monkeyland) belong to their respective owners. They are mentioned only to identify the experiences that can be quoted and do not imply sponsorship or affiliation.',
            ],
          },
          {
            h: 'Use of the site',
            p: ['You may use this site to get information and request quotes. Copying its texts or design for commercial purposes, or using it to send false or automated requests, is not allowed.'],
          },
        ],
      },
      accessibility: {
        title: 'Accessibility statement',
        intro: `Last updated: ${updated}. We want everyone to be able to get information and request a quote.`,
        sections: [
          {
            h: 'Conformance',
            p: ['This site is designed with the goal of meeting the Web Content Accessibility Guidelines (WCAG) 2.1, level AA, and is checked with automated tests in every release.'],
          },
          {
            h: 'What it includes',
            p: [
              'Full keyboard navigation and a skip-to-content link; text alternatives for images; forms with labels and accessible error messages; reviewed colour contrast; support for the reduced-motion preference (it turns off the 3D animation and smooth scrolling); sound only on demand; and content that remains available without JavaScript.',
            ],
          },
          { h: 'Known limitations', p: ['The 3D ocean scene is decorative and its content is also provided as text. Some photographs may not describe every visual detail.'] },
          { h: 'Found a barrier?', p: [`Contact us and we will help you another way and fix it: ${who}`] },
        ],
      },
      credits: {
        title: 'Image credits',
        intro: 'Third-party photographs used on this site, with their author and licence. Images have been cropped and compressed for the web.',
        sections: [],
      },
    },
    pt: {
      privacy: {
        title: 'Política de privacidade',
        intro: `Última atualização: ${updated}. Esta política explica quais dados são tratados quando você usa este site e como exercer seus direitos.`,
        sections: [
          { h: 'Controlador', p: [who] },
          {
            h: 'Quais dados tratamos',
            p: [
              'Este site não tem formulários conectados a um servidor e não armazena seus dados pessoais. O montador de roteiro prepara uma mensagem no seu próprio navegador; somente quando você decide enviá-la pelo WhatsApp recebemos os dados que você incluir: nome, datas, número de pessoas, idades das crianças, hotel ou área de embarque e observações.',
              'Se você nos escrever pelo WhatsApp ou por e-mail, tratamos os dados dessa conversa.',
            ],
          },
          {
            h: 'Finalidade e base legal',
            p: [
              'Usamos esses dados apenas para responder ao seu pedido, preparar um orçamento e, se você decidir reservar, organizar a experiência. A base legal é o seu consentimento e procedimentos preliminares a pedido seu. Não os usamos para publicidade nem os vendemos.',
            ],
          },
          {
            h: 'Com quem são compartilhados',
            p: [
              'O WhatsApp (Meta Platforms) transmite as mensagens conforme a sua própria política de privacidade. Se você confirmar uma experiência, compartilhamos com o operador local que a presta os dados necessários para realizá-la (por exemplo, nome, número de pessoas e ponto de embarque).',
              'O site está hospedado no GitHub Pages (GitHub, Inc.), que pode registrar dados técnicos como o endereço IP por motivos de segurança. Esses provedores podem tratar dados fora do seu país, inclusive nos Estados Unidos.',
            ],
          },
          {
            h: 'Cookies e armazenamento local',
            p: [
              'Não usamos cookies, análise, publicidade nem rastreadores. As fontes são servidas por este mesmo site. O navegador guarda localmente apenas quais excursões você adicionou ao roteiro, para não perder a seleção; não contém dados pessoais e você pode apagá-lo nas configurações do navegador.',
            ],
          },
          { h: 'Por quanto tempo', p: ['Mantemos as conversas pelo tempo necessário para atender ao seu pedido e cumprir obrigações legais. Você pode pedir a exclusão a qualquer momento.'] },
          {
            h: 'Seus direitos',
            p: [
              'Você pode solicitar acesso, correção, exclusão, oposição, limitação e portabilidade dos seus dados, e revogar o consentimento, entrando em contato pelos canais acima. Também pode reclamar à autoridade de proteção de dados do seu país (no Brasil, a ANPD).',
            ],
          },
          { h: 'Menores', p: ['Os pedidos devem ser feitos por maiores de idade. Dados de menores (por exemplo, a idade para a tarifa) só devem ser informados pelos pais ou responsáveis.'] },
        ],
      },
      terms: {
        title: 'Aviso legal e termos de uso',
        intro: `Última atualização: ${updated}.`,
        sections: [
          { h: 'Titular do site', p: [who] },
          {
            h: 'Informações e orçamentos',
            p: [
              'As informações deste site descrevem as experiências de forma orientativa. Os preços não são publicados: são orçados conforme data, número de pessoas e hotel.',
              'Enviar um pedido não constitui reserva nem contrato. Uma reserva só fica confirmada quando a confirmamos expressamente por escrito com preço, data, ponto de embarque e condições. Nenhum pagamento é feito neste site.',
            ],
          },
          {
            h: 'Quem presta as experiências',
            p: [
              'As experiências podem ser prestadas por operadores locais. Antes de confirmar, informamos o prestador, suas condições, requisitos de participação e política de cancelamento. Inclusões, horários e disponibilidade podem variar conforme o operador, a data e as condições do mar ou do clima.',
            ],
          },
          {
            h: 'Atividades com requisitos',
            p: [
              'Algumas atividades (condução de buggies, Polaris e ATV, mergulho, atividades aquáticas, interação com animais, passeios a cavalo, tirolesas) têm requisitos de idade, saúde, segurança ou habilitação definidos pelo operador. Consulte-os antes de reservar e siga sempre as instruções da equipe.',
            ],
          },
          {
            h: 'Imagens',
            p: [
              'As imagens têm caráter ilustrativo e não representam necessariamente a experiência exata, a embarcação, o veículo ou as instalações no dia da sua atividade. As fotografias de terceiros são usadas conforme a sua licença; os créditos estão na página de créditos.',
            ],
          },
          {
            h: 'Marcas',
            p: [
              'Os nomes de lugares, parques, espetáculos e atividades (por exemplo, Coco Bongo, Scape Park, Scuba Doo, Dolphin Explorer ou Monkeyland) pertencem aos seus respectivos titulares. São mencionados apenas para identificar as experiências que podem ser orçadas e não implicam patrocínio nem afiliação.',
            ],
          },
          {
            h: 'Uso do site',
            p: ['Você pode usar este site para se informar e pedir orçamentos. Não é permitido copiar seus textos ou design para fins comerciais nem usá-lo para enviar pedidos falsos ou automatizados.'],
          },
        ],
      },
      accessibility: {
        title: 'Declaração de acessibilidade',
        intro: `Última atualização: ${updated}. Queremos que qualquer pessoa possa se informar e pedir seu orçamento.`,
        sections: [
          {
            h: 'Nível de conformidade',
            p: ['O site foi desenvolvido com o objetivo de atender às Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, nível AA, e é verificado com testes automáticos a cada versão.'],
          },
          {
            h: 'O que inclui',
            p: [
              'Navegação completa por teclado e link para pular ao conteúdo; textos alternativos nas imagens; formulários com rótulos e mensagens de erro acessíveis; contraste de cores revisado; respeito à preferência de movimento reduzido (desativa a animação 3D e a rolagem suave); som apenas sob demanda; e o conteúdo continua disponível sem JavaScript.',
            ],
          },
          { h: 'Limitações conhecidas', p: ['A cena 3D do oceano é decorativa e seu conteúdo também é oferecido como texto. Algumas fotografias podem não descrever todos os detalhes visuais.'] },
          { h: 'Encontrou uma barreira?', p: [`Fale conosco e ajudaremos por outro meio e corrigiremos: ${who}`] },
        ],
      },
      credits: {
        title: 'Créditos das imagens',
        intro: 'Fotografias de terceiros usadas neste site, com autor e licença. As imagens foram recortadas e comprimidas para a web.',
        sections: [],
      },
    },
  };
  return T[lang][doc];
}

export const legalUi: Record<Lang, { legal: string; privacy: string; terms: string; accessibility: string; credits: string; trademarks: string; photo: string; consentLink: string }> = {
  es: { legal: 'Legal', privacy: 'Privacidad', terms: 'Aviso legal y condiciones', accessibility: 'Accesibilidad', credits: 'Créditos de imágenes', trademarks: 'Las marcas mencionadas pertenecen a sus titulares y no implican afiliación.', photo: 'Foto', consentLink: 'Política de privacidad' },
  en: { legal: 'Legal', privacy: 'Privacy', terms: 'Legal notice and terms', accessibility: 'Accessibility', credits: 'Image credits', trademarks: 'Trademarks mentioned belong to their owners and do not imply affiliation.', photo: 'Photo', consentLink: 'Privacy policy' },
  pt: { legal: 'Legal', privacy: 'Privacidade', terms: 'Aviso legal e termos', accessibility: 'Acessibilidade', credits: 'Créditos das imagens', trademarks: 'As marcas mencionadas pertencem aos seus titulares e não implicam afiliação.', photo: 'Foto', consentLink: 'Política de privacidade' },
};
