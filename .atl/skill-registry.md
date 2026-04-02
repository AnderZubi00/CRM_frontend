# Skill registry — Cliente (ANCAMI)

## Dónde vive cada cosa (sin duplicar archivos)

| Ubicación | Rol |
|-----------|-----|
| **`.agents/skills/`** | Copia real de skills instalados con el gestor (ver `skills-lock.json`): `frontend-design`, `vercel-react-best-practices`. |
| **`.cursor/skills/`** | Cursor lee aquí: `ui-ux-pro-max` (instalado con `uipro`) + **enlaces** a los de `.agents/`. |
| **`.claude/skills/`** | Symlinks → `.agents/skills/` (mismo contenido, una sola copia). |
| **`.agent/skills/`** | Symlinks → `.agents/skills/` (mismo contenido, una sola copia). |

No hay tres copias del mismo skill: **la fuente de verdad** para Anthropic/Vercel es `.agents/skills/`. Claude Code y `.agent` ya apuntaban ahí; **Cursor ahora también** vía symlinks en `.cursor/skills/`.

## Skills en este proyecto

| Skill | Ruta efectiva (Cursor) |
|-------|-------------------------|
| **ui-ux-pro-max** | `.cursor/skills/ui-ux-pro-max/SKILL.md` |
| **frontend-design** | `.cursor/skills/frontend-design/SKILL.md` → `.agents/skills/...` |
| **vercel-react-best-practices** | `.cursor/skills/vercel-react-best-practices/SKILL.md` → `.agents/skills/...` |

## Disparadores (resumen)

- **ui-ux-pro-max**: diseño UI, landing, dashboards, accesibilidad, paletas, revisión UX.
- **frontend-design**: interfaces distintivas, alta calidad visual.
- **vercel-react-best-practices**: rendimiento y patrones React (reglas en `rules/`).

## SDD global

Skills `sdd-*` suelen estar en `~/.cursor/skills/` (no en este repo).

## Actualizar skills de `.agents/`

Usa el mismo CLI que usaste para instalarlos (p. ej. OpenCode / agent skills). Tras actualizar, los symlinks en `.cursor/skills/` siguen válidos.
