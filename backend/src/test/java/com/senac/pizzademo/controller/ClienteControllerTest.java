package com.senac.pizzademo.controller;

import com.senac.pizzademo.model.Cliente;
import com.senac.pizzademo.repository.ClienteRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(ClienteController.class)
public class ClienteControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ClienteRepository clienteRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateClienteSuccess() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setNome("João");
        Mockito.when(clienteRepository.save(Mockito.any(Cliente.class))).thenReturn(cliente);
        mockMvc.perform(post("/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isCreated());
    }

    @Test
    void testCreateClienteBadRequest() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setNome("");
        mockMvc.perform(post("/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isBadRequest());
    }
}
