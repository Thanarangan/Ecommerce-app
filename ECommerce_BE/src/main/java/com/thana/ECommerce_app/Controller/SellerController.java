package com.thana.ECommerce_app.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.thana.ECommerce_app.Models.Products;
import com.thana.ECommerce_app.Models.Transaction;
import com.thana.ECommerce_app.Service.SellerService;
import com.thana.ECommerce_app.dto.Authdto.ProductRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;

@RestController
@RequestMapping("/seller")
public class SellerController {
    @Autowired
    private SellerService sellerService;

    @GetMapping("/dashboard")
    public ResponseEntity<List<Products>> dashboard() {
        try{
            List<Products> products = sellerService.dashboard();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/addProduct")
    public ResponseEntity<String> addProduct(@RequestPart("product") ProductRequest productRequest, @RequestPart("image") MultipartFile image) {
        try{
            sellerService.addProduct(productRequest, image);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add product");
        }
        return ResponseEntity.ok("Product added successfully");
    }

    @GetMapping("/deleteproduct")
    public ResponseEntity<String> deleteProduct(@RequestParam Long productId){
        try{
            sellerService.deleteProduct(productId);
            return ResponseEntity.status(200).body("Product deleted successfully");
        }catch(Exception e){
            return ResponseEntity.status(500).body("failed to delete product");
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions() {
        try {
            List<Transaction> transactions = sellerService.getTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/revenue")
    public ResponseEntity<Double> getRevenue() {
        try {
            List<Transaction> transactions = sellerService.getTransactions();
            double revenue = transactions.stream().mapToDouble(Transaction::getAmount).sum();
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
}
