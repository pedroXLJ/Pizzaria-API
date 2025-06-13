
package com.senac.pizzademo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senac.pizzademo.model.Cardapio;

public interface CardapioRepository extends JpaRepository<Cardapio, Long> {
}
