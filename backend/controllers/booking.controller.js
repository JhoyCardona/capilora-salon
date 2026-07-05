// controllers/booking.controller.js
const pool = require('../db');

// CREATE a new booking for a given service, checking that the time slot
// doesn't overlap with an existing booking for the same service.
async function createBooking(req, res) {
  const { service_id, customer_name, customer_phone, customer_email, start_datetime } = req.body;

  if (!service_id || !customer_name || !customer_phone || !start_datetime) {
    return res.status(400).json({
      error: 'service_id, customer_name, customer_phone and start_datetime are required',
    });
  }

  try {
    // First, confirm the service exists and belongs to a business
    // (we need its duration to calculate the end time).
    const serviceResult = await pool.query(
      'SELECT id, duration_minutes FROM service WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const durationMinutes = serviceResult.rows[0].duration_minutes;

    // Check for overlapping bookings on the same service.
    // Two time ranges overlap if: existing.start < new.end AND existing.end > new.start
    const overlapResult = await pool.query(
      `SELECT id FROM booking
       WHERE service_id = $1
         AND status = 'booked'
         AND start_datetime < ($2::timestamp + ($3 || ' minutes')::interval)
         AND (start_datetime + (
               (SELECT duration_minutes FROM service WHERE id = $1) || ' minutes'
             )::interval) > $2::timestamp`,
      [service_id, start_datetime, durationMinutes]
    );

    if (overlapResult.rows.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const result = await pool.query(
      `INSERT INTO booking (service_id, customer_name, customer_phone, customer_email, start_datetime)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, service_id, customer_name, customer_phone, customer_email, start_datetime, status`,
      [service_id, customer_name, customer_phone, customer_email || null, start_datetime]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the booking' });
  }
}

// LIST all bookings for the logged-in business (across all its services).
async function listBookings(req, res) {
  try {
    const result = await pool.query(
      `SELECT b.id, b.customer_name, b.customer_phone, b.customer_email,
              b.start_datetime, b.status, s.name AS service_name, s.duration_minutes
       FROM booking b
       JOIN service s ON s.id = b.service_id
       WHERE s.business_id = $1
       ORDER BY b.start_datetime`,
      [req.businessId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching bookings' });
  }
}

// CANCEL a booking, but only if it belongs to the logged-in business.
async function cancelBooking(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE booking b
       SET status = 'cancelled'
       FROM service s
       WHERE b.service_id = s.id
         AND b.id = $1
         AND s.business_id = $2
       RETURNING b.id, b.status`,
      [id, req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong cancelling the booking' });
  }
}

module.exports = { createBooking, listBookings, cancelBooking };