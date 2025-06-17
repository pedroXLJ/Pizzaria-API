package com.senac.pizzademo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.pizzademo.model.Pizza;
import com.senac.pizzademo.repository.PizzaRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.Optional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PizzaController.class)
@Import(TestSecurityConfig.class)
public class PizzaControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PizzaRepository pizzaRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllPizzas() throws Exception {
        Mockito.when(pizzaRepository.findAll()).thenReturn(Arrays.asList(new Pizza()));
        mockMvc.perform(get("/pizzas"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreatePizza() throws Exception {
        Pizza pizza = new Pizza();
        Mockito.when(pizzaRepository.save(Mockito.any(Pizza.class))).thenReturn(pizza);
        mockMvc.perform(post("/pizzas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizza)))
                .andExpect(status().isCreated());
    }

    @Test
    void testUpdatePizza() throws Exception {
        Pizza pizza = new Pizza();
        Mockito.when(pizzaRepository.findById(1L)).thenReturn(Optional.of(pizza));
        Mockito.when(pizzaRepository.save(Mockito.any(Pizza.class))).thenReturn(pizza);
        mockMvc.perform(put("/pizzas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizza)))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdatePizzaNotFound() throws Exception {
        Pizza pizza = new Pizza();
        Mockito.when(pizzaRepository.findById(1L)).thenReturn(Optional.empty());
        mockMvc.perform(put("/pizzas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizza)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeletePizza() throws Exception {
        Mockito.when(pizzaRepository.existsById(1L)).thenReturn(true);
        mockMvc.perform(delete("/pizzas/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeletePizzaNotFound() throws Exception {
        Mockito.when(pizzaRepository.existsById(1L)).thenReturn(false);
        mockMvc.perform(delete("/pizzas/1"))
                .andExpect(status().isNotFound());
    }
}
