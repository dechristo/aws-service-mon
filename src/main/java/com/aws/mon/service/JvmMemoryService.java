package com.aws.mon.service;

import com.aws.mon.entity.JvmMeasurement;
import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.JvmMemoryMeasurement;
import com.aws.mon.response.ActuatorMetricResponse;
import com.aws.mon.utils.DateTimeUtils;
import com.aws.mon.utils.HttpUtils;
import com.aws.mon.enums.Ec2Instance;
import com.aws.mon.enums.MeasurementType;
import com.aws.mon.repository.JvmMeasurementRepository;
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

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class JvmMemoryService {
    private final String actuatorJvmMemoryUrl = "/actuator/metrics/jvm.memory.used";
    private final List<JvmMemoryMeasurement> memoryUsageHistoryInstance1 = new ArrayList<JvmMemoryMeasurement>();
    private final List<JvmMemoryMeasurement> memoryUsageHistoryInstance2 = new ArrayList<JvmMemoryMeasurement>();
    private AwsAlbRequestParams awsAlbRequestParamsInstance1;
    private AwsAlbRequestParams awsAlbRequestParamsInstance2;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;
    @Autowired
    private JvmMeasurementRepository jvmMeasurementRepository;

    public List<JvmMemoryMeasurement> getMemoryUsageHistoryByInstanceId(int instanceId) {
        if (instanceId == 1) return this.memoryUsageHistoryInstance1;
        if (instanceId == 2) return this.memoryUsageHistoryInstance2;
        return List.of();
    }

    public JvmMemoryMeasurement getMemoryConsumptionEc2Instance1() {
        if (memoryUsageHistoryInstance1.isEmpty()){
            return new JvmMemoryMeasurement(BigInteger.ZERO, DateTimeUtils.now());
        }

        return memoryUsageHistoryInstance1.get(memoryUsageHistoryInstance1.size()-1);
    }

    public JvmMemoryMeasurement getMemoryConsumptionEc2Instance2() {
        if (memoryUsageHistoryInstance2.isEmpty()){
            return new JvmMemoryMeasurement(BigInteger.ZERO, DateTimeUtils.now());
        }

        return memoryUsageHistoryInstance2.get(memoryUsageHistoryInstance2.size()-1);
    }

    @PostConstruct
    private void init() {
        this.awsAlbRequestParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());

        this.awsAlbRequestParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    private void getCurrentEc2InstanceMemoryConsumption(
        AwsAlbRequestParams awsAlbMemoryRequestParams,
        List<JvmMemoryMeasurement> memoryUsageHistory) {

        log.info("Acquiring Memory usage data for: "+ awsAlbMemoryRequestParams.getEc2Instance());

        try {

            HttpEntity httpEntity = new HttpEntity(awsAlbMemoryRequestParams.getHeaders());
            log.info("Memory cookie: " + awsAlbMemoryRequestParams.getAwsAlbCookie());
            ResponseEntity<ActuatorMetricResponse> response =
                    restTemplate.exchange(actuatorJvmMemoryUrl, HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbMemoryRequestParams.setAwsAlbCookie(awsAlbCookie);
            awsAlbMemoryRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbCookie);
            log.info("Memory NEW cookie: " + awsAlbMemoryRequestParams.getAwsAlbCookie());
            JvmMemoryMeasurement jvmMemoryMeasurement = new JvmMemoryMeasurement(
                new BigDecimal(
                    response.getBody().getMeasurements()[0].getValue()).toBigInteger(),
                    DateTimeUtils.now()
            );
            log.info("Memory acquired for " + awsAlbMemoryRequestParams.getEc2Instance() + ": " + jvmMemoryMeasurement.getMemoryUsage());
            memoryUsageHistory.add(jvmMemoryMeasurement);
            this.save(jvmMemoryMeasurement, awsAlbMemoryRequestParams.getEc2Instance());
        } catch(Exception ex) {
            log.error("JvmMemoryService ERROR:" + ex.getMessage());
            memoryUsageHistory.add(new JvmMemoryMeasurement(BigInteger.ZERO, DateTimeUtils.now()));
        }
    }

    private void save(JvmMemoryMeasurement jvmMemoryMeasurement, Ec2Instance ec2Instance) {
        JvmMeasurement usedMemory = new JvmMeasurement();
        usedMemory.setEc2Instance(ec2Instance.getEc2InstanceId());
        usedMemory.setValue(jvmMemoryMeasurement.getMemoryUsage().longValue());
        usedMemory.setMeasurementType(MeasurementType.UsedMemory.getMeasurementType());
        usedMemory.setMeasurementDate(DateTimeUtils.now(jvmMemoryMeasurement.getDate()));
        jvmMeasurementRepository.save(usedMemory);
    }

    @Scheduled(fixedDelay=1433)
    private void getMemoryConsumption() {
        this.getCurrentEc2InstanceMemoryConsumption(
            awsAlbRequestParamsInstance1, memoryUsageHistoryInstance1);
    }

    @Scheduled(fixedDelay=2711)
    private void getMemoryConsumption2() {
        this.getCurrentEc2InstanceMemoryConsumption(
            awsAlbRequestParamsInstance2, memoryUsageHistoryInstance2);
    }
}