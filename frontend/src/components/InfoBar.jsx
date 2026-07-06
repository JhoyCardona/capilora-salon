// components/InfoBar.jsx
import { MapPin, Phone, Clock } from 'lucide-react';
import './InfoBar.css';

function InfoBar() {
  return (
    <section className="info-bar">
      <div className="info-item">
        <MapPin size={18} strokeWidth={1.5} />
        <span>Calle 85 #12-34, Bogotá</span>
      </div>
      <div className="info-item">
        <Phone size={18} strokeWidth={1.5} />
        <span>+57 300 123 4567</span>
      </div>
      <div className="info-item">
        <Clock size={18} strokeWidth={1.5} />
        <span>Lun a Vie: 9:00–19:00 · Sáb: 9:00–14:00</span>
      </div>
    </section>
  );
}

export default InfoBar;