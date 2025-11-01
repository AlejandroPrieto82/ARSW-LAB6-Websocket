package eci.edu.websocket.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class WebController {
    @GetMapping("/status")
     public String status() {
        return "{\"status\":\"Greetings from Spring Boot "
                + java.time.LocalDate.now() + ", "
                + java.time.LocalTime.now()
                + ". " + "The server is Runnig!\"}";
    }
}
