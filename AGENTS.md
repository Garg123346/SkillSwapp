# Project Guidance

## User Preferences

- Interface in English (converted from French)
- Harvard academic elegance + MIT innovative spirit aesthetic
- Palette: burgundy #7A1735, deep navy #15263D, warm ivory #FAF8F4, white, subtle gold accents
- Elegant serif headings, clean sans-serif body text
- Professional student photography, minimal icons, subtle shadows, refined hover effects
- Avoid generic templates, excessive gradients, and clutter
- Full-stack Java Spring Boot 3.x backend + PostgreSQL 16 + React 19 frontend
- React, TypeScript, Tailwind CSS, Lucide icons, TanStack Router
- Complete multi-page website with authenticated student dashboard, discovery, requests, chat, and community

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`
- **backend-test**: `mvnw.cmd test`
- **backend-run**: `mvnw.cmd spring-boot:run`

## Learnings

- On Windows PowerShell, avoid executing blocked `.ps1` wrapper files; invoke `pnpm.cmd` directly.
- Frontend build requires cross-platform `node -e` rather than Unix `cp` for copying `env.json`.
- In-memory H2 configuration in `src/test/resources/application.properties` with `spring.sql.init.mode=never` allows clean, fast testing without executing PostgreSQL-specific DDL syntax.
- Stateless JWT authentication in `JwtAuthenticationFilter` smoothly bridges the React frontend and Spring Boot backend without cookie or CORS session discrepancies.
