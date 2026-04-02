# ANCAMI — Frontend: guía para agentes (SDD + skills)

## Contexto

Aplicación **React + Vite** en esta carpeta (`Cliente/`). Backend Express en `../Servidor/`. Marca **ANCAMI**.

## Desarrollo guiado por especificaciones (SDD)

Configuración en `openspec/config.yaml`. Estructura:

- `openspec/specs/` — especificaciones base del producto (cuando existan).
- `openspec/changes/<nombre>/` — un cambio activo: `proposal.md`, `specs/`, `design.md`, `tasks.md`, `verify-report.md`.
- `openspec/changes/archive/` — cambios cerrados.

### Orquestación (orden eficiente)

1. **Explorar** (opcional): aclarar requisitos → notas o `exploration.md` en la carpeta del cambio.
2. **Proponer**: redactar `proposal.md` (qué, por qué, fuera de alcance).
3. **Especificar**: delta en `specs/<dominio>/spec.md` con escenarios Given/When/Then.
4. **Diseñar**: `design.md` (componentes, rutas, API, riesgos).
5. **Tareas**: `tasks.md` con checklist numerada.
6. **Aplicar**: implementar en código; marcar tareas hechas.
7. **Verificar**: `verify-report.md` + `npm run lint` y pruebas manuales.
8. **Archivar**: mover carpeta a `changes/archive/YYYY-MM-DD-<nombre>/` y fusionar specs al árbol principal si aplica.

Para cada fase, si el usuario tiene skills **sdd-*** en Cursor (`~/.cursor/skills/`), seguir las instrucciones del skill correspondiente leyendo `SKILL.md`.

### Registro de skills del proyecto

Ver `.atl/skill-registry.md`.

### Una sola copia en disco

- **Fuente real** (Anthropic / Vercel): `.agents/skills/` (`skills-lock.json`).
- **Claude / `.agent`**: symlinks a `.agents/skills/` (ya estaban).
- **Cursor**: `.cursor/skills/` incluye `ui-ux-pro-max` y **symlinks** a `frontend-design` y `vercel-react-best-practices` para no duplicar carpetas.

## UI / UX

Antes de diseñar o refactorizar interfaces, leer y seguir:

`.cursor/skills/ui-ux-pro-max/SKILL.md`

Incluye stacks React, Tailwind y patrones alineados con shadcn.

## Convenciones de código

- Alias `@/` → `src/`.
- Componentes en `src/components/`; servicios API en `src/services/api.js`.
- Mantener coherencia con dashboards existentes (admin / empleado / cliente).

## Comandos útiles

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run lint     # ESLint
```
