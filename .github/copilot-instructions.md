# Copilot instructions for kat-coffee

## Build, test, and lint commands

### Frontend (React + Vite)
Run everything from `client/`:

- `npm install`
- `npm run dev` — starts the Vite app on `http://localhost:5173`
- `npm run build` — runs `tsc -b && vite build`
- `npm run lint` — runs `oxlint`
- `npm run preview` — serves the production build locally

There is no `npm test` script in `client/package.json`, and no test runner or test project is configured in the repo right now.

### Backend (.NET API + Identity)
Run everything from `server/`:

- `dotnet restore`
- `dotnet build KatCoffee.slnx`
- `dotnet run --project KatCoffee.API/KatCoffee.API.csproj`
- `dotnet run --project KatCoffee.IdentityServer/KatCoffee.IdentityServer.csproj`

There are no `.csproj` test projects in this repository, so there is no `dotnet test` command configured at the moment.

### Local service URLs
- Client: `http://localhost:5173`
- Resource API: `http://localhost:5001`
- Identity Server: `https://localhost:7001`

## High-level architecture

This repo is a small full-stack POS app split into three major parts:

- `client/` is the React frontend. It uses Vite, Redux Toolkit, TanStack Query, and Axios. The app layer is centered on product filtering and cart flow (`src/App.tsx`, `src/store/*`, `src/hooks/useProducts.ts`, and the `components/` folder).
- `server/` is the business backend. It is a .NET 10 solution with:
  - `KatCoffee.Domain` for domain models (`Product`, `Category`)
  - `KatCoffee.Infrastructure` for EF Core `AppDbContext` and startup seeding (`DbSeeder.cs`)
  - `KatCoffee.API` for the HTTP API (`ProductsController.cs`)
- `identity/` is a separate ASP.NET Core Identity server. It configures ASP.NET Identity, creates default roles (`Admin`, `Staff`), and issues JWT tokens for the client/API pair.

The app is intentionally split by responsibility:

- The React client calls the resource API at `http://localhost:5001/api/Products`
- The resource API validates JWTs issued by the identity server
- The Identity Server stores user data and issues tokens using the shared JWT settings in `appsettings*.json`

## Key conventions

- Keep the JWT configuration in sync across both services when changing issuer/audience/secret values. The resource API and identity server both rely on the same `JWT` settings in their appsettings files.
- The resource API uses `AppDbContext` with EF Core and automatically runs migrations and database seeding on startup (`Database.MigrateAsync(); DbSeeder.SeedAsync(db);`). If you add a new model, update `AppDbContext` and keep the database lifecycle in mind.
- The frontend uses Redux for `filters` and `cart` state, and TanStack Query for server data (`useProducts` caches data for 60 seconds and passes category/search query parameters to the API).
- The client API layer is intentionally split into `resourceApi` and `authApi` in `client/src/api/axiosClient.ts`; keep auth-related headers and base URLs consistent if you change ports or token handling.
- CORS is configured per service and currently hard-coded for the local Vite client (`http://localhost:5173`); update both service CORS policies together when adjusting local origins.
- This repo has mixed-language comments and naming patterns (notably Vietnamese in the backend and English in the frontend). Preserve that local style when editing code and comments.
- The default seeded admin account is `admin@katcoffee.com` with password `KatCoffee@123` in the identity service; this is used for local development and should be treated as a dev-only credential.

## Working style for this repo

- Prefer changes that respect the existing split between frontend, business API, and identity responsibilities instead of adding ad hoc logic in the wrong boundary.
- When debugging auth or data issues, check the appsettings and startup wiring in both the API and Identity Server together; they are tightly coupled.
- For feature work in the client, keep the pattern of Redux slices + React Query hooks rather than introducing a second state pattern.
