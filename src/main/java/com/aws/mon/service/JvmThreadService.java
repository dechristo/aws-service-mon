package com.aws.mon.service;

import com.aws.mon.entity.JvmMeasurement;
import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.JvmThreadMeasurement;
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
public class JvmThreadService {
    private final String actuatorJvmThreadBaseUrl = "/actuator/metrics";
    private final List<JvmThreadMeasurement> threadsHistoryInstance1 = new ArrayList<JvmThreadMeasurement>();
    private final List<JvmThreadMeasurement> threadsHistoryInstance2 = new ArrayList<JvmThreadMeasurement>();
    private AwsAlbRequestParams awsAlbThreadRequestParamsInstance1;
    private AwsAlbRequestParams awsAlbThreadRequestParamsInstance2;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;
    @Autowired
    private JvmMeasurementRepository jvmMeasurementRepository;

    public List<JvmThreadMeasurement> getThreadsHistoryByInstanceId(int instanceId) {
        if (instanceId == 1) return this.threadsHistoryInstance1;
        if (instanceId == 2) return this.threadsHistoryInstance2;
        return List.of();
    }

    public JvmThreadMeasurement getThreadsEc2Instance1() {
        if (threadsHistoryInstance1.isEmpty()){
            return new JvmThreadMeasurement(BigInteger.ZERO, DateTimeUtils.now());
        }

        return threadsHistoryInstance1.get(threadsHistoryInstance1.size()-1);
    }

    public JvmThreadMeasurement getThreadsEc2Instance2() {
        if (threadsHistoryInstance2.isEmpty()){
            return new JvmThreadMeasurement(BigInteger.ZERO, DateTimeUtils.now());
        }

        return threadsHistoryInstance2.get(threadsHistoryInstance2.size()-1);
    }

    @PostConstruct
    private void init() {
        this.awsAlbThreadRequestParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());

        this.awsAlbThreadRequestParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    private void getCurrentEc2InstanceThreadsUsage(
        AwsAlbRequestParams awsAlbThreadRequestParams,
        List<JvmThreadMeasurement> threadsUsageHistory) {

        log.info("Acquiring thread usage data for "+ awsAlbThreadRequestParams.getEc2Instance());

        try {

            HttpEntity httpEntity = new HttpEntity(awsAlbThreadRequestParams.getHeaders());

            ResponseEntity<ActuatorMetricResponse> response =
                restTemplate.exchange(actuatorJvmThreadBaseUrl + "/jvm.threads.live",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbThreadRequestParams.setAwsAlbCookie(awsAlbCookie);
            awsAlbThreadRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbThreadRequestParams.getAwsAlbCookie());

            JvmThreadMeasurement jvmThreadMeasurement = new JvmThreadMeasurement(
                new BigDecimal(
                    response.getBody().getMeasurements()[0].getValue()).toBigInteger(),
                DateTimeUtils.now()
            );
            threadsUsageHistory.add(jvmThreadMeasurement);
            this.save(jvmThreadMeasurement, awsAlbThreadRequestParams.getEc2Instance());
        } catch(Exception ex) {
            log.error("JvmThreadService ERROR:" + ex.getMessage());
            threadsUsageHistory.add(new JvmThreadMeasurement(BigInteger.ZERO, DateTimeUtils.now()));
        }
    }

    private void save(JvmThreadMeasurement jvmThreadMeasurement, Ec2Instance ec2Instance) {
        JvmMeasurement threadsLive = new JvmMeasurement();
        threadsLive.setEc2Instance(ec2Instance.getEc2InstanceId());
        threadsLive.setValue(jvmThreadMeasurement.getLiveThreads().longValue());
        threadsLive.setMeasurementType(MeasurementType.LiveThreads.getMeasurementType());
        threadsLive.setMeasurementDate(DateTimeUtils.now(jvmThreadMeasurement.getDate()));
        jvmMeasurementRepository.save(threadsLive);
    }

    @Scheduled(fixedDelay=3000)
    private void getThreadUsageForBothEc2Instances() {
        this.getCurrentEc2InstanceThreadsUsage(
            awsAlbThreadRequestParamsInstance1, threadsHistoryInstance1);

        this.getCurrentEc2InstanceThreadsUsage(
            awsAlbThreadRequestParamsInstance2, threadsHistoryInstance2);
    }
}
