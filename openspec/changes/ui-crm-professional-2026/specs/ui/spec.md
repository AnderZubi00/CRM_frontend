# Spec delta: UI / CRM ANCAMI

## Requisitos

### R1 — Identidad visual
- El **primary** del tema MUST reflejar azul institucional ANCAMI; el acento secundario MUST ser contenido (no dominar la UI).
- **Given** cualquier pantalla interna, **When** el usuario ve botones primarios o enlaces de acción, **Then** el color MUST cumplir contraste legible sobre fondo claro.

### R2 — Shell administración / empleado
- **Given** usuario admin o empleado en desktop, **When** ve el sidebar, **Then** MUST mostrar icono + etiqueta por ítem y estado activo con **indicador lateral** (rail) visible.
- **Given** viewport móvil, **When** navega, **Then** MUST poder cambiar de sección sin perder contexto (pills scrollables existentes mejoradas visualmente).

### R3 — Área de trabajo
- **Given** sección con tabla (p. ej. Productos), **When** el usuario hace scroll, **Then** el contenedor de datos MUST tener jerarquía clara (cabecera de bloque, bordes/sombras sutiles).
- **Given** lista vacía, **When** no hay registros, **Then** MUST mostrarse mensaje o CTA comprensible (mejora incremental donde ya exista texto).

### R4 — Cliente / tienda
- **Given** catálogo o cesta, **When** el usuario compara con panel interno, **Then** tipografía y primarios MUST sentirse de la misma familia de marca.

### R5 — Público
- **Given** visitante en inicio, **When** carga `/` (home), **Then** MUST ver landing ANCAMI con hero, propuesta de valor breve y CTA a login/registro (sin plantilla blog genérica).

### R6 — Accesibilidad mínima
- **Given** elementos interactivos, **When** navegación por teclado, **Then** focus visible MUST mantenerse (ring del tema).

## Escenarios (Given / When / Then)

1. **Login**  
   **Given** pantalla de login, **When** se muestra el card, **Then** el hero/gradiente MUST ser acorde al nuevo primary (sin sustituir funcionalidad).

2. **Admin — Productos**  
   **Given** admin en Productos, **When** observa la tabla, **Then** la tarjeta contenedora y tipografía MUST alinearse al sistema ANCAMI.

3. **Cliente — Catálogo**  
   **Given** cliente en tienda, **When** ve productos, **Then** precios y botones MUST usar tokens de marca consistentes con `index.css`.
