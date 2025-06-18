package com.senac.pizzademo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.senac.pizzademo.model.ItemCarrinho;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
}
