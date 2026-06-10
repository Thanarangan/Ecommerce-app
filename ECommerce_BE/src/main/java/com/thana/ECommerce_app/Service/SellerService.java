package com.thana.ECommerce_app.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.thana.ECommerce_app.Models.Products;
import com.thana.ECommerce_app.Models.Transaction;
import com.thana.ECommerce_app.Models.Users;
import com.thana.ECommerce_app.Repository.ProductRepo;
import com.thana.ECommerce_app.Repository.TransactionRepo;
import com.thana.ECommerce_app.Repository.UserRepo;
import com.thana.ECommerce_app.dto.Authdto.ProductRequest;

@Service
public class SellerService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TransactionRepo transactionRepo;
    
    public void addProduct(ProductRequest productRequest, MultipartFile image) throws IOException{
        try{
            Products product = new Products();
            product.setProductName(productRequest.getP_name());
            product.setProductDesc(productRequest.getP_desc());
            product.setProductPrice(productRequest.getP_price());
            byte[] imageBytes = image.getBytes();
            product.setProductImage(imageBytes);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            Users user = userRepo.findByEmail(email);
            product.setSellerId(user.getCustomerId());
            productRepo.save(product);
        } catch (IOException e) {
            throw new IOException("Failed to add the product", e);
        }
    }

    public List<Products> dashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated user: " + auth.getName());
        String email = auth.getName();
        Users user = userRepo.findByEmail(email);
        System.out.println("User ID: " + user.getCustomerId());
        return productRepo.findBySellerId(user.getCustomerId());
    }

    public void deleteProduct(Long productId) {
        productRepo.deleteByProductId(productId);
    }

    public List<Transaction> getTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Users user = userRepo.findByEmail(email);
        return transactionRepo.findBySellerId(user.getCustomerId());
    }
    

}
