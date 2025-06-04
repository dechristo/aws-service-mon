package com.aws.mon.controller;

import com.aws.mon.model.JvmThreadMeasurement;
import com.aws.mon.service.JvmThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/thread")
@CrossOrigin(origins = "*")
public class JvmThreadController {
    @Autowired
    JvmThreadService service;
    @GetMapping("/current/{instanceId}")
    public ResponseEntity<JvmThreadMeasurement> getCurrentEc2ThreadUsage(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getThreadsEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getThreadsEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
    @GetMapping("/history/{instanceId}")
    public ResponseEntity<List<JvmThreadMeasurement>> getHistoryEc2ThreadUsage(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getThreadsHistoryByInstanceId(1), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getThreadsHistoryByInstanceId(2), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
