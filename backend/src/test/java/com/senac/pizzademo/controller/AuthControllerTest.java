package com.senac.pizzademo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.pizzademo.model.User;
import com.senac.pizzademo.service.UserService;
import com.senac.pizzademo.service.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(TestSecurityConfig.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegisterSuccess() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("123456");

        Mockito.when(userService.findByUsername("testuser")).thenReturn(Optional.empty());
        Mockito.when(userService.save(Mockito.any(User.class))).thenReturn(user);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void testRegisterUserExists() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("123456");

        Mockito.when(userService.findByUsername("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Usuário já existe"));
    }

    @Test
    void testLoginSuccess() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("123456");

        Mockito.when(userService.findByUsername("testuser")).thenReturn(Optional.of(user));
        Mockito.when(userService.checkPassword(user, "123456")).thenReturn(true);
        Mockito.when(jwtService.generateToken("testuser")).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("username", "testuser", "password", "123456"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }

    @Test
    void testLoginInvalidCredentials() throws Exception {
        Mockito.when(userService.findByUsername("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("username", "testuser", "password", "wrong"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Usuário ou senha inválidos"));
    }
}
