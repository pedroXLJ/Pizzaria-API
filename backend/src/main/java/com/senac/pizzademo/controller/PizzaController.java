package com.senac.pizzademo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.senac.pizzademo.model.Ingrediente;
import com.senac.pizzademo.model.Pizza;
import com.senac.pizzademo.repository.PizzaRepository;

@RestController
@RequestMapping("/pizzas")
public class PizzaController {

    @Autowired
    private PizzaRepository pizzaRepository;

    @GetMapping
    public ResponseEntity<List<Pizza>> getAllPizzas() {
        List<Pizza> pizzas = pizzaRepository.findAll();
        return ResponseEntity.ok(pizzas);
    }

    @PostMapping
    public ResponseEntity<Pizza> createPizza(@RequestBody Pizza pizza) {
        if (pizza.getSabor() == null || pizza.getSabor().isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (pizza.getTamanho() == null || pizza.getTamanho().isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (pizza.getPreco() == null || pizza.getPreco() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }
        if (pizza.getIngredientes() != null) {
            pizza.getIngredientes().forEach(ing -> ing.setPizza(pizza));
        }
        Pizza created = pizzaRepository.save(pizza);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pizza> updatePizza(@PathVariable Long id, @RequestBody Pizza pizzaDetails) {
        return pizzaRepository.findById(id)
            .map(pizza -> {
                pizza.setSabor(pizzaDetails.getSabor());
                pizza.setTamanho(pizzaDetails.getTamanho());
                pizza.setPreco(pizzaDetails.getPreco());
                // Remove ingredientes antigos
                if (pizza.getIngredientes() != null) {
                    pizza.getIngredientes().clear();
                }
                // Adiciona os novos ingredientes, setando a referência para a pizza
                if (pizzaDetails.getIngredientes() != null) {
                    pizzaDetails.getIngredientes().forEach(ing -> ing.setPizza(pizza));
                    pizza.setIngredientes(pizzaDetails.getIngredientes());
                }
                Pizza updated = pizzaRepository.save(pizza);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePizza(@PathVariable Long id) {
        if (!pizzaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        pizzaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
