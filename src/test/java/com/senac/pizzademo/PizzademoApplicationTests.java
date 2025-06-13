package com.senac.pizzademo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"spring.profiles.active=test"})
class PizzademoApplicationTests {

	@Test
	void contextLoads() {
	}

}
