// components/Booking.jsx
import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../api/client';
import './Booking.css';

function Booking({ selectedService, onBack }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    async function loadSlots() {
      setIsLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);

      try {
        const data = await apiGet(
          `/availability/slots?service_id=${selectedService.id}&date=${selectedDate}`
        );
        setSlots(data.available_slots);
      } catch (err) {
        setSlotsError(err.message);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedDate, selectedService.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await apiPost('/bookings', {
        service_id: selectedService.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || undefined,
        start_datetime: `${selectedDate}T${selectedSlot}:00`,
      });

      setIsConfirmed(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isConfirmed) {
    return (
      <section className="booking">
        <div className="booking-confirmation">
          <h2>¡Turno reservado!</h2>
          <p>
            {selectedService.name} el {selectedDate} a las {selectedSlot}.
          </p>
          <button className="booking-back" onClick={onBack}>
            ← Volver a servicios
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="booking">
      <button className="booking-back" onClick={onBack}>
        ← Volver a servicios
      </button>

      <p className="booking-eyebrow">Reservando</p>
      <h2>{selectedService.name}</h2>
      <p className="booking-duration">{selectedService.duration_minutes} min</p>

      <label className="booking-label" htmlFor="booking-date">
        Elegí una fecha
      </label>
      <input
        id="booking-date"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="booking-date-input"
      />

      {isLoadingSlots && <p className="booking-status">Buscando horarios...</p>}
      {slotsError && <p className="booking-status booking-error">Error: {slotsError}</p>}

      {!isLoadingSlots && selectedDate && slots.length === 0 && !slotsError && (
        <p className="booking-status">No hay horarios disponibles ese día.</p>
      )}

      {slots.length > 0 && (
        <div className="booking-slots">
          {slots.map((slot) => (
            <button
              key={slot}
              className={`booking-slot ${selectedSlot === slot ? 'booking-slot-selected' : ''}`}
              onClick={() => setSelectedSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {selectedSlot && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="booking-label" htmlFor="customer-name">
            Nombre
          </label>
          <input
            id="customer-name"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="booking-text-input"
          />

          <label className="booking-label" htmlFor="customer-phone">
            Teléfono
          </label>
          <input
            id="customer-phone"
            type="tel"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="booking-text-input"
          />

          <label className="booking-label" htmlFor="customer-email">
            Email (opcional)
          </label>
          <input
            id="customer-email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="booking-text-input"
          />

          {submitError && <p className="booking-status booking-error">Error: {submitError}</p>}

          <button type="submit" className="booking-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Reservando...' : 'Confirmar reserva'}
          </button>
        </form>
      )}
    </section>
  );
}

export default Booking;