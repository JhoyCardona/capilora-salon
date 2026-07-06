// components/Panel.jsx
import { useState } from 'react';
import Dashboard from './Dashboard';
import './Panel.css';

function Panel({ business }) {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <section className="panel">
      <div className="panel-header">
        <p className="panel-eyebrow">Panel de</p>
        <h2>{business.name}</h2>
      </div>

      <nav className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === 'bookings' ? 'panel-tab-active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Turnos
        </button>
        <button
          className={`panel-tab ${activeTab === 'services' ? 'panel-tab-active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Servicios
        </button>
        <button
          className={`panel-tab ${activeTab === 'availability' ? 'panel-tab-active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          Horarios
        </button>
      </nav>

      <div className="panel-content">
        {activeTab === 'bookings' && <Dashboard />}
        {activeTab === 'services' && <p>Acá va la gestión de servicios</p>}
        {activeTab === 'availability' && <p>Acá va la gestión de horarios</p>}
      </div>
    </section>
  );
}

export default Panel;