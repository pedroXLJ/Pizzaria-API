package com.senac.pizzademo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.senac.pizzademo.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
