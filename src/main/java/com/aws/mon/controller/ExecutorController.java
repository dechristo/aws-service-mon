package com.aws.mon.controller;

import com.aws.mon.model.ExecutorTask;
import com.aws.mon.service.ExecutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/executor")
@CrossOrigin(origins = "*")
public class ExecutorController {
    @Autowired
    ExecutorService service;

    @GetMapping("/current/{instanceId}")
    public ResponseEntity<ExecutorTask> getCurrentEc2ThreadInfo(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getExecutorTasksForEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getExecutorTasksForEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }

    @GetMapping("/history/{instanceId}")
    public ResponseEntity<List<ExecutorTask>> getHistoryEc2ThreadInfo(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(service.getExecutorHistoryByInstanceId(1), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(service.getExecutorHistoryByInstanceId(2), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
