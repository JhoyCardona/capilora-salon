// components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { apiGetAuth, apiPatchAuth } from '../api/client';
import './Dashboard.css';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiGetAuth('/bookings');
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    setCancellingId(bookingId);

    try {
      await apiPatchAuth(`/bookings/${bookingId}/cancel`);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  if (isLoading) {
    return <p className="dashboard-status">Cargando turnos...</p>;
  }

  return (
    <div>
      {error && <p className="dashboard-status dashboard-error">Error: {error}</p>}

      {bookings.length === 0 && !error && (
        <p className="dashboard-status">Todavía no hay turnos reservados.</p>
      )}

      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className={`booking-item booking-item-${booking.status}`}>
            <div className="booking-item-info">
              <h3>{booking.customer_name}</h3>
              <p>{booking.service_name} · {booking.duration_minutes} min</p>
              <p className="booking-item-datetime">{formatDateTime(booking.start_datetime)}</p>
              <p className="booking-item-contact">
                {booking.customer_phone}
                {booking.customer_email && ` · ${booking.customer_email}`}
              </p>
            </div>

            <div className="booking-item-actions">
              <span className={`booking-badge booking-badge-${booking.status}`}>
                {booking.status === 'booked' ? 'Confirmado' : 'Cancelado'}
              </span>

              {booking.status === 'booked' && (
                <button
                  className="booking-cancel-btn"
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancellingId === booking.id}
                >
                  {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;