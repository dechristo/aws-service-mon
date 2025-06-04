package com.aws.mon.controller;

import com.aws.mon.model.DiskInfo;
import com.aws.mon.service.DiskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/disk")
@CrossOrigin(origins = "*")
public class DiskController {
    @Autowired
    DiskService service;
    @GetMapping("/free/{instanceId}")
    public ResponseEntity<DiskInfo> getInstanceHealth(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getDiskInfoForEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getDiskInfoForEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
