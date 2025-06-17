package com.senac.pizzademo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.pizzademo.model.Cardapio;
import com.senac.pizzademo.model.Pizza;
import com.senac.pizzademo.repository.CardapioRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CardapioController.class)
@Import(TestSecurityConfig.class)
public class CardapioControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CardapioRepository cardapioRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllCardapios() throws Exception {
        Mockito.when(cardapioRepository.findAll()).thenReturn(Arrays.asList(new Cardapio()));
        mockMvc.perform(get("/cardapio"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateCardapio() throws Exception {
        Cardapio cardapio = new Cardapio();
        cardapio.setValor(50f);
        cardapio.setTamanho("Grande");
        cardapio.setPizzas(Collections.singletonList(new Pizza()));
        Mockito.when(cardapioRepository.save(Mockito.any(Cardapio.class))).thenReturn(cardapio);
        mockMvc.perform(post("/cardapio")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cardapio)))
                .andExpect(status().isCreated());
    }

    @Test
    void testUpdateCardapio() throws Exception {
        Cardapio cardapio = new Cardapio();
        cardapio.setValor(50f);
        cardapio.setTamanho("Grande");
        cardapio.setPizzas(Collections.singletonList(new Pizza()));
        Mockito.when(cardapioRepository.findById(1L)).thenReturn(Optional.of(cardapio));
        Mockito.when(cardapioRepository.save(Mockito.any(Cardapio.class))).thenReturn(cardapio);
        mockMvc.perform(put("/cardapio/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cardapio)))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateCardapioNotFound() throws Exception {
        Cardapio cardapio = new Cardapio();
        Mockito.when(cardapioRepository.findById(1L)).thenReturn(Optional.empty());
        mockMvc.perform(put("/cardapio/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cardapio)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteCardapio() throws Exception {
        Mockito.when(cardapioRepository.existsById(1L)).thenReturn(true);
        mockMvc.perform(delete("/cardapio/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteCardapioNotFound() throws Exception {
        Mockito.when(cardapioRepository.existsById(1L)).thenReturn(false);
        mockMvc.perform(delete("/cardapio/1"))
                .andExpect(status().isNotFound());
    }
}
