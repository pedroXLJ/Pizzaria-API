
package com.senac.pizzademo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senac.pizzademo.model.Pizza;

public interface PizzaRepository extends JpaRepository<Pizza, Long> {
}
