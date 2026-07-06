// App.jsx
import { useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';
import Login from './components/Login';
import Panel from './components/Panel';

function App() {
  const [currentView, setCurrentView] = useState('public');
  const [selectedService, setSelectedService] = useState(null);
  const [loggedInBusiness, setLoggedInBusiness] = useState(null);

  function handleSelectService(service) {
    setSelectedService(service);
  }

  function handleBackToServices() {
    setSelectedService(null);
  }

  function handleLoginSuccess(business) {
    setLoggedInBusiness(business);
  }

  return (
    <div>
      <Hero onLoginClick={() => setCurrentView('login')} />

      <main>
        {currentView === 'public' && !selectedService && (
          <Services onSelectService={handleSelectService} />
        )}

        {currentView === 'public' && selectedService && (
          <Booking selectedService={selectedService} onBack={handleBackToServices} />
        )}

        {currentView === 'login' && !loggedInBusiness && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'login' && loggedInBusiness && (
          <Panel business={loggedInBusiness} />
        )}
      </main>
    </div>
  );
}

export default App;