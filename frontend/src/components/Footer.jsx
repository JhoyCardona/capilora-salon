// components/Footer.jsx
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-logo">CAPILORA</span>
        <p>Cuidado personal en el corazón de Bogotá.</p>
      </div>

      <div className="footer-social">
        <a href="#" aria-label="Instagram" className="footer-icon">
          IG
        </a>
        <a href="#" aria-label="Facebook" className="footer-icon">
          FB
        </a>
        <a href="#" aria-label="WhatsApp" className="footer-icon">
          WA
        </a>
      </div>

      <p className="footer-copyright">© 2026 Capilora Salón. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;