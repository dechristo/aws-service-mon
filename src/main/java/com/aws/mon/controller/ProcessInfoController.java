package com.aws.mon.controller;

import com.aws.mon.model.ProcessInfo;
import com.aws.mon.service.ProcessInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/process")
@CrossOrigin(origins = "*")
public class ProcessInfoController {
    @Autowired
    ProcessInfoService service;
    @GetMapping("/app-start-time")
    public ResponseEntity<ProcessInfo> getAppStartTimeForBothInstances() {
        return ResponseEntity.ok(service.getAppStartTimeForBothInstance());
    }
}
