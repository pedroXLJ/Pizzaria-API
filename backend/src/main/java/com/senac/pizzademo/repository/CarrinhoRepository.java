package com.senac.pizzademo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.senac.pizzademo.model.Carrinho;

public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {
    Carrinho findByClienteId(Long clienteId);
}
