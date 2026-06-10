package com.thana.ECommerce_app.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.thana.ECommerce_app.Models.Cart;
import com.thana.ECommerce_app.Models.Orders;
import com.thana.ECommerce_app.Models.Products;
import com.thana.ECommerce_app.Models.Transaction;
import com.thana.ECommerce_app.Repository.CartRepo;
import com.thana.ECommerce_app.Repository.OrdersRepo;
import com.thana.ECommerce_app.Repository.ProductRepo;
import com.thana.ECommerce_app.Repository.TransactionRepo;
import com.thana.ECommerce_app.Repository.UserRepo;
import com.thana.ECommerce_app.dto.Cartdto.CartRequest;
import com.thana.ECommerce_app.dto.Orderdto.OrderRequest;

@Service
public class CustomerService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private OrdersRepo ordersRepo;

    @Autowired
    private TransactionRepo transactionRepo;

    public List<Products> getProducts() {
        return productRepo.findAll();
    }

    public void addToCart(CartRequest cartRequest) {
        Cart cart = new Cart();
        System.out.println("Product ID: " + cartRequest.getProductId());
        System.out.println("Quantity: " + cartRequest.getQuantity());
        cart.setProductId(cartRequest.getProductId());
        cart.setQuantity(cartRequest.getQuantity());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        cart.setCustomerId(userRepo.findByEmail(email).getCustomerId());
        cartRepo.save(cart);
    }

    public boolean makepayment(){
        return true;
    }

    public void placeOrder(OrderRequest orderRequest) {
        Orders order = new Orders();
        order.setProductId(orderRequest.getProductId());
        order.setQuantity(orderRequest.getQuantity());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        order.setCustomerId(userRepo.findByEmail(email).getCustomerId());
        order.setProductname(productRepo.findByProductId(orderRequest.getProductId()).getProductName());
        ordersRepo.save(order);
        try{
            logTransaction(order);
        } catch (Exception e) {
            throw new RuntimeException("Transaction failed: " + e.getMessage());
        }
    }

    public void logTransaction(Orders order){
        Transaction transaction = new Transaction();
        transaction.setAmount(order.getQuantity() * productRepo.findByProductId(order.getProductId()).getProductPrice());
        transaction.setCustomerId(order.getCustomerId());
        transaction.setProductId(order.getProductId());
        transaction.setProductName(order.getProductname());
        transaction.setSellerId(productRepo.findByProductId(order.getProductId()).getSellerId());
        transactionRepo.save(transaction);
    }

    public List<Products> searchProducts(String query) {
        return productRepo.findByProductNameContainingIgnoreCase(query);
    }

    public List<Orders> getOrderHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long customerId = userRepo.findByEmail(email).getCustomerId();
        return ordersRepo.findByCustomerId(customerId);
    }

    public void cancelOrder(Long orderId) {
        Orders order = ordersRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        ordersRepo.delete(order);
    }
    
}
