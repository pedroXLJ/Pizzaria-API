package com.senac.pizzademo.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class IngredienteTest {
    @Test
    void testConstructorAndGettersSetters() {
        Pizza pizza = new Pizza();
        Ingrediente ingrediente = new Ingrediente("Queijo", pizza);

        assertEquals("Queijo", ingrediente.getNome());
        assertEquals(pizza, ingrediente.getPizza());

        ingrediente.setNome("Presunto");
        assertEquals("Presunto", ingrediente.getNome());

        Pizza pizza2 = new Pizza();
        ingrediente.setPizza(pizza2);
        assertEquals(pizza2, ingrediente.getPizza());
    }

    @Test
    void testDefaultConstructor() {
        Ingrediente ingrediente = new Ingrediente();
        assertNull(ingrediente.getNome());
        assertNull(ingrediente.getPizza());
        assertNull(ingrediente.getId());
    }
}
