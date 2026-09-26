package com.legacy.order;

import java.io.Serializable;

/**
 * Legacy mutable DTO with boilerplate getters, setters, and constructors.
 * Prime candidate for Java 21 Record modernization.
 */
public class OrderDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long orderId;
    private String customerEmail;
    private Double totalAmount;
    private String currency;

    public OrderDto() {
    }

    public OrderDto(Long orderId, String customerEmail, Double totalAmount, String currency) {
        this.orderId = orderId;
        this.customerEmail = customerEmail;
        this.totalAmount = totalAmount;
        this.currency = currency;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
