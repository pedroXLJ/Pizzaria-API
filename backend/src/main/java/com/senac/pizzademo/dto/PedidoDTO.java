package com.senac.pizzademo.dto;

import com.senac.pizzademo.model.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.senac.pizzademo.model.StatusPedido;

public class PedidoDTO {
    private Long id;
    private Long clienteId;
    private LocalDateTime dataPedido;
    private BigDecimal total;
    private StatusPedido status;
    private List<ItemPedidoDTO> itens;

    public static PedidoDTO fromEntity(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setClienteId(pedido.getCliente().getId());
        dto.setDataPedido(pedido.getDataPedido());
        dto.setTotal(pedido.getTotal());
        dto.setStatus(pedido.getStatus());
        dto.setItens(pedido.getItens().stream()
                .map(ItemPedidoDTO::fromEntity)
                .collect(Collectors.toList()));
        return dto;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }
    public List<ItemPedidoDTO> getItens() { return itens; }
    public void setItens(List<ItemPedidoDTO> itens) { this.itens = itens; }
}
