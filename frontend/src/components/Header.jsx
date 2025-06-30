import React from 'react';

function Header({ user, handleLogout, setShowModal }) {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">🍕</span>
        <h1>Gerenciamento de Pizzas</h1>
      </div>
      <div className="user-section">
        {user && (
          <div className="user-info">Olá, {user.name}!</div>
        )}
        {!user && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            👤 Login
          </button>
        )}
        {user && (
          <button className="btn btn-outline" onClick={handleLogout}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
