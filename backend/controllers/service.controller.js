// controllers/service.controller.js
const pool = require('../db');

// CREATE a new service for the logged-in business.
async function createService(req, res) {
  const { name, duration_minutes } = req.body;

  if (!name || !duration_minutes) {
    return res.status(400).json({ error: 'name and duration_minutes are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO service (business_id, name, duration_minutes)
       VALUES ($1, $2, $3)
       RETURNING id, name, duration_minutes`,
      [req.businessId, name, duration_minutes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the service' });
  }
}

// LIST all services belonging to the logged-in business.
async function listServices(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, duration_minutes FROM service WHERE business_id = $1 ORDER BY id',
      [req.businessId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching services' });
  }
}

// UPDATE a service, but only if it belongs to the logged-in business.
async function updateService(req, res) {
  const { id } = req.params;
  const { name, duration_minutes } = req.body;

  if (!name || !duration_minutes) {
    return res.status(400).json({ error: 'name and duration_minutes are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE service
       SET name = $1, duration_minutes = $2
       WHERE id = $3 AND business_id = $4
       RETURNING id, name, duration_minutes`,
      [name, duration_minutes, id, req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong updating the service' });
  }
}

// DELETE a service, but only if it belongs to the logged-in business.
async function deleteService(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM service WHERE id = $1 AND business_id = $2 RETURNING id',
      [id, req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong deleting the service' });
  }
}

module.exports = { createService, listServices, updateService, deleteService };