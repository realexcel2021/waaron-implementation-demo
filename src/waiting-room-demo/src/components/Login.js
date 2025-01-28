import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

// Mock authentication function
const mockAuth = (user, password) => {
  if (user === 'test' && password === 'password') {
    return {
      token: 'mock-token',
      expiry: new Date(Date.now() + 600000), // Token valid for 10 minutes
      username: user,
    };
  }
  return null;
};

// Login Component
const LoginPage = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault(); // Handle both button click and form submit
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    const auth = mockAuth(username.trim(), password);
    if (auth) {
      setAuth(auth);
      navigate('/waiting');
    } else {
      setError('Invalid credentials. Use test/password to login.');
    }
  };

  return (
    <div className='parent-div'>
      <h1>Login/Register</h1>
      <form className='login-form' onSubmit={handleLogin}>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
