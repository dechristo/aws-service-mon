package com.aws.mon.controller;

import com.aws.mon.model.InstanceHealth;
import com.aws.mon.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health")
@CrossOrigin(origins = "*")
public class HealthController {
    @Autowired
    HealthService service;
    @GetMapping("/{instanceId}")
    public ResponseEntity<InstanceHealth> getInstanceHealth(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getHealthForEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getHealthForEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
