package com.legacy.order;

import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import org.junit.Assert;

/**
 * Legacy JUnit 4 test suite.
 * Needs migration to JUnit 5 Jupiter engine (@Test, @BeforeEach, Assertions).
 */
public class OrderServiceTest {

    private OrderService orderService;

    @Before
    public void setUp() {
        orderService = new OrderService();
    }

    @After
    public void tearDown() {
        orderService = null;
    }

    @Test
    public void testProcessOrder() {
        OrderDto input = new OrderDto(null, "enterprise@client.com", 249.99, null);
        OrderDto result = orderService.processOrder(input);

        Assert.assertNotNull(result);
        Assert.assertEquals(Long.valueOf(1001L), result.getOrderId());
        Assert.assertEquals("USD", result.getCurrency());
    }
}
