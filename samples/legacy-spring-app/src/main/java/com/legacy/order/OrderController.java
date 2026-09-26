package com.legacy.order;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.annotation.PostConstruct;

/**
 * Spring REST Controller using javax.servlet and javax.validation namespaces.
 */
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostConstruct
    public void init() {
        System.out.println("OrderController initialized with javax.annotation lifecycle");
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto, HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        System.out.println("Processing order from client IP: " + clientIp);
        OrderDto processed = orderService.processOrder(orderDto);
        return ResponseEntity.ok(processed);
    }

    @GetMapping("/health")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Legacy Service Running");
    }
}
