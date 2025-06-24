package com.senac.pizzademo.controller;

import com.senac.pizzademo.model.Carrinho;
import com.senac.pizzademo.model.ItemCarrinho;
import com.senac.pizzademo.repository.CarrinhoRepository;
import com.senac.pizzademo.repository.ItemCarrinhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/carrinho")
public class CarrinhoController {
    @Autowired
    private CarrinhoRepository carrinhoRepository;
    @Autowired
    private ItemCarrinhoRepository itemCarrinhoRepository;

    // Adicionar pizza ao carrinho
    @PostMapping
    public ResponseEntity<Carrinho> adicionarPizzaAoCarrinho(@RequestParam Long clienteId, @RequestParam Long pizzaId, @RequestParam int quantidade, @RequestParam BigDecimal precoUnitario) {
        Carrinho carrinho = carrinhoRepository.findByClienteId(clienteId);
        if (carrinho == null) {
            carrinho = new Carrinho();
            carrinho.setClienteId(clienteId);
        }
        ItemCarrinho item = new ItemCarrinho();
        item.setPizzaId(pizzaId);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(precoUnitario);
        item.setCarrinho(carrinho);
        carrinho.getItens().add(item);
        carrinhoRepository.save(carrinho);
        return ResponseEntity.status(HttpStatus.CREATED).body(carrinho);
    }

    // Listar itens do carrinho
    @GetMapping
    public ResponseEntity<List<ItemCarrinho>> listarItens(@RequestParam Long clienteId) {
        Carrinho carrinho = carrinhoRepository.findByClienteId(clienteId);
        if (carrinho == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(carrinho.getItens());
    }

    // Remover item do carrinho
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removerItem(@PathVariable Long itemId) {
        Optional<ItemCarrinho> itemOpt = itemCarrinhoRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        itemCarrinhoRepository.deleteById(itemId);
        return ResponseEntity.noContent().build();
    }

    // Atualizar quantidade de um item
    @PutMapping
    public ResponseEntity<ItemCarrinho> atualizarQuantidade(@RequestParam Long itemId, @RequestParam int quantidade) {
        Optional<ItemCarrinho> itemOpt = itemCarrinhoRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ItemCarrinho item = itemOpt.get();
        item.setQuantidade(quantidade);
        itemCarrinhoRepository.save(item);
        return ResponseEntity.ok(item);
    }
}
