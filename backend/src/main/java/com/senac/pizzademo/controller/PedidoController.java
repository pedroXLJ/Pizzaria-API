package com.senac.pizzademo.controller;

import com.senac.pizzademo.dto.PedidoDTO;
import com.senac.pizzademo.model.Pedido;
import com.senac.pizzademo.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoDTO> criarPedido(@RequestParam Long clienteId) {
        if (clienteId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Pedido pedido = pedidoService.criarPedido(clienteId);
        PedidoDTO dto = PedidoDTO.fromEntity(pedido);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> buscarPorId(@PathVariable Long id) {
        Pedido pedido = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(PedidoDTO.fromEntity(pedido));
    }

    @GetMapping
    public List<PedidoDTO> listarTodos() {
        return pedidoService.listarTodos().stream()
                .map(PedidoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping(params = "clienteId")
    public List<PedidoDTO> listarPorCliente(@RequestParam Long clienteId) {
        return pedidoService.listarPorClienteId(clienteId).stream()
                .map(PedidoDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
