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
import com.senac.pizzademo.repository.IngredientesRepository;

@RestController
@RequestMapping("/ingredientes")
public class IngredientesController {

    @Autowired
    private IngredientesRepository ingredienteRepository;

    @GetMapping
    public ResponseEntity<List<Ingrediente>> getAllIngredientes() {
        List<Ingrediente> ingredientes = ingredienteRepository.findAll();
        return ResponseEntity.ok(ingredientes);
    }

    @PostMapping
    public ResponseEntity<Ingrediente> createIngrediente(@RequestBody Ingrediente ingrediente) {
        Ingrediente created = ingredienteRepository.save(ingrediente);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingrediente> updateIngrediente(@PathVariable Long id, @RequestBody Ingrediente ingredienteDetails) {
        return ingredienteRepository.findById(id)
            .map(ingrediente -> {
                ingrediente.setNome(ingredienteDetails.getNome());
                ingrediente.setPizza(ingredienteDetails.getPizza());
                Ingrediente updated = ingredienteRepository.save(ingrediente);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngrediente(@PathVariable Long id) {
        if (!ingredienteRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        ingredienteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
