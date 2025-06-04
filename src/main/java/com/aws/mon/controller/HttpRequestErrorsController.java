package com.aws.mon.controller;

import com.aws.mon.model.HttpErrors;
import com.aws.mon.service.HttpRequestErrorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/http-errors")
@CrossOrigin(origins = "*")
public class HttpRequestErrorsController {

    @Autowired
    HttpRequestErrorService service;

    @GetMapping("/{instanceId}")
    public ResponseEntity<HttpErrors> getInstanceHttpRequestErrors(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getHttpErrorsEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getHttpErrorsEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
