package com.senac.pizzademo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.pizzademo.model.Carrinho;
import com.senac.pizzademo.model.ItemCarrinho;
import com.senac.pizzademo.repository.CarrinhoRepository;
import com.senac.pizzademo.repository.ItemCarrinhoRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(CarrinhoController.class)
public class CarrinhoControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CarrinhoRepository carrinhoRepository;
    @MockBean
    private ItemCarrinhoRepository itemCarrinhoRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAdicionarPizzaAoCarrinhoSuccess() throws Exception {
        Carrinho carrinho = new Carrinho();
        carrinho.setClienteId(1L);
        Mockito.when(carrinhoRepository.findByClienteId(1L)).thenReturn(carrinho);
        Mockito.when(carrinhoRepository.save(Mockito.any(Carrinho.class))).thenReturn(carrinho);
        mockMvc.perform(post("/carrinho?clienteId=1&pizzaId=2&quantidade=1&precoUnitario=10.0"))
                .andExpect(status().isCreated());
    }

    @Test
    void testAdicionarPizzaAoCarrinhoBadRequest() throws Exception {
        mockMvc.perform(post("/carrinho?clienteId=1&pizzaId=2&quantidade=0&precoUnitario=10.0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testListarItens() throws Exception {
        Carrinho carrinho = new Carrinho();
        List<ItemCarrinho> itens = new ArrayList<>();
        carrinho.setItens(itens);
        Mockito.when(carrinhoRepository.findByClienteId(1L)).thenReturn(carrinho);
        mockMvc.perform(get("/carrinho?clienteId=1"))
                .andExpect(status().isOk());
    }

    @Test
    void testRemoverItemSuccess() throws Exception {
        ItemCarrinho item = new ItemCarrinho();
        Mockito.when(itemCarrinhoRepository.findById(1L)).thenReturn(Optional.of(item));
        mockMvc.perform(delete("/carrinho/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testRemoverItemNotFound() throws Exception {
        Mockito.when(itemCarrinhoRepository.findById(1L)).thenReturn(Optional.empty());
        mockMvc.perform(delete("/carrinho/1"))
                .andExpect(status().isNotFound());
    }
}
