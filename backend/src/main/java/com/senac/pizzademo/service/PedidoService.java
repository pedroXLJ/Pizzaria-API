package com.senac.pizzademo.service;

import com.senac.pizzademo.model.*;
import com.senac.pizzademo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;
    private final ClienteRepository clienteRepository;
    private final PizzaRepository pizzaRepository;

    @Transactional
    public Pedido criarPedido(Long clienteId) {
        Carrinho carrinho = carrinhoRepository.findByClienteId(clienteId);
        if (carrinho == null || carrinho.getItens().isEmpty()) {
            throw new RuntimeException("Carrinho vazio ou não encontrado");
        }
        Cliente cliente = clienteRepository.findById(clienteId).orElseThrow();
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus(StatusPedido.RECEBIDO);
        List<ItemPedido> itensPedido = carrinho.getItens().stream().map(itemCarrinho -> {
            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            Pizza pizza = pizzaRepository.findById(itemCarrinho.getPizzaId()).orElseThrow();
            itemPedido.setPizza(pizza);
            itemPedido.setQuantidade(itemCarrinho.getQuantidade());
            itemPedido.setPrecoUnitario(itemCarrinho.getPrecoUnitario());
            return itemPedido;
        }).collect(Collectors.toList());
        pedido.setItens(itensPedido);
        pedido.setTotal(itensPedido.stream()
                .map(i -> i.getPrecoUnitario().multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        pedidoRepository.save(pedido);
        // Limpa o carrinho
        itemCarrinhoRepository.deleteAll(carrinho.getItens());
        carrinhoRepository.delete(carrinho);
        return pedido;
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id).orElseThrow();
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPorClienteId(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }
}
