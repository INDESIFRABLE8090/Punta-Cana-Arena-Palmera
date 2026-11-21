/**
 * Arena & Palmera: client-side excursion planner.
 * Only canonical tour IDs and optional days are stored. No guest information, prices,
 * availability, marketing trackers, network writes, or automatic WhatsApp sends.
 */
export function initTripPlanner({ tours, getLanguage, getModalTour }) {
  const MAX_ITEMS = tours.length;
  const STORAGE_KEY = 'arena-palmera-trip-v1';
  const knownTours = new Map(tours.map(tour => [tour.id, tour]));
  const byId = id => document.getElementById(id);
  const copy = {
    es: {
      nav: 'Mi viaje', explore: 'Explorar experiencias', eyebrow: 'TU AVENTURA, A TU RITMO',
      title: 'Diseña tu propio Caribe.', intro: 'Combina excursiones, organízalas por días y prepara una sola solicitud. Tú eliges el plan; el operador confirma la logística.',
      selected: 'experiencias guardadas', listTitle: 'Tu selección', emptyTitle: 'Tu viaje empieza con una elección.',
      emptyBody: 'Explora las excursiones y toca “Añadir al viaje”. Aquí aparecerá tu plan personalizado.',
      saved: 'Guardado ✓', add: '+ Añadir al viaje', addModal: '+ Añadir al viaje', remove: 'Quitar',
      day: 'Día', shareTitle: 'Tu viaje, para compartir.', shareBody: 'Comparte únicamente la selección de excursiones y días, sin nombres ni datos personales.',
      noPlan: 'Elige una experiencia para generar el enlace y el QR.',
      noPublic: 'El QR estará disponible cuando la web esté publicada en su dominio.',
      share: 'Compartir', copyLink: 'Copiar enlace', quote: 'Cotizar mi viaje', print: 'Imprimir plan',
      clear: 'Vaciar mi viaje', consentClear: '¿Vaciar todas las experiencias de tu viaje?',
      savedMessage: 'Experiencia añadida a tu viaje.', removedMessage: 'Experiencia eliminada de tu viaje.',
      copied: 'Enlace copiado.', copyFailed: 'No fue posible copiar el enlace.',
      noLink: 'El enlace estará disponible al publicar el sitio.', shareFailed: 'No fue posible compartir el enlace.',
      noPrice: 'Plan orientativo: precios, horarios, traslados y disponibilidad sujetos a confirmación.',
      quoteHint: 'Un solo mensaje, varias experiencias. No confirma una reserva.',
      qrAlt: 'Código QR para compartir el itinerario',
      itemOne: 'experiencia', itemMany: 'experiencias',
      planLabel: 'Plan de viaje', forQuote: 'Selección de excursiones y días sugeridos (pendientes de confirmar):'
    },
    en: {
      nav: 'My trip', explore: 'Explore experiences', eyebrow: 'YOUR ADVENTURE, YOUR WAY',
      title: 'Design your Caribbean escape.', intro: 'Combine experiences, organize them by day, and prepare one enquiry. You choose; the operator confirms the details.',
      selected: 'saved experiences', listTitle: 'Your selection', emptyTitle: 'Every journey starts with a choice.',
      emptyBody: 'Explore the experiences and tap “Add to trip”. Your personalized plan will appear here.',
      saved: 'Saved ✓', add: '+ Add to trip', addModal: '+ Add to trip', remove: 'Remove',
      day: 'Day', shareTitle: 'Your trip, ready to share.', shareBody: 'Share only experience names and suggested days, never names or personal information.',
      noPlan: 'Choose an experience to create a share link and QR code.',
      noPublic: 'QR sharing will be available when the website is published on its domain.',
      share: 'Share', copyLink: 'Copy link', quote: 'Quote my trip', print: 'Print plan',
      clear: 'Clear my trip', consentClear: 'Remove all the experiences from your trip?',
      savedMessage: 'Experience added to your trip.', removedMessage: 'Experience removed from your trip.',
      copied: 'Link copied.', copyFailed: 'Could not copy link.',
      noLink: 'A shareable link will be available when the site is published.', shareFailed: 'Could not share this link.',
      noPrice: 'Suggested itinerary only: pricing, times, transportation and availability must be confirmed.',
      quoteHint: 'One enquiry, several experiences. This is not a confirmed booking.',
      qrAlt: 'QR code for sharing this itinerary',
      itemOne: 'experience', itemMany: 'experiences',
      planLabel: 'Trip plan', forQuote: 'Chosen experiences and suggested days (subject to confirmation):'
    }
  };
  const label = key => copy[getLanguage()]?.[key] || copy.es[key] || key;
  const locationIsPublic = () => /^https?:$/.test(location.protocol) &&
    !['127.0.0.1', 'localhost', '::1', '[::1]'].includes(location.hostname);
  const normalize = entries => {
    if (!Array.isArray(entries)) return [];
    const used = new Set(), valid = [];
    for (const item of entries) {
      if (!item || typeof item.id !== 'string' || !knownTours.has(item.id) || used.has(item.id)) continue;
      const day = Number(item.day);
      if (!Number.isInteger(day) || day < 1 || day > 7) continue;
      used.add(item.id);
      valid.push({ id: item.id, day });
      if (valid.length >= MAX_ITEMS) break;
    }
    return valid;
  };
  const decodePlan = str => normalize((str || '').split(',').map(part => {
    const match = /^([a-z0-9-]{1,40}):([1-7])$/.exec(part);
    return match ? { id: match[1], day: Number(match[2]) } : null;
  }));
  const urlParams = new URLSearchParams(location.search);
  let items;
  if (urlParams.has('plan')) {
    items = decodePlan(urlParams.get('plan'));
  } else {
    try { items = normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch { items = []; }
  }
  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage optional */ }
  };
  persist();

  const itemsForDisplay = () => [...items].sort((a, b) => a.day - b.day);
  const tourName = id => {
    const tour = knownTours.get(id);
    return getLanguage() === 'en' ? tour.en : tour.name;
  };
  const showMessage = message => {
    const area = byId('plannerStatus');
    if (area) area.textContent = message;
  };
  const isChosen = id => items.some(item => item.id === id);
  const shareUrl = () => {
    if (!locationIsPublic() || !items.length) return '';
    const url = new URL(location.pathname || '/', location.origin);
    url.searchParams.set('plan', itemsForDisplay().map(item => item.id + ':' + item.day).join(','));
    url.hash = 'mi-viaje';
    return url.toString();
  };
  const getItems = () => itemsForDisplay().map(item => ({...item, name: tourName(item.id)}));

  function decorateCards() {
    document.querySelectorAll('#tourGrid .tour-card').forEach(card => {
      const id = card.dataset.id;
      if (!knownTours.has(id)) return;
      let button = card.querySelector('[data-save-tour]');
      if (!button) {
        button = document.createElement('button');
        button.className = 'tour-save';
        button.type = 'button';
        button.dataset.saveTour = id;
        card.insertBefore(button, card.firstChild);
      }
      const chosen = isChosen(id);
      button.textContent = chosen ? label('saved') : label('add');
      button.setAttribute('aria-pressed', String(chosen));
      button.setAttribute('aria-label', (chosen ? label('remove') : label('add')) + ': ' + tourName(id));
    });
  }

  function decorateModal() {
    const button = byId('modalSaveTour');
    if (!button) return;
    const tour = getModalTour();
    button.hidden = !tour;
    if (!tour) return;
    button.textContent = isChosen(tour.id) ? label('saved') : label('addModal');
    button.setAttribute('aria-pressed', String(isChosen(tour.id)));
  }

  const createButton = (text, className, callback) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', callback);
    return button;
  };

  function updateList() {
    const list = byId('plannerList'), empty = byId('plannerEmpty');
    const count = byId('plannerCount');
    const countPill = byId('plannerCountPill');
    const hasItems = items.length > 0;
    count.textContent = String(items.length);
    countPill.textContent = String(items.length);
    countPill.hidden = !hasItems;
    empty.hidden = hasItems;
    list.hidden = !hasItems;
    list.replaceChildren();
    for (const item of itemsForDisplay()) {
      const tour = knownTours.get(item.id);
      const row = document.createElement('li');
      row.className = 'planner-item';
      const info = document.createElement('div');
      info.className = 'planner-item-info';
      const category = document.createElement('span');
      category.className = 'planner-item-category';
      category.textContent = getLanguage() === 'en' ? tour.categoryEn : tour.categoryLabel;
      const heading = document.createElement('strong');
      heading.textContent = tourName(item.id);
      const subtitle = document.createElement('p');
      subtitle.textContent = getLanguage() === 'en' ? tour.shortEn : tour.short;
      info.append(category, heading, subtitle);
      const controls = document.createElement('div');
      controls.className = 'planner-item-actions';
      const dayLabel = document.createElement('label');
      dayLabel.textContent = label('day') + ' ';
      const select = document.createElement('select');
      select.dataset.planDay = item.id;
      select.setAttribute('aria-label', label('day') + ' — ' + tourName(item.id));
      for (let n = 1; n <= 7; n++) {
        const option = document.createElement('option');
        option.value = String(n);
        option.textContent = label('day') + ' ' + n;
        option.selected = item.day === n;
        select.appendChild(option);
      }
      dayLabel.appendChild(select);
      controls.append(dayLabel, createButton(label('remove'), 'planner-remove', () => remove(item.id)));
      row.append(info, controls);
      list.appendChild(row);
    }
    for (const id of ['plannerShare', 'plannerCopy', 'plannerPrint', 'plannerQuote', 'plannerClear']) {
      const button = byId(id);
      button.disabled = !hasItems || (['plannerShare', 'plannerCopy'].includes(id) && !locationIsPublic());
    }
    decorateCards();
    decorateModal();
  }

  let qrRequest = 0;
  async function updateQR() {
    const node = byId('plannerQR');
    if (!node) return;
    const request = ++qrRequest;
    node.replaceChildren();
    if (!items.length || !locationIsPublic()) {
      node.textContent = items.length ? label('noPublic') : label('noPlan');
      return;
    }
    try {
      const { default: QRCode } = await import('qrcode');
      const data = await QRCode.toDataURL(shareUrl(), {
        width: 210, margin: 2, errorCorrectionLevel: 'M',
        color: { dark: '#062d3aff', light: '#ffffffff' }
      });
      if (request !== qrRequest) return;
      const img = document.createElement('img');
      img.src = data;
      img.width = 210;
      img.height = 210;
      img.alt = label('qrAlt');
      node.replaceChildren(img);
    } catch {
      if (request === qrRequest) node.textContent = label('shareFailed');
    }
  }

  function refresh() {
    document.querySelectorAll('[data-planner-i18n]').forEach(element => {
      element.textContent = label(element.dataset.plannerI18n);
    });
    updateList();
    updateQR();
  }

  function storeAndRender() {
    persist();
    refresh();
  }

  function add(id) {
    if (!knownTours.has(id) || isChosen(id) || items.length >= MAX_ITEMS) return;
    items.push({ id, day: 1 });
    storeAndRender();
    showMessage(label('savedMessage'));
  }
  function remove(id) {
    if (!isChosen(id)) return;
    items = items.filter(item => item.id !== id);
    storeAndRender();
    showMessage(label('removedMessage'));
  }
  function toggle(id) { if (isChosen(id)) remove(id); else add(id); }

  byId('tourGrid').addEventListener('click', event => {
    const button = event.target.closest('[data-save-tour]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    toggle(button.dataset.saveTour);
  });
  byId('modalSaveTour').addEventListener('click', () => {
    const tour = getModalTour();
    if (tour) toggle(tour.id);
  });
  byId('plannerList').addEventListener('change', event => {
    const select = event.target.closest('[data-plan-day]');
    if (!select) return;
    const item = items.find(entry => entry.id === select.dataset.planDay);
    const day = Number(select.value);
    if (item && Number.isInteger(day) && day >= 1 && day <= 7) {
      item.day = day;
      storeAndRender();
    }
  });
  byId('plannerClear').addEventListener('click', () => {
    if (items.length && window.confirm(label('consentClear'))) {
      items = []; storeAndRender();
    }
  });
  byId('plannerQuote').addEventListener('click', () => {
    if (!items.length) return;
    const first = knownTours.get(itemsForDisplay()[0].id);
    byId('experienceSelect').value = first.name;
    byId('cotizar').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    byId('dateInput').focus({ preventScroll: true });
  });
  byId('plannerPrint').addEventListener('click', () => { if (items.length) window.print(); });
  async function copyLink() {
    const url = shareUrl();
    if (!url) { showMessage(label('noLink')); return; }
    try {
      await navigator.clipboard.writeText(url);
      showMessage(label('copied'));
    } catch {
      showMessage(label('copyFailed'));
    }
  }
  byId('plannerCopy').addEventListener('click', copyLink);
  byId('plannerShare').addEventListener('click', async () => {
    const url = shareUrl();
    if (!url) return;
    if (!navigator.share) { await copyLink(); return; }
    try {
      await navigator.share({ title: 'Punta Cana Arena y Palmera', url });
    } catch (error) {
      if (error?.name !== 'AbortError') showMessage(label('shareFailed'));
    }
  });
  refresh();

  return {
    decorateCards, decorateModal, refresh, getItems,
    quoteLines: () => itemsForDisplay().map(item =>
      label('day') + ' ' + item.day + ': ' + tourName(item.id))
  };
}
