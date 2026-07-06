// components/Hero.jsx
import './Hero.css';
import heroImage from '../assets/salon-hero.png';
import heroVideo from '../assets/salon-hero.mp4';

function Hero() {
  return (
    <section className="hero">
      <img src={heroImage} alt="" className="hero-fallback-image" />
      <video
        className="hero-video"
        src={heroVideo}
        poster={heroImage}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="hero-overlay">
        <nav className="hero-nav">
          <span className="hero-logo">CAPILORA</span>
          <button className="hero-login-btn">Ingresar</button>
        </nav>

        <div className="hero-content">
          <h1>Capilora Salón</h1>
          <p>Cuidado personal · Reservá en línea</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;