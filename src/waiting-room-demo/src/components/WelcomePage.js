import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Welcome Page Component
const WelcomePage = ({ auth, vwrToken, tokenExpiryInSeconds }) => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log('vwrToken:', vwrToken);

  const expiryDate = new Date(Date.now() + tokenExpiryInSeconds * 1000).toLocaleString();

  const fetchUsers = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/`, {
      headers: {
        Authorization: `Bearer ${vwrToken}`
      }
    })
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the users!', error);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [vwrToken]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = { name, email, password };

    // Post new user to the server
    axios.post(`${process.env.REACT_APP_API_URL}/`, newUser, {
      headers: {
        Authorization: `Bearer ${vwrToken}`
      }
    })
    .then(response => {
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers(); // Fetch users again after adding a new user
    })
    .catch(error => {
      console.error('There was an error adding the user!', error);
    });
  };

  return (
    <div>
      <h1>Add some Users to Populate the Database</h1>
      <p>Token expiry time: <span style={{ color: 'green', fontWeight: 'bold' }}>{expiryDate}</span></p>

      <form onSubmit={handleAddUser} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add User</button>
      </form>

      <div>
        <h2>User Accounts</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {users.map((user, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
