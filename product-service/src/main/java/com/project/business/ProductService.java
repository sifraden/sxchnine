package com.project.business;


import com.project.exception.ProductNotFoundException;
import com.project.model.Product;
import com.project.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private KafkaProducer kafkaProducer;

    @Cacheable(value = "productsCache", key = "#id", unless = "#result==null")
    public Product getProductById(String id){
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found !"));
    }

    @Cacheable(value = "productsCache", key = "#name", unless = "#result==null")
    public Product getProductByName(String name){
        return productRepository.findProductByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Product not found "));
    }

    @Cacheable("productsCache")
    public List<Product> getAllProducts(){
        log.info("Get all products");
        return (List<Product>) productRepository.findAll();
    }

    public boolean isProductExistById(String id){
        return productRepository.existsById(id);
    }

    @CachePut(value = "productsCache", key = "#product.id")
    public Product save(Product product){
        Product savedProduct = productRepository.save(product);
        kafkaProducer.sendProduct(savedProduct);
        return savedProduct;
    }

    @CacheEvict(value = "productsCache", key = "#id")
    public void deleteProductById(String id){
        productRepository.deleteById(id);
        log.debug("Product {} is deleted.", id);
    }

    @CacheEvict(value = "productsCache", key = "#id")
    public void deleteProduct(Product product){
        productRepository.delete(product);
        log.debug("Product is deleted.");

    }
}
