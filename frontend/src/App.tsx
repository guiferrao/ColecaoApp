import { useState } from 'react';
import { Desktop } from './components/Desktop';
import { Login } from './components/Login';

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Desktop onLogout={handleLogout} />;
}

export default App;