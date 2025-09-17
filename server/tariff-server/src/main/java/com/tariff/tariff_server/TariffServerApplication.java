package com.tariff.tariff_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.tariff")
public class TariffServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TariffServerApplication.class, args);
	}

}
