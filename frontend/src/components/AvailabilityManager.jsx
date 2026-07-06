// components/AvailabilityManager.jsx
import { useState, useEffect } from 'react';
import { apiGetAuth, apiPostAuth, apiDeleteAuth } from '../api/client';
import './AvailabilityManager.css';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function AvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiGetAuth('/availability');
      setSlots(data);
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
      await apiPostAuth('/availability', {
        day_of_week: Number(dayOfWeek),
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
      });

      setStartTime('');
      setEndTime('');
      await loadSlots();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(slotId) {
    setDeletingId(slotId);

    try {
      await apiDeleteAuth(`/availability/${slotId}`);
      await loadSlots();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return <p className="manager-status">Cargando horarios...</p>;
  }

  return (
    <div>
      {error && <p className="manager-status manager-error">Error: {error}</p>}

      <div className="manager-list">
        {slots.map((slot) => (
          <div key={slot.id} className="manager-item">
            <div>
              <h3>{DAY_NAMES[slot.day_of_week]}</h3>
              <p>{slot.start_time.slice(0, 5)} a {slot.end_time.slice(0, 5)}</p>
            </div>
            <button
              className="manager-delete-btn"
              onClick={() => handleDelete(slot.id)}
              disabled={deletingId === slot.id}
            >
              {deletingId === slot.id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        ))}
      </div>

      <form className="manager-form" onSubmit={handleCreate}>
        <p className="manager-form-title">Agregar nueva franja horaria</p>

        <label className="manager-label" htmlFor="availability-day">
          Día
        </label>
        <select
          id="availability-day"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className="manager-input"
        >
          {DAY_NAMES.map((dayName, index) => (
            <option key={index} value={index}>
              {dayName}
            </option>
          ))}
        </select>

        <label className="manager-label" htmlFor="availability-start">
          Desde
        </label>
        <input
          id="availability-start"
          type="time"
          required
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="manager-input"
        />

        <label className="manager-label" htmlFor="availability-end">
          Hasta
        </label>
        <input
          id="availability-end"
          type="time"
          required
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="manager-input"
        />

        {formError && <p className="manager-status manager-error">Error: {formError}</p>}

        <button type="submit" className="manager-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Agregando...' : 'Agregar horario'}
        </button>
      </form>
    </div>
  );
}

export default AvailabilityManager;