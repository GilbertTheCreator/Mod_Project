import React from 'react';

function Logout({ setToken }) {
  const handleLogout = () => {
    setToken('');
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>Confirm logout?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
