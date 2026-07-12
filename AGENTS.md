# AgroPlan Colombia Frontend - Agent Notes

## Verification Commands

Run these from the repository root in PowerShell. Use the local binaries directly because `pnpm` may block on ignored build scripts (e.g., `unrs-resolver`).

```powershell
# Lint
.\node_modules\.bin\eslint.cmd .

# TypeScript check
.\node_modules\.bin\tsc.cmd --noEmit

# Production build
.\node_modules\.bin\next.cmd build
```

## Layout / Navigation Conventions

- `AppShell` is the shared wrapper for the `(main)` route group. It renders `AppSidebar`, `MobileTopbar`, `BottomNav`, and the global footer.
- `AppSidebar` is route-aware and renders different navigation items for `/concurso`, `/mapa/[id]`, and `/[departamento]/[municipio]`.
- `AppSidebar` uses `useSearchParams` and `useParams`, so it must stay inside a `Suspense` boundary. `AppShell` provides that boundary.
- `ConcursoPage` also uses `useSearchParams` to read the active section from `?section=`, so it is wrapped in `Suspense` in its own page file.

## Framework Version

- This project runs on **Next.js 16.2.6 (Turbopack)**.
