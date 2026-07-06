// components/ServicesManager.jsx
import { useState, useEffect } from 'react';
import { apiGetAuth, apiPostAuth, apiDeleteAuth } from '../api/client';
import './ServicesManager.css';

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiGetAuth('/services');
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await apiPostAuth('/services', {
        name,
        duration_minutes: Number(durationMinutes),
      });

      setName('');
      setDurationMinutes('');
      await loadServices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(serviceId) {
    setDeletingId(serviceId);

    try {
      await apiDeleteAuth(`/services/${serviceId}`);
      await loadServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return <p className="manager-status">Cargando servicios...</p>;
  }

  return (
    <div>
      {error && <p className="manager-status manager-error">Error: {error}</p>}

      <div className="manager-list">
        {services.map((service) => (
          <div key={service.id} className="manager-item">
            <div>
              <h3>{service.name}</h3>
              <p>{service.duration_minutes} min</p>
            </div>
            <button
              className="manager-delete-btn"
              onClick={() => handleDelete(service.id)}
              disabled={deletingId === service.id}
            >
              {deletingId === service.id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        ))}
      </div>

      <form className="manager-form" onSubmit={handleCreate}>
        <p className="manager-form-title">Agregar nuevo servicio</p>

        <label className="manager-label" htmlFor="service-name">
          Nombre
        </label>
        <input
          id="service-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="manager-input"
        />

        <label className="manager-label" htmlFor="service-duration">
          Duración (minutos)
        </label>
        <input
          id="service-duration"
          type="number"
          min="1"
          required
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          className="manager-input"
        />

        {formError && <p className="manager-status manager-error">Error: {formError}</p>}

        <button type="submit" className="manager-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Agregando...' : 'Agregar servicio'}
        </button>
      </form>
    </div>
  );
}

export default ServicesManager;