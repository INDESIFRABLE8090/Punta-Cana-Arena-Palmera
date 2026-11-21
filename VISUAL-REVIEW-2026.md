# THE LIVING COAST — primera escena implementada y verificada

**Estado: candidato privado para revisión visual. No publicado, no aprobado para entregar al cliente.**

## Qué está construido

- Hero original de costa/oceáno con shader WebGL1 `living-coast.frag`; implementado sin fotos, vídeos ni capturas de referencia.
- La composición editorial `living-coast.css` sustituye el hero anterior; conservó todo el código de catálogo, cotizador, planificador y modal de excursiones. La escena Three.js del hero anterior no se arranca en esta variante para evitar dos bucles de render en portada.
- Tres ambientes **Mar, Tierra y Noche** permiten cambiar la atmósfera, con el filtro de excursiones sincronizado por capítulo.
- Navegación en español e inglés, título grande con entrada coreografiada, nuevos CTA y marca de prototipo `Arena y Palma` (nombre comercial por confirmar).
- Adaptación de WebGL: resolución limitada, 30fps escritorio y 18fps procesadores modestos, pausa fuera de vista o en pestaña oculta, evita ejecución si `saveData`, memoria baja o `prefers-reduced-motion`; fondo estático sin WebGL como alternativa.
- El CTA flotante no tapa los controles mientras el hero está a la vista, pero reaparece en secciones posteriores.
- Se recuperó la ficha de **Isla Catalina** entre los folletos de la segunda tanda, elevando trazabilidad visual del catálogo a **11 de 11 flyers**; aún sin confirmar precios, horarios ni operaciones actuales.

## QA ejecutado

**[GitHub Actions 44851392655](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44851392655) — SUCCESS.** Código compiló con Vite. Chrome visitó un servidor local privado:

| Comprobación | 390px | 768px | 1440px |
|---|---|---|---|
| Portada visible | PASS | PASS | PASS |
| WebGL operativo en Chrome de prueba | PASS | PASS | PASS |
| Fondo CSS alternativo disponible | PASS | PASS | PASS |
| Desbordamiento horizontal | NO | NO | NO |
| Catálogo original de 11 excursiones presente | PASS | PASS | PASS |

Pruebas de interacción en escritorio: los capítulos Mar/Tierra/Noche cambiaron estado y filtraron el catálogo a 6/2/1 excursiones; el idioma cambió y el planificador siguió añadiendo excursiones. En un navegador con movimiento reducido **WebGL no arrancó, la animación del titular quedó desactivada y el fallback CSS siguió visible**.

**Capturas REALES de navegador**: artefacto privado `living-coast-private-screenshots` adjunto al mismo run (390, 768, 1440 y 390 reduced-motion; caduca a los 3 días). No confundir las capturas con mockups generados por IA.

Un run previo 44851142557 tuvo una aserción demasiado literal de capitalización después de cambiar idioma; el sitio sí traducía, se corrigió el test y el run definitivo pasó. El botón flotante fue reposicionado antes de la segunda captura.

## Lo que NO está listo

1. El resto de la landing mantiene el diseño anterior: sección de catálogo, mapa y traslados **aún no fueron rediseñados cinematográficamente**. Ésta es **la primera escena** de la exploración, no una web terminada Awwwards.
2. La composición utiliza código procedural y sigue siendo más estilizada que fotorrealista; el arte final puede requerir assets originales con derechos comerciales claros.
3. ES/EN funcionan; el tercero PT requiere traducción y QA. El idioma no se presenta como innovación.
4. Los datos de los once folletos no prueban la disponibilidad comercial actual. La empresa debe confirmar servicios, condiciones, marca y material fotográfico.
5. El proyecto existente aún incluye un chunk Three.js pesado, señalado por Vite. Antes de lanzamiento hay que medir Web Vitals/Lighthouse y rendimiento en **Android físico**. Estas pruebas Chrome no son prueba en teléfono real.
6. No hay procesamiento de pago, reservas confirmadas, backend de clientes ni generación automática de contenidos.

Ningún despliegue al sitio público, ningún contacto con clientes, ninguna máquina AWS/Codespaces ni modelos Claude/Codex fue ejecutado para esta fase. GitHub Actions sí consumió minutos de CI privados.

**Próxima fase**: convertir el catálogo de excursiones en capítulos inmersivos con transiciones de elemento compartido y detalle comercial verificable; medir en Chrome real y móvil. Preservar rama funcional `chatgpt/arena-premium-planner-r1` y PR #1.
