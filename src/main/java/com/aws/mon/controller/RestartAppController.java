package com.aws.mon.controller;

import com.aws.mon.AwsMonApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/app")
public class RestartAppController {

    @GetMapping("/restart")
    public void restart() {
        AwsMonApplication.restart();
    }
}
