package com.thana.ECommerce_app.dto.Authdto;

public class ProductRequest {
    private String p_name;
    private String p_desc;
    private double p_price;
    public String getP_name() {
        return p_name;
    }
    public void setP_name(String p_name) {
        this.p_name = p_name;
    }
    public String getP_desc() {
        return p_desc;
    }
    public void setP_desc(String p_desc) {
        this.p_desc = p_desc;
    }
    public double getP_price() {
        return p_price;
    }
    public void setP_price(double p_price) {
        this.p_price = p_price;
    }
}
