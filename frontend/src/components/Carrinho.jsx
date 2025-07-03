import React from 'react';

function Carrinho({ carrinho = [], alterarQuantidade, removerDoCarrinho, calcularSubtotal, totalGeral, onFinalizarPedido }) {
  return (
    <div className="card" style={{minWidth: 320, maxWidth: 400}}>
      <div className="card-header">
        <h2 className="card-title">🛒 Carrinho</h2>
        <p className="card-description">Pizzas adicionadas ao carrinho</p>
      </div>
      <div className="card-content">
        {carrinho.length === 0 ? (
          <div className="empty-state">Seu carrinho está vazio.</div>
        ) : (
          <table style={{width: '100%', fontSize: '1rem'}}>
            <thead>
              <tr>
                <th style={{textAlign: 'left'}}>Pizza</th>
                <th>Qtd</th>
                <th>Preço</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map(item => (
                <tr key={item.id}>
                  <td>{item.sabor}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      style={{width: 50}}
                      onChange={e => alterarQuantidade(item.id, parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>R$ {calcularSubtotal(item).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => removerDoCarrinho(item.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold'}}>Total:</td>
                <td colSpan="2" style={{fontWeight: 'bold'}}>R$ {totalGeral.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        )}
        {carrinho.length > 0 && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 16 }}
            onClick={onFinalizarPedido}
          >
            Finalizar Pedido
          </button>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
