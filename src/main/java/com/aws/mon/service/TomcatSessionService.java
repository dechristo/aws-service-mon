package com.aws.mon.service;

import com.aws.mon.entity.JvmMeasurement;
import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.TomcatSession;
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
public class TomcatSessionService {
    private final String actuatorJvmThreadBaseUrl = "/actuator/metrics";
    private final List<TomcatSession> tomcatSessionHistoryInstance1 = new ArrayList<TomcatSession>();
    private final List<TomcatSession> tomcatSessionHistoryInstance2 = new ArrayList<TomcatSession>();
    private AwsAlbRequestParams awsAlbTomcatSessionRequestParamsInstance1;
    private AwsAlbRequestParams awsAlbTomcatSessionRequestParamsInstance2;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;
    @Autowired
    private JvmMeasurementRepository jvmMeasurementRepository;

    public List<TomcatSession> geTomcatSessionHistoryByInstanceId(int instanceId) {
        if (instanceId == 1) return this.tomcatSessionHistoryInstance1;
        if (instanceId == 2) return this.tomcatSessionHistoryInstance2;
        return List.of();
    }

    public TomcatSession getTomcatSessionEc2Instance1() {
        if (tomcatSessionHistoryInstance1.isEmpty()) {
            return new TomcatSession(BigInteger.ZERO, DateTimeUtils.now());
        }

        return tomcatSessionHistoryInstance1.get(tomcatSessionHistoryInstance1.size() - 1);
    }

    public TomcatSession getTomcatSessionEc2Instance2() {
        if (tomcatSessionHistoryInstance2.isEmpty()) {
            return new TomcatSession(BigInteger.ZERO, DateTimeUtils.now());
        }

        return tomcatSessionHistoryInstance2.get(tomcatSessionHistoryInstance2.size() - 1);
    }

    @PostConstruct
    private void init() {
        this.awsAlbTomcatSessionRequestParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());

        this.awsAlbTomcatSessionRequestParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    private void getCurrentEc2InstanceTomcatSessionInfo(
        AwsAlbRequestParams awsAlbThreadRequestParams,
        List<TomcatSession> tomcatSessions) {

        log.info("Acquiring tomcat sessions data for " + awsAlbThreadRequestParams.getEc2Instance());

        try {

            HttpEntity httpEntity = new HttpEntity(awsAlbThreadRequestParams.getHeaders());

            ResponseEntity<ActuatorMetricResponse> response =
                restTemplate.exchange(actuatorJvmThreadBaseUrl + "/tomcat.sessions.active.current",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbThreadRequestParams.setAwsAlbCookie(awsAlbCookie);
            awsAlbThreadRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbThreadRequestParams.getAwsAlbCookie());

            TomcatSession tomcatSession = new TomcatSession(
                new BigDecimal(
                    response.getBody().getMeasurements()[0].getValue()).toBigInteger(),
                DateTimeUtils.now()
            );
            tomcatSessions.add(tomcatSession);
            this.save(tomcatSession, awsAlbThreadRequestParams.getEc2Instance());
        } catch (Exception ex) {
            log.error("JvmThreadService ERROR:" + ex.getMessage());
            tomcatSessions.add(new TomcatSession(BigInteger.ZERO, DateTimeUtils.now()));
        }
    }

    private void save(TomcatSession tomcatSession, Ec2Instance ec2Instance) {
        JvmMeasurement threadsLive = new JvmMeasurement();
        threadsLive.setEc2Instance(ec2Instance.getEc2InstanceId());
        threadsLive.setValue(tomcatSession.getActive().longValue());
        threadsLive.setMeasurementType(MeasurementType.TomcatActiveSessions.getMeasurementType());
        threadsLive.setMeasurementDate(DateTimeUtils.now(tomcatSession.getDate()));
        jvmMeasurementRepository.save(threadsLive);
    }

    @Scheduled(fixedDelay = 3000)
    private void getTomcatSessionsForBothEc2Instances() {
        this.getCurrentEc2InstanceTomcatSessionInfo(
            awsAlbTomcatSessionRequestParamsInstance1, tomcatSessionHistoryInstance1);

        this.getCurrentEc2InstanceTomcatSessionInfo(
            awsAlbTomcatSessionRequestParamsInstance2, tomcatSessionHistoryInstance2);
    }
}
