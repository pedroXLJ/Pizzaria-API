import React from 'react';
import './PizzaCard.css';

function PizzaCard({ pizza, onAdd, onEdit, onDelete, user, deletingId }) {
  let ingredientesStr = '';
  if (Array.isArray(pizza.ingredientes)) {
    if (pizza.ingredientes.length === 0) {
      ingredientesStr = 'Não informado';
    } else if (typeof pizza.ingredientes[0] === 'object' && pizza.ingredientes[0] !== null && 'nome' in pizza.ingredientes[0]) {
      ingredientesStr = pizza.ingredientes.map(i => i.nome).filter(Boolean).join(', ');
    } else {
      ingredientesStr = pizza.ingredientes.filter(Boolean).join(', ');
    }
  } else if (typeof pizza.ingredientes === 'string') {
    ingredientesStr = pizza.ingredientes;
  } else {
    ingredientesStr = 'Não informado';
  }

  // Simulação de campos para visual: porções, preço e imagem
  const porcoes = pizza.porcoes || 2;
  const preco = pizza.preco || 49.9;
  const imagem = pizza.imagem || 'pizza_default.png';

  return (
    <div className="pizza-card">
      <div className="pizza-card-info">
        <h3>{pizza.sabor}</h3>
        <p className="pizza-desc">{ingredientesStr}</p>
        <div className="pizza-portion">Serve {porcoes} pessoas</div>
        <div className="pizza-price">
          <span className="preco">R$ {preco.toFixed(2)}</span>
        </div>
        {user && (
          <div className="pizza-actions">
            <button className="btn-edit" onClick={() => onEdit(pizza)} title="Editar">✏️</button>
            <button className="btn-delete" onClick={() => onDelete(pizza.id)} disabled={deletingId === pizza.id} title="Remover">🗑️</button>
          </div>
        )}
      </div>
      <img src={imagem} alt={pizza.sabor} className="pizza-img" />
      <button className="pizza-add-btn" onClick={() => onAdd(pizza)} title="Adicionar ao carrinho">
        <span>+</span>
      </button>
    </div>
  );
}

export default PizzaCard;
