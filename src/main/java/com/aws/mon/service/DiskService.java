package com.aws.mon.service;

import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.DiskInfo;
import com.aws.mon.response.ActuatorMetricResponse;
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

import java.math.BigInteger;

@Service
@Slf4j
public class DiskService {
    private final String actuatorFreeDiskUrl = "/actuator/metrics/disk.free";
    private final String actuatorTotalDiskUrl = "/actuator/metrics/disk.total";
    private AwsAlbRequestParams awsDiskRequestParamsRequest1;
    private AwsAlbRequestParams awsDiskRequestParamsRequest2;
    private DiskInfo diskInfoInstance1 = new DiskInfo();
    private DiskInfo diskInfoInstance2 = new DiskInfo();
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;

    private boolean totalSizeAlreadyFetched = false;
    @PostConstruct
    private void init() {
        this.awsDiskRequestParamsRequest1 =
            new AwsAlbRequestParams(Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());
        this.awsDiskRequestParamsRequest2 =
            new AwsAlbRequestParams(Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    public DiskInfo getDiskInfoForEc2Instance1() {
        return this.diskInfoInstance1;
    }

    public DiskInfo getDiskInfoForEc2Instance2() {
        return this.diskInfoInstance2;
    }

    private void getEC2InstanceTotalDiskSize(AwsAlbRequestParams awsAlbRequestParams, DiskInfo diskInfo) {
        HttpEntity httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
        ResponseEntity<ActuatorMetricResponse> response =
            restTemplate.exchange(actuatorTotalDiskUrl, HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
        BigInteger totalDiskSpace = BigInteger.valueOf(Double.valueOf(response.getBody().getMeasurements()[0].getValue()).longValue());
        diskInfo.setTotalSpace(totalDiskSpace);
        String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
        awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
        awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbCookie);
    }

    private void getCurrentEc2FreeDiskSpace(
        DiskInfo diskInfo, AwsAlbRequestParams awsDiskParamsRequest) {

        log.debug("Acquiring Instances Disk data.");

        try {


            HttpEntity httpEntity = new HttpEntity(awsDiskParamsRequest.getHeaders());

            if (!this.totalSizeAlreadyFetched) {
                this.getEC2InstanceTotalDiskSize(awsDiskParamsRequest, diskInfo);
            }

            ResponseEntity<ActuatorMetricResponse> response =
                restTemplate.exchange(actuatorFreeDiskUrl, HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsDiskParamsRequest.setAwsAlbCookie(awsAlbCookie);
            diskInfo.setFreeSpace(BigInteger.valueOf(Double.valueOf(response.getBody().getMeasurements()[0].getValue()).longValue()));
            awsDiskParamsRequest.getHeaders().set(HttpHeaders.COOKIE, awsDiskParamsRequest.getAwsAlbCookie());
        } catch(Exception ex) {
            log.error("DiskService ERROR:" + ex.getMessage());
            diskInfo.setFreeSpace(BigInteger.valueOf(-1));
        }
    }

    @Scheduled(fixedDelay=3000)
    private void getHealthCheckForInstance1() {
        this.getCurrentEc2FreeDiskSpace(diskInfoInstance1, awsDiskRequestParamsRequest1);
    }

    @Scheduled(fixedDelay=4777)
    private void getHealthCheckForInstance2() {
        this.getCurrentEc2FreeDiskSpace(diskInfoInstance2, awsDiskRequestParamsRequest2);
    }
}

