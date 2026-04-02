# Design: ANCAMI CRM UI

## Tokens

| Token | Uso |
|-------|-----|
| Primary | `hsl(215 90% 42%)` — azul institucional, botones y enlaces |
| Ring | mismo matiz que primary |
| Accent (sidebar activo) | `hsl(215 85% 96%)` fondo + borde izquierdo `primary` |
| Muted surface app | `hsl(210 20% 97%)` |
| Radius | `0.5rem` cards; `0.375rem` inputs |
| Shadow | `sm` en cards de trabajo; sidebar sin sombra pesada |

## Tipografía

- UI: `Inter`, `system-ui`, sans-serif (Google font opcional vía link en `index.html` — implementación: Inter si disponible, fallback system-ui).
- Pesos: 600 títulos sección, 500 navegación, 400 cuerpo.

## Componentes compartidos

- `shell/SidebarNav.jsx`: lista de ítems con `icon`, `id`, `label`, `active`, `onSelect`.
- `shell/sidebarIcons.jsx`: SVGs 20px para cada ruta CRM.

## Layout shell

- Sidebar: ancho 72 (288px), `bg-card`, `border-r`, logo ANCAMI (A en cuadrado `primary`).
- Nav item activo: `bg-primary/8`, `border-l-[3px] border-primary`, texto `text-foreground`.
- Nav item inactivo: `hover:bg-muted/80`.
- Main: `bg-[hsl(210_20%_97%)]` o `bg-muted/40` alineado a token.

## Pantallas tocadas

- `index.css`, `index.html` (font)
- `AdminLayout.jsx`, `EmployeeLayout.jsx`
- `AdminProducts.jsx`, `AdminUsers.jsx` (wrapper + headers)
- `DashboardCliente.jsx`, `VistaProductos.jsx`
- `Header.jsx`, `Home.jsx`, `Login.jsx` (acentos)

## Riesgos

- Regresión visual en modales inline de admin: probar crear/editar producto y usuario.
