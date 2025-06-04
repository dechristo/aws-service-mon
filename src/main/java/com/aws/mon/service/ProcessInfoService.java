package com.aws.mon.service;

import com.aws.mon.model.ProcessInfo;
import com.aws.mon.response.ActuatorMetricResponse;
import com.aws.mon.utils.HttpUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class ProcessInfoService {
    private final String actuatorProcessStartTimeUrl = "/actuator/metrics/process.start.time";
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;

    public ProcessInfo getAppStartTimeForBothInstance() {
        double appStartDateInstance1 = this.getAppProcessStartTimeForInstance();
        double appStartDateInstance2 = this.getAppProcessStartTimeForInstance();
        return new ProcessInfo(appStartDateInstance1, appStartDateInstance2);
    }

    private double getAppProcessStartTimeForInstance() {
        log.info("Acquiring app start time.");

        try {
            HttpHeaders headers = httpUtils.initializeHeaderWithBasicAuth();
            HttpEntity request = new HttpEntity(headers);

            ResponseEntity<ActuatorMetricResponse> response =
                restTemplate.exchange(actuatorProcessStartTimeUrl, HttpMethod.GET, request, ActuatorMetricResponse.class);
            return Double.parseDouble(response.getBody().getMeasurements()[0].getValue());
        } catch (Exception ex) {
            log.error("ProcessInfo ERROR:" + ex.getMessage());
        }
        return 0;
    }
}
