package com.senac.pizzademo.dto;

import com.senac.pizzademo.model.ItemPedido;
import java.math.BigDecimal;

public class ItemPedidoDTO {
    private Long pizzaId;
    private String nomePizza;
    private int quantidade;
    private BigDecimal precoUnitario;

    public static ItemPedidoDTO fromEntity(ItemPedido item) {
        ItemPedidoDTO dto = new ItemPedidoDTO();
        dto.setPizzaId(item.getPizza().getId());
        dto.setNomePizza(item.getPizza().getSabor()); // Usando getSabor como nome
        dto.setQuantidade(item.getQuantidade());
        dto.setPrecoUnitario(item.getPrecoUnitario());
        return dto;
    }

    // Getters e Setters
    public Long getPizzaId() { return pizzaId; }
    public void setPizzaId(Long pizzaId) { this.pizzaId = pizzaId; }
    public String getNomePizza() { return nomePizza; }
    public void setNomePizza(String nomePizza) { this.nomePizza = nomePizza; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
}
