package com.cs261group5.CRUD.configurer;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // URL ของ Frontend ที่อนุญาต
                .allowedMethods("GET", "POST", "PUT", "DELETE") // กำหนด HTTP methods ที่รองรับ
                .allowedHeaders("*") // อนุญาตทุก header
                .allowCredentials(true);
    }
}
