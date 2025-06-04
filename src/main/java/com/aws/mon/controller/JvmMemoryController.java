package com.aws.mon.controller;

import com.aws.mon.model.JvmMemoryMeasurement;
import com.aws.mon.service.JvmMemoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mem")
@CrossOrigin(origins = "*")
class JvmMemoryController {
    @Autowired
    JvmMemoryService service;
    @GetMapping("/current/{instanceId}")
    public ResponseEntity<JvmMemoryMeasurement> getCurrentEc2MemoryConsumption(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getMemoryConsumptionEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getMemoryConsumptionEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
    @GetMapping("/history/{instanceId}")
    public ResponseEntity<List<JvmMemoryMeasurement>> getHistoryEc2MemoryConsumption(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getMemoryUsageHistoryByInstanceId(1), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getMemoryUsageHistoryByInstanceId(2), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
