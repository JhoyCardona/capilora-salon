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

## Day 2 — Frontend (in progress)

- _(To be filled in as we build it)_