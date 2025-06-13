package com.senac.pizzademo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.pizzademo.model.Ingrediente;
import com.senac.pizzademo.repository.IngredientesRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.Optional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IngredientesController.class)
public class IngredientesControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private IngredientesRepository ingredienteRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllIngredientes() throws Exception {
        Mockito.when(ingredienteRepository.findAll()).thenReturn(Arrays.asList(new Ingrediente()));
        mockMvc.perform(get("/ingredientes"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateIngrediente() throws Exception {
        Ingrediente ingrediente = new Ingrediente();
        Mockito.when(ingredienteRepository.save(Mockito.any(Ingrediente.class))).thenReturn(ingrediente);
        mockMvc.perform(post("/ingredientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingrediente)))
                .andExpect(status().isCreated());
    }

    @Test
    void testUpdateIngrediente() throws Exception {
        Ingrediente ingrediente = new Ingrediente();
        Mockito.when(ingredienteRepository.findById(1L)).thenReturn(Optional.of(ingrediente));
        Mockito.when(ingredienteRepository.save(Mockito.any(Ingrediente.class))).thenReturn(ingrediente);
        mockMvc.perform(put("/ingredientes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingrediente)))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateIngredienteNotFound() throws Exception {
        Ingrediente ingrediente = new Ingrediente();
        Mockito.when(ingredienteRepository.findById(1L)).thenReturn(Optional.empty());
        mockMvc.perform(put("/ingredientes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingrediente)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteIngrediente() throws Exception {
        Mockito.when(ingredienteRepository.existsById(1L)).thenReturn(true);
        mockMvc.perform(delete("/ingredientes/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteIngredienteNotFound() throws Exception {
        Mockito.when(ingredienteRepository.existsById(1L)).thenReturn(false);
        mockMvc.perform(delete("/ingredientes/1"))
                .andExpect(status().isNotFound());
    }
}
