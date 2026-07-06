// components/Services.jsx
import { useState, useEffect } from 'react';
import { apiGet } from '../api/client';
import './Services.css';

const BUSINESS_ID = 1;

function Services({ onSelectService }) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await apiGet(`/services/public?business_id=${BUSINESS_ID}`);
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, []);

  if (isLoading) {
    return <p className="services-status">Cargando servicios...</p>;
  }

  if (error) {
    return <p className="services-status services-error">No pudimos cargar los servicios: {error}</p>;
  }

  return (
    <section className="services">
      <p className="services-eyebrow">Servicios</p>
      <div className="services-grid">
        {services.map((service) => (
          <button
            key={service.id}
            className="service-card"
            onClick={() => onSelectService(service)}
          >
            <h3>{service.name}</h3>
            <p>{service.duration_minutes} min</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Services;