package com.legacy.order;

import org.springframework.stereotype.Service;
import java.util.Date;

/**
 * Enterprise business service with legacy Java 8 idioms
 */
@Service
public class OrderService {

    public OrderDto processOrder(OrderDto dto) {
        // Deprecated primitive boxing constructor (deprecated in Java 9, removed in 16+)
        Integer orderBatchCode = new Integer(99901);
        Date timestamp = new Date();

        System.out.println("Processing batch: " + orderBatchCode + " at " + timestamp);

        if (dto.getOrderId() == null) {
            dto.setOrderId(1001L);
        }

        if (dto.getCurrency() == null) {
            dto.setCurrency("USD");
        }

        return dto;
    }
}
