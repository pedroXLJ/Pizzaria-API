import React from 'react';
import './Header.css';

function Header({ user, handleLogout, setShowModal, onCartClick, cartCount, onMenuNav, activePage }) {
  return (
    <>
      <header className="custom-header">
        <div className="header-left">
          <img src="/logo.png" alt="Pizzas Demo" className="header-logo" />
          <h2 className="header-title" style={{ margin: 0 }}>
            Pizzas Demo
          </h2>
        </div>
        <div className="header-right">
          {user && (
            <span className="header-welcome">
              Bem vindo, <b>{user.name || user.username}</b>
            </span>
          )}
          {!user ? (
            <button className="header-login-btn" onClick={() => setShowModal(true)}>
              <span className="user-icon">👤</span> Entre ou Cadastre-se
            </button>
          ) : (
            <button className="header-login-btn" onClick={handleLogout}>
              Sair
            </button>
          )}
          <button className="header-cart-btn" onClick={onCartClick} aria-label="Carrinho">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>
      <div className="header-menu-bar">
        <nav className="header-menu">
          <ul>
            <li><button className={activePage === 'home' ? 'active' : ''} onClick={() => onMenuNav('home')}>Home</button></li>
            <li><button className={activePage === 'cadastro' ? 'active' : ''} onClick={() => user ? onMenuNav('cadastro') : null} disabled={!user}>Cadastro de Pizzas</button></li>
            <li><button className={activePage === 'pedidos' ? 'active' : ''} onClick={() => user ? onMenuNav('pedidos') : null} disabled={!user}>Pedidos</button></li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Header;
