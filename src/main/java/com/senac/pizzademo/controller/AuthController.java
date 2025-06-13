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
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Usuário já existe"));
            }
            User saved = userService.save(user);
            return ResponseEntity.ok(Map.of("username", saved.getUsername()));
        } catch (Exception e) {
            e.printStackTrace(); // Loga no console do container
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        var userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty() || !userService.checkPassword(userOpt.get(), password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário ou senha inválidos"));
        }
        String token = jwtService.generateToken(username);
        return ResponseEntity.ok(Map.of(
            "username", username,
            "token", token,
            "message", "Login realizado com sucesso"
        ));
    }
}
