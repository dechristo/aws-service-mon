package com.aws.mon.service;

import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.InstanceHealth;
import com.aws.mon.response.ActuatorHealthResponse;
import com.aws.mon.utils.HttpUtils;
import com.aws.mon.enums.Ec2Instance;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class HealthService {
    private final String actuatorHealthUrl = "/actuator/health";
    private final String INSTANCE_STATE_DOWN = "DOWN";
    private final String INSTANCE_STATE_UNKNOW = "UNKNOWN";
    private AwsAlbRequestParams awsAlbHealthParamsInstance1;
    private AwsAlbRequestParams awsAlbHealthParamsInstance2;
    private InstanceHealth instance1Health = new InstanceHealth(INSTANCE_STATE_UNKNOW);
    private InstanceHealth  instance2Health = new InstanceHealth(INSTANCE_STATE_UNKNOW);
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;

    @PostConstruct
    private void init() {
        this.awsAlbHealthParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());

        this.awsAlbHealthParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    public InstanceHealth getHealthForEc2Instance1() {
        return this.instance1Health;
    }

    public InstanceHealth getHealthForEc2Instance2() {
      return this.instance2Health;
    }

    private void getCurrentEc2HealthCheck(
        InstanceHealth instanceHealth, AwsAlbRequestParams awsAlbRequestParams) {

        log.info("Acquiring Instances Health data.");

        try {
            HttpEntity httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            ResponseEntity<ActuatorHealthResponse> response =
                restTemplate.exchange(actuatorHealthUrl, HttpMethod.GET, httpEntity, ActuatorHealthResponse.class);
            String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            instanceHealth.setStatus(response.getBody().getStatus());
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

        } catch(Exception ex) {
            log.error("HealthService ERROR:" + ex.getMessage());
            instanceHealth.setStatus(INSTANCE_STATE_DOWN);
        }
    }

    @Scheduled(fixedDelay=1700)
    private void getHealthCheckForInstance1() {
        this.getCurrentEc2HealthCheck(instance1Health, awsAlbHealthParamsInstance1);
    }

    @Scheduled(fixedDelay=2500)
    private void getHealthCheckForInstance2() {
        this.getCurrentEc2HealthCheck(instance2Health, awsAlbHealthParamsInstance2);
    }
}

