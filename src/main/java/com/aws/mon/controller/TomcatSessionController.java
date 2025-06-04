package com.aws.mon.controller;

import com.aws.mon.model.TomcatSession;
import com.aws.mon.service.TomcatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tomcat-session")
@CrossOrigin(origins = "*")
public class TomcatSessionController {
    @Autowired
    TomcatSessionService service;
    @GetMapping("/current/active/{instanceId}")
    public ResponseEntity<TomcatSession> getCurrentEc2TomcatSession(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getTomcatSessionEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getTomcatSessionEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
    @GetMapping("/history/active/{instanceId}")
    public ResponseEntity<List<TomcatSession>> getHistoryEc2TomcatSession(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.geTomcatSessionHistoryByInstanceId(1), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.geTomcatSessionHistoryByInstanceId(2), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
