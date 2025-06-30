import React from 'react';

function PizzaList({ pizzas, loading, editMode, form, user, openPizzaModal, handleDelete, adicionarAoCarrinho, deletingId }) {
  return (
    <div>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Pizzas Cadastradas</h2>
      <div className="pizza-list">
        {pizzas.length === 0 && !loading && (
          <div className="card empty-state">Nenhuma pizza cadastrada ainda</div>
        )}
        {pizzas.map(pizza => {
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
          return (
            <div className={`card pizza-card${editMode && form.id === pizza.id ? ' editing' : ''}`} key={pizza.id}>
              <div className="card-content">
                <div className="pizza-header">
                  <div className="pizza-info">
                    <h3>{pizza.sabor}</h3>
                    <span className="badge">{ingredientesStr}</span>
                  </div>
                  {user && (
                    <div className="pizza-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openPizzaModal(pizza)}>
                        ✏️
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => handleDelete(pizza.id)} disabled={deletingId === pizza.id}>
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
                <div className="pizza-details">
                  <div className="detail-group">
                    <span className="detail-label">Ingredientes:</span>
                    <span className="detail-text">{ingredientesStr}</span>
                  </div>
                  <button className="btn btn-sm btn-primary" style={{marginTop: 8}} onClick={() => adicionarAoCarrinho(pizza)}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PizzaList;
