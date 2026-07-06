// App.jsx
import { useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';

function App() {
  const [currentView, setCurrentView] = useState('public');
  const [selectedService, setSelectedService] = useState(null);

  function handleSelectService(service) {
    setSelectedService(service);
  }

  function handleBackToServices() {
    setSelectedService(null);
  }

  return (
    <div>
      <Hero />

      <main>
        {currentView === 'public' && !selectedService && (
          <Services onSelectService={handleSelectService} />
        )}

        {currentView === 'public' && selectedService && (
          <Booking selectedService={selectedService} onBack={handleBackToServices} />
        )}

        {currentView === 'login' && <p>Acá va el login del panel</p>}
      </main>
    </div>
  );
}

export default App;