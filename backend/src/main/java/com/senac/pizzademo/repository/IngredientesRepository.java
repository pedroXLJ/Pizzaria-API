package com.senac.pizzademo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senac.pizzademo.model.Ingrediente;

public interface IngredientesRepository extends JpaRepository<Ingrediente, Long> {
}
