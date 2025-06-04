package com.aws.mon;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling
@EnableEncryptableProperties
public class AwsMonApplication {

	public static ConfigurableApplicationContext context;
	public static void main(String[] args) {
		context = SpringApplication.run(AwsMonApplication.class, args);
	}

	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	public static void restart() {
		ApplicationArguments args = context.getBean(ApplicationArguments.class);

		Thread thread = new Thread(() -> {
			context.close();
			context = SpringApplication.run(AwsMonApplication.class, args.getSourceArgs());
		});

		thread.setDaemon(false);
		thread.start();
	}
}
