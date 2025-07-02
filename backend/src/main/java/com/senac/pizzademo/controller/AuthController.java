package com.senac.pizzademo.controller;

import com.senac.pizzademo.model.User;
import com.senac.pizzademo.service.UserService;
import com.senac.pizzademo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            logger.info("Recebida requisição de registro: username={}", user.getUsername());

            if (user.getUsername() == null || user.getPassword() == null) {
                logger.warn("Dados de registro inválidos: username ou senha ausentes");
                return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: username e senha são obrigatórios"));
            }

            if (userService.findByUsername(user.getUsername()).isPresent()) {
                logger.warn("Tentativa de registro com username já existente: {}", user.getUsername());
                return ResponseEntity.badRequest().body(Map.of("error", "Usuário já existe"));
            }

            User saved = userService.save(user);
            logger.info("Usuário registrado com sucesso: username={}", saved.getUsername());
            return ResponseEntity.ok(Map.of("username", saved.getUsername()));
        } catch (IllegalArgumentException e) {
            logger.error("Erro de validação ao registrar usuário: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Erro de validação: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Erro interno ao registrar usuário", e);
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");

            if (username == null || password == null) {
                logger.warn("Dados de login inválidos: username ou senha ausentes");
                return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: username e senha são obrigatórios"));
            }

            var userOpt = userService.findByUsername(username);
            if (userOpt.isEmpty() || !userService.checkPassword(userOpt.get(), password)) {
                logger.warn("Tentativa de login falhou para username={}", username);
                return ResponseEntity.status(401).body(Map.of("error", "Usuário ou senha inválidos"));
            }

            String token = jwtService.generateToken(username);
            logger.info("Login realizado com sucesso: username={}", username);
            return ResponseEntity.ok(Map.of(
                "username", username,
                "token", token,
                "message", "Login realizado com sucesso"
            ));
        } catch (Exception e) {
            logger.error("Erro interno ao realizar login", e);
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno: " + e.getMessage()));
        }
    }
}
