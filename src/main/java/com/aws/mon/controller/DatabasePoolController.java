package com.aws.mon.controller;

import com.aws.mon.model.DatabaseConnectionPool;
import com.aws.mon.service.DatabasePoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/db")
@CrossOrigin(origins = "*")
public class DatabasePoolController {
    @Autowired
    private DatabasePoolService databasePoolService;
    @GetMapping("/pool/current/{instanceId}")
    public ResponseEntity<DatabaseConnectionPool> getCurrentEc2DatabaseConnectionPool(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(databasePoolService.getDbPoolUsageForEc2Instance1(), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(databasePoolService.getDbPoolUsageForEc2Instance2(), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
    @GetMapping("/pool/history/{instanceId}")
    public ResponseEntity<List<DatabaseConnectionPool>> getHistoryEc2DatabaseConnectionPool(@PathVariable int instanceId) {
        return switch (instanceId) {
            case 1 -> new ResponseEntity<>(databasePoolService.getDbPoolUsageHistoryByInstanceId(1), HttpStatus.OK);
            case 2 -> new ResponseEntity<>(databasePoolService.getDbPoolUsageHistoryByInstanceId(2), HttpStatus.OK);
            default -> ResponseEntity.notFound().build();
        };
    }
}
