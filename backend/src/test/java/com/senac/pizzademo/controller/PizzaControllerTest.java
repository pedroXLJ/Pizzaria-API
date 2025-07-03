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
import static org.hamcrest.Matchers.*;

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
        pizza.setSabor("Margherita"); // Adicionando sabor válido
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

    @Test
    void testCreatePizzaCamposObrigatorios() throws Exception {
        // Sabor ausente
        Pizza pizzaSemSabor = new Pizza();
        pizzaSemSabor.setTamanho("Grande");
        pizzaSemSabor.setPreco(50.0);
        mockMvc.perform(post("/pizzas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaSemSabor)))
                .andExpect(status().isBadRequest());

        // Tamanho ausente
        Pizza pizzaSemTamanho = new Pizza();
        pizzaSemTamanho.setSabor("Calabresa");
        pizzaSemTamanho.setPreco(50.0);
        mockMvc.perform(post("/pizzas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaSemTamanho)))
                .andExpect(status().isBadRequest());

        // Preço ausente
        Pizza pizzaSemPreco = new Pizza();
        pizzaSemPreco.setSabor("Calabresa");
        pizzaSemPreco.setTamanho("Grande");
        mockMvc.perform(post("/pizzas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaSemPreco)))
                .andExpect(status().isBadRequest());

        // Preço inválido
        Pizza pizzaPrecoZero = new Pizza();
        pizzaPrecoZero.setSabor("Calabresa");
        pizzaPrecoZero.setTamanho("Grande");
        pizzaPrecoZero.setPreco(0.0);
        mockMvc.perform(post("/pizzas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaPrecoZero)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdatePizzaCamposObrigatorios() throws Exception {
        Pizza pizzaExistente = new Pizza();
        pizzaExistente.setId(1L);
        pizzaExistente.setSabor("Calabresa");
        pizzaExistente.setTamanho("Grande");
        pizzaExistente.setPreco(50.0);

        Mockito.when(pizzaRepository.findById(1L)).thenReturn(Optional.of(pizzaExistente));
        Mockito.when(pizzaRepository.save(Mockito.any(Pizza.class))).thenReturn(pizzaExistente);

        // Atualizar para sabor vazio
        Pizza pizzaUpdate = new Pizza();
        pizzaUpdate.setSabor("");
        pizzaUpdate.setTamanho("Grande");
        pizzaUpdate.setPreco(50.0);

        mockMvc.perform(put("/pizzas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sabor", is("")));

        // Atualizar para tamanho vazio
        pizzaUpdate.setSabor("Calabresa");
        pizzaUpdate.setTamanho("");
        mockMvc.perform(put("/pizzas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tamanho", is("")));

        // Atualizar para preço inválido
        pizzaUpdate.setTamanho("Grande");
        pizzaUpdate.setPreco(0.0);
        mockMvc.perform(put("/pizzas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pizzaUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preco", is(0.0)));
    }
}
