# Proposal: UI CRM profesional ANCAMI

## Objetivo

Elevar la interfaz a estándar **SaaS CRM**: jerarquía visual clara, marca ANCAMI coherente, menos estética genérica “gradiente morado”, mejor legibilidad en datos densos.

## Alcance (fases)

1. **Fase A — Fundaciones**: tokens de color y tipografía; `index.css` / shadcn.
2. **Fase B — Shells**: sidebar con iconos + rail activo; topbar con breadcrumb.
3. **Fase C — Vistas CRM**: contenedores de tabla/formulario (Productos, Usuarios y patrón reutilizable).
4. **Fase D — Cliente**: tienda y cesta alineadas a tokens.
5. **Fase E — Público**: landing ANCAMI mínima + header coherente.

## Fuera de alcance

- Cambios de lógica de negocio o API.
- Dark mode completo (tokens preparados; activación opcional futura).
- Rediseño de flujos no listados (p. ej. Reportes profundo) salvo herencia visual del shell.

## Rollback

Revertir commits que toquen `index.css`, `shell/*`, layouts y vistas; restaurar `Home.jsx`/`Header.jsx` desde historial si hiciera falta.
