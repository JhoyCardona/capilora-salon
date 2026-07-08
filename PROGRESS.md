# Development Progress — Hair Salon Booking System

## Day 1 — Backend

### Planning
- Defined project scope (v1 features vs. explicitly excluded features)
- Designed the data model: `business`, `service`, `availability`, `booking` tables
- Defined a 3-layer architecture: React frontend → Node/Express backend → PostgreSQL database

### Environment setup
- Initialized the backend project with `npm init`
- Installed core dependencies: `express`, `pg`, `cors`, `dotenv`, `nodemon`
- Installed auth dependencies: `bcrypt`, `jsonwebtoken`
- Set up PostgreSQL locally and created the `booking_system` database
- Configured environment variables (`PORT`, `DATABASE_URL`, `JWT_SECRET`)

### Database
- Wrote and executed `sql/schema.sql`, creating all 4 tables with proper foreign keys and constraints

### Backend features built and tested
- **Auth:** business registration (hashed passwords), login (JWT), protected `/me` route, auth middleware
- **Services:** full CRUD, protected by auth
- **Availability:** create/list/delete time windows, protected by auth
- **Available slots calculation:** public endpoint that cross-references availability + existing bookings + service duration to return real open time slots
- **Bookings:** public creation (with overlap validation), protected listing and cancellation

### Version control
- Initialized Git, made the first commit, and pushed to GitHub:
  https://github.com/JhoyCardona/hair-salon-booking-system

## Day 2 — Frontend

### Visual identity
- Defined a visual direction ("Botánica": forest green + dusty rose + warm beige, serif headings)
- Chose the business name "Capilora Salón" and a hero style inspired by real salon branding sites
- Sourced a hero image and video from free stock resources (Unsplash / compressed stock video)

### Environment setup
- Initialized the frontend with Vite + React, ESLint
- Set up a centralized `api/client.js` for all backend requests (`apiGet`, `apiPost`, and authenticated variants)
- Used environment variables (`VITE_API_URL`) to decouple the frontend from a hardcoded backend URL

### Public booking flow
- **Hero:** full-bleed responsive video (desktop/tablet) with a still-image fallback on mobile, mobile-first CSS with media queries
- **Services:** public list of services fetched from a new public backend endpoint
- **Booking:** date picker → real-time available slots (calling the slots calculation endpoint) → customer form → booking confirmation
- **InfoBar & Footer:** business contact info section and a footer with social placeholders, using a sticky-footer layout (flexbox) so the footer always sits at the bottom of the viewport

### Business panel (authenticated)
- **Login:** JWT-based login, token persisted in `localStorage`
- **Panel layout:** tabbed navigation (Turnos / Servicios / Horarios) inside a single authenticated view
- **Bookings tab:** list bookings, cancel with optimistic reload
- **Services tab:** full CRUD (create/list/delete) from the UI, no more manual Postman calls
- **Availability tab:** create/list/delete weekly time windows from the UI

### Polish
- Fixed responsive issues (hero height on mobile, sticky footer)
- Added a custom favicon matching the brand palette
- Set the document title

### Backend adjustments made along the way
- Added a public `GET /api/services/public?business_id=` endpoint (the original one required auth, which doesn't work for anonymous customers)

## Day 3 — Deploy & Launch

### Infrastructure
- **Database:** created a production Postgres instance on Neon, ran `schema.sql` against it
- **Backend:** deployed to Render (Root Directory set to `backend`, environment variables for `DATABASE_URL` and a freshly generated `JWT_SECRET`)
- **Frontend:** deployed to Vercel (Root Directory set to `frontend`, `VITE_API_URL` pointing to the Render backend)

### Production data
- Re-registered the business, services, and availability directly against the production API (Postman)

### Portfolio
- Added the project to Workana's "Proyectos Destacados" (direct upload, not via Behance — not required for the Programming category)
- Wrote `README.md` with project overview, live demo link, feature list, architecture summary, and local setup instructions
- Added screenshots to the README

### Key concepts learned this project
- REST API design (routes/controllers/middleware separation)
- JWT authentication and route protection
- SQL joins, parameterized queries, and overlap-detection logic (both in SQL and in JS)
- React fundamentals: state, props, `useEffect` with dependencies, controlled forms, conditional rendering, lifting state up
- Responsive, mobile-first CSS (flexbox, grid, media queries)
- Environment variables for multi-environment deployments (local vs. production)
- Full deploy pipeline across three separate platforms (Vercel + Render + Neon)
