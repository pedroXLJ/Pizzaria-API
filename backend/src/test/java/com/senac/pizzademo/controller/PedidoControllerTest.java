package com.senac.pizzademo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.pizzademo.dto.PedidoDTO;
import com.senac.pizzademo.model.Pedido;
import com.senac.pizzademo.service.PedidoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class) 
@WebMvcTest(PedidoController.class)
public class PedidoControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PedidoService pedidoService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCriarPedidoSuccess() throws Exception {
        Pedido pedido = new Pedido();
        pedido.setId(1L);
        // Preenche o cliente do pedido
        com.senac.pizzademo.model.Cliente cliente = new com.senac.pizzademo.model.Cliente();
        cliente.setId(1L);
        pedido.setCliente(cliente);
        PedidoDTO dto = new PedidoDTO();
        Mockito.when(pedidoService.criarPedido(Mockito.anyLong())).thenReturn(pedido);
        try (var mock = Mockito.mockStatic(PedidoDTO.class)) {
            mock.when(() -> PedidoDTO.fromEntity(Mockito.any(Pedido.class))).thenReturn(dto);
            mockMvc.perform(post("/pedidos?clienteId=1"))
                    .andExpect(status().isCreated());
        }
    }

    @Test
    void testCriarPedidoBadRequest() throws Exception {
        mockMvc.perform(post("/pedidos"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBuscarPorId() throws Exception {
        Pedido pedido = new Pedido();
        pedido.setId(1L);
        com.senac.pizzademo.model.Cliente cliente = new com.senac.pizzademo.model.Cliente();
        cliente.setId(1L);
        pedido.setCliente(cliente);
        PedidoDTO dto = new PedidoDTO();
        Mockito.when(pedidoService.buscarPorId(1L)).thenReturn(pedido);
        try (var mock = Mockito.mockStatic(PedidoDTO.class)) {
            mock.when(() -> PedidoDTO.fromEntity(pedido)).thenReturn(dto);
            mockMvc.perform(get("/pedidos/1"))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void testListarTodos() throws Exception {
        Mockito.when(pedidoService.listarTodos()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/pedidos"))
                .andExpect(status().isOk());
    }

    @Test
    void testListarPorCliente() throws Exception {
        Mockito.when(pedidoService.listarPorClienteId(1L)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/pedidos?clienteId=1"))
                .andExpect(status().isOk());
    }
}
