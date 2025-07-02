import React from 'react';
import PizzaCard from './PizzaCard';
import './PizzaCard.css';

function PizzaList({ pizzas, loading, editMode, form, user, openPizzaModal, handleDelete, adicionarAoCarrinho, deletingId }) {
  return (
    <div>
      <div className="pizza-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem'}}>
        {pizzas.length === 0 && !loading && (
          <div className="card empty-state">Nenhuma pizza cadastrada ainda</div>
        )}
        {pizzas.map(pizza => (
          <PizzaCard
            key={pizza.id}
            pizza={pizza}
            onAdd={adicionarAoCarrinho}
            onEdit={openPizzaModal}
            onDelete={handleDelete}
            user={user}
            deletingId={deletingId}
          />
        ))}
      </div>
    </div>
  );
}

export default PizzaList;
