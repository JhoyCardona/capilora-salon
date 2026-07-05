// controllers/availability.controller.js
const pool = require('../db');

// CREATE a new availability slot for the logged-in business.
async function createAvailability(req, res) {
  const { day_of_week, start_time, end_time } = req.body;

  if (day_of_week === undefined || !start_time || !end_time) {
    return res.status(400).json({ error: 'day_of_week, start_time and end_time are required' });
  }

  if (day_of_week < 0 || day_of_week > 6) {
    return res.status(400).json({ error: 'day_of_week must be between 0 (Sunday) and 6 (Saturday)' });
  }

  if (start_time >= end_time) {
    return res.status(400).json({ error: 'start_time must be earlier than end_time' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO availability (business_id, day_of_week, start_time, end_time)
       VALUES ($1, $2, $3, $4)
       RETURNING id, day_of_week, start_time, end_time`,
      [req.businessId, day_of_week, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the availability slot' });
  }
}

// LIST all availability slots belonging to the logged-in business.
async function listAvailability(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, day_of_week, start_time, end_time
       FROM availability
       WHERE business_id = $1
       ORDER BY day_of_week, start_time`,
      [req.businessId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching availability' });
  }
}

// DELETE an availability slot, but only if it belongs to the logged-in business.
async function deleteAvailability(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM availability WHERE id = $1 AND business_id = $2 RETURNING id',
      [id, req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong deleting the availability slot' });
  }
}

// Calculates which time slots are actually free for a given service, on a given date.
async function getAvailableSlots(req, res) {
  const { service_id, date } = req.query;

  if (!service_id || !date) {
    return res.status(400).json({ error: 'service_id and date query parameters are required' });
  }

  try {
    // Step 1: get the service's duration and which business it belongs to.
    const serviceResult = await pool.query(
      'SELECT business_id, duration_minutes FROM service WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const { business_id, duration_minutes } = serviceResult.rows[0];

    // Step 2: figure out the day of week for the requested date (0 = Sunday).
    // We append 'T00:00:00' to avoid timezone shifting the date backwards.
    const requestedDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = requestedDate.getDay();

    // Step 3: get the business's availability window(s) for that day of week.
    const availabilityResult = await pool.query(
      'SELECT start_time, end_time FROM availability WHERE business_id = $1 AND day_of_week = $2',
      [business_id, dayOfWeek]
    );

    if (availabilityResult.rows.length === 0) {
      // The business doesn't work on this day at all.
      return res.json({ date, service_id, available_slots: [] });
    }

    // Step 4: get existing, non-cancelled bookings for this service on this date.
    const bookingsResult = await pool.query(
      `SELECT start_datetime
       FROM booking
       WHERE service_id = $1
         AND status = 'booked'
         AND start_datetime::date = $2::date`,
      [service_id, date]
    );

    const existingBookings = bookingsResult.rows.map((row) => new Date(row.start_datetime));

    // Step 5: generate and filter slots for every availability window that day.
    const availableSlots = [];

    for (const window of availabilityResult.rows) {
      // Build real Date objects for the window's start and end, on the requested date.
      const windowStart = new Date(`${date}T${window.start_time}`);
      const windowEnd = new Date(`${date}T${window.end_time}`);

      let candidateStart = new Date(windowStart);

      while (true) {
        const candidateEnd = new Date(candidateStart.getTime() + duration_minutes * 60000);

        // Stop if this slot would run past the end of the availability window.
        if (candidateEnd > windowEnd) break;

        // Check whether this candidate slot overlaps any existing booking.
        const overlaps = existingBookings.some((bookingStart) => {
          const bookingEnd = new Date(bookingStart.getTime() + duration_minutes * 60000);
          return candidateStart < bookingEnd && candidateEnd > bookingStart;
        });

        if (!overlaps) {
          // Format as "HH:MM" for the response.
          const hours = String(candidateStart.getHours()).padStart(2, '0');
          const minutes = String(candidateStart.getMinutes()).padStart(2, '0');
          availableSlots.push(`${hours}:${minutes}`);
        }

        // Move to the next candidate slot.
        candidateStart = candidateEnd;
      }
    }

    res.json({ date, service_id, available_slots: availableSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong calculating available slots' });
  }
}

module.exports = { createAvailability, listAvailability, deleteAvailability, getAvailableSlots };
