-- schema.sql
-- Defines the full database structure for the booking system.

-- A business is the account that logs in and manages its own services,
-- availability, and bookings.
CREATE TABLE business (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- A service is something a business offers (e.g. "Haircut", 30 minutes).
CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    duration_minutes INTEGER NOT NULL
);

-- Availability defines which hours a business is open, per day of the week.
-- day_of_week: 0 = Sunday, 1 = Monday, ... 6 = Saturday
CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- A booking is a concrete reservation made by an end customer for a service.
CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(150),
    start_datetime TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled'))
);