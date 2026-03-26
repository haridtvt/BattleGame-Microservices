import React, { useState } from 'react';

function App() {
  const [status, setStatus] = useState("Idle");
  const API_URL = "/api";
  const handleAttack = async () => {
    setStatus("Sending...");
    try {
      await fetch(`${API_URL}/attack`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ player: "DevOps_Warrior", power: 100 })
      });
      setStatus("Attack Queued!");
    } catch {
      setStatus("Failed to connect to API");
    }
  };

  return (
    <div style={{ textAlign: 'center', background: '#222', color: '#fff', height: '100vh', paddingTop: '50px' }}>
      <h1>⚔️ MICRO-BATTLE ⚔️</h1>
      <button onClick={handleAttack} style={{ padding: '20px', fontSize: '20px', cursor: 'pointer' }}>
        LAUNCH ATTACK
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
export default App;