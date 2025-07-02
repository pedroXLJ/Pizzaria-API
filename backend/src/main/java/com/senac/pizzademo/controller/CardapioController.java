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

import com.senac.pizzademo.model.Cardapio;
import com.senac.pizzademo.repository.CardapioRepository;

@RestController
@RequestMapping("/cardapio")
public class CardapioController {

    @Autowired
    private CardapioRepository cardapioRepository;

    @GetMapping
    public ResponseEntity<List<Cardapio>> getAllCardapios() {
        List<Cardapio> cardapios = cardapioRepository.findAll();
        return ResponseEntity.ok(cardapios);
    }

    @PostMapping
    public ResponseEntity<Cardapio> createCardapio(@RequestBody Cardapio cardapio) {
        if (cardapio.getTamanho() == null || cardapio.getValor() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Cardapio created = cardapioRepository.save(cardapio);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cardapio> updateCardapio(@PathVariable Long id, @RequestBody Cardapio cardapioDetails) {
        return cardapioRepository.findById(id)
            .map(cardapio -> {
                cardapio.setValor(cardapioDetails.getValor());
                cardapio.setTamanho(cardapioDetails.getTamanho());
                cardapio.setPizzas(cardapioDetails.getPizzas());
                Cardapio updated = cardapioRepository.save(cardapio);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCardapio(@PathVariable Long id) {
        if (!cardapioRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        cardapioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
