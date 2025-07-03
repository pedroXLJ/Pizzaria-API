import React from 'react';

function PizzaForm({ form, editMode, error, success, handleChange, handleSubmit, closePizzaModal }) {
  return (
    <form onSubmit={handleSubmit}>
      {/* Feedback do CRUD de pizza */}
      {(error || success) && (
        <div style={{ marginBottom: 8 }}>
          {error && <div className="alert alert-danger" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 6, padding: 8, marginBottom: 4 }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: 8 }}>{success}</div>}
        </div>
      )}
      <div className="form-group">
        <label className="label">Nome da Pizza *</label>
        <input
          type="text"
          className="input"
          name="sabor"
          value={form.sabor}
          onChange={handleChange}
          placeholder="Ex: Margherita"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Tamanho *</label>
        <input
          type="text"
          className="input"
          name="tamanho"
          value={form.tamanho || ''}
          onChange={handleChange}
          placeholder="Ex: Grande, Média, Pequena"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Preço *</label>
        <input
          type="number"
          className="input"
          name="preco"
          value={form.preco || ''}
          onChange={handleChange}
          placeholder="Ex: 59.90"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Ingredientes *</label>
        <textarea
          className="textarea"
          name="ingredientes"
          value={form.ingredientes}
          onChange={handleChange}
          placeholder="Ex: Molho de tomate, mussarela, manjericão"
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Atualizar Pizza' : 'Cadastrar Pizza'}
        </button>
        {editMode && (
          <button type="button" className="btn btn-outline" onClick={closePizzaModal}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default PizzaForm;
