package com.aws.mon.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class HttpUtils {
    @Value("${app.username}")
    private String username;
    @Value("${app.password}")
    private String password;
    public HttpHeaders initializeHeaderWithBasicAuth() {
        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setBasicAuth(username, password);

        return headers;
    }
}
