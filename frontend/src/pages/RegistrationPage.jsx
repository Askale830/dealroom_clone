import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RegistrationPage = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({ email, password, orgName });
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register Organization</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Organization Name" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
};

export default RegistrationPage;
