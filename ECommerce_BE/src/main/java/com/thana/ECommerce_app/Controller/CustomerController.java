package com.thana.ECommerce_app.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thana.ECommerce_app.Models.Orders;
import com.thana.ECommerce_app.Models.Products;
import com.thana.ECommerce_app.Service.CustomerService;
import com.thana.ECommerce_app.dto.Cartdto.CartRequest;
import com.thana.ECommerce_app.dto.Orderdto.OrderRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/customer")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;

    @GetMapping("/dashboard")
    public ResponseEntity<List<Products>> getDashboard() {
        try{
            List<Products> products = customerService.getProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/addToCart")
    public ResponseEntity<String> addToCart(@RequestBody CartRequest cartRequest) {
        try {
            customerService.addToCart(cartRequest);
            return ResponseEntity.ok("Product added to cart successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding product to cart");
        }
    }

    boolean paymentSuccess = false;
    @RequestMapping("/payment")
    public ResponseEntity<String> makePayment() {
        try {
            paymentSuccess = customerService.makepayment();
            if (paymentSuccess) {
                return ResponseEntity.ok("Payment successful");
            } else {
                return ResponseEntity.status(400).body("Payment failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing payment");
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<Products>> searchProducts(@RequestParam String query) {
        try {
            List<Products> products = customerService.searchProducts(query);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    
    @PostMapping("/order")
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequest orderRequest) {
        try {
            if (!paymentSuccess) {
                return ResponseEntity.status(400).body("Payment not successful. Please make payment before placing order.");
            }
            customerService.placeOrder(orderRequest);
            return ResponseEntity.ok("Order placed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error placing order");
        }
    }

    @GetMapping("/orderhistory")
    public ResponseEntity<List<Orders>> getOrderHistory() {
        try {
            List<Orders> orders = customerService.getOrderHistory();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/cancelorder")
    public ResponseEntity<String> cancelOrder(@RequestParam Long orderId) {
        try {
            customerService.cancelOrder(orderId);
            return ResponseEntity.ok("Order canceled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error canceling order");
        }
    }
    
}
