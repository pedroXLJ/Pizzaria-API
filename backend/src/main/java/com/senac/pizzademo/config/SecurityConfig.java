package com.senac.pizzademo.config;

import com.senac.pizzademo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private Environment environment;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        String[] activeProfiles = environment.getActiveProfiles();
        java.util.List<String> profiles = java.util.Arrays.asList(activeProfiles);
        boolean isTestOrDefaultProfile = profiles.contains("test") || profiles.isEmpty() || profiles.contains("default");
        if (isTestOrDefaultProfile) {
            http.csrf().disable();
        }
        http
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/pizzas/**").permitAll() // Libera GET /pizzas para todos
                .anyRequest().authenticated()
            .and();
        // Só adiciona o filtro JWT se não estiver rodando em profile de teste
        if (!profiles.contains("test")) {
            http.addFilterBefore(jwtService, UsernamePasswordAuthenticationFilter.class);
        }
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
