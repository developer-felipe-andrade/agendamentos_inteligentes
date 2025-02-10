package br.edu.ifpr.irati.ads.agenda_inteligente;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AgendaInteligenteApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgendaInteligenteApplication.class, args);
	}

}
