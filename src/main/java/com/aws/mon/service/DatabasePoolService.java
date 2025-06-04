package com.aws.mon.service;

import com.aws.mon.entity.JvmMeasurement;
import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.DatabaseConnectionPool;
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

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class DatabasePoolService {
    private final String actuatorConnectionsActiveBaseUrl = "/actuator/metrics/hikaricp.connections.active";
    private final String actuatorConnectionsTimeoutBaseUrl = "/actuator/metrics/hikaricp.connections.timeout";
    private final List<DatabaseConnectionPool> dbPoolUsageHistory1 = new ArrayList<DatabaseConnectionPool>();
    private final List<DatabaseConnectionPool> dbPoolUsageHistory2 = new ArrayList<DatabaseConnectionPool>();
    private AwsAlbRequestParams awsAlbDbPoolRequestParamsInstance1;
    private AwsAlbRequestParams awsAlbDbPoolRequestParamsInstance2;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;
    @Autowired
    private JvmMeasurementRepository jvmMeasurementRepository;

    public List<DatabaseConnectionPool> getDbPoolUsageHistoryByInstanceId(int instanceId) {
        if (instanceId == 1) return this.dbPoolUsageHistory1;
        if (instanceId == 2) return this.dbPoolUsageHistory2;
        return List.of();
    }

    public DatabaseConnectionPool getDbPoolUsageForEc2Instance1() {
        if (dbPoolUsageHistory1.isEmpty()) {
            return new DatabaseConnectionPool();
        }
        return dbPoolUsageHistory1.get(dbPoolUsageHistory1.size()-1);
    }

    public DatabaseConnectionPool getDbPoolUsageForEc2Instance2() {
        if (dbPoolUsageHistory2.isEmpty()) {
            return new DatabaseConnectionPool();
        }

        return dbPoolUsageHistory2.get(dbPoolUsageHistory2.size()-1);
    }

    @PostConstruct
    private void init() {
        awsAlbDbPoolRequestParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());
        awsAlbDbPoolRequestParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    private void getCurrentActuatorMeasurementForDatabasePool(
            AwsAlbRequestParams awsAlbRequestParams,
            List<DatabaseConnectionPool> dbPoolUsageHistory) {

        log.info("Acquiring DB Pool data.");

        try {
            DatabaseConnectionPool databaseConnectionPool = new DatabaseConnectionPool();

            float activeConnections = getActuatorMetricResponse(actuatorConnectionsActiveBaseUrl, awsAlbRequestParams);
            databaseConnectionPool.setActiveConnections(activeConnections);
            save(databaseConnectionPool, awsAlbDbPoolRequestParamsInstance1.getEc2Instance());

            float jpaPool = getActuatorMetricResponse(actuatorConnectionsActiveBaseUrl + "?tag=pool:jpaConnectionPool", awsAlbRequestParams);
            databaseConnectionPool.setJpaConnectionPool(jpaPool);
            save(databaseConnectionPool, awsAlbDbPoolRequestParamsInstance1.getEc2Instance());

            float redshiftPool = getActuatorMetricResponse(actuatorConnectionsActiveBaseUrl + "?tag=pool:redshiftConnectionPool",
                awsAlbRequestParams);
            databaseConnectionPool.setRedshiftInlineConnectionPool(redshiftPool);
            save(databaseConnectionPool, awsAlbDbPoolRequestParamsInstance1.getEc2Instance());

        } catch (Exception ex) {
            log.error("DatabasePoolService ERROR: " + ex.getMessage());
            dbPoolUsageHistory.add(
                new DatabaseConnectionPool(0, 0, 0,0,0,0, 0, DateTimeUtils.now()));
        }
    }

    private float getActuatorMetricResponse(String uri ,AwsAlbRequestParams awsAlbRequestParams ) {
        HttpEntity httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
        ResponseEntity<ActuatorMetricResponse> response = restTemplate
            .exchange(uri, HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
        String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
        awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
        awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());
        return Float.parseFloat(response.getBody().getMeasurements()[0].getValue());
    }



    private void save(DatabaseConnectionPool databaseConnectionPool, Ec2Instance ec2Instance) {
        JvmMeasurement activeConnections = new JvmMeasurement();
        activeConnections.setEc2Instance(ec2Instance.getEc2InstanceId());
        activeConnections.setMeasurementType(MeasurementType.ActiveConnections.getMeasurementType());
        activeConnections.setValue((long)databaseConnectionPool.getActiveConnections());
        activeConnections.setMeasurementDate(DateTimeUtils.now(databaseConnectionPool.getDate()));
        jvmMeasurementRepository.save(activeConnections);

        JvmMeasurement jpaPool = new JvmMeasurement();
        jpaPool.setEc2Instance(ec2Instance.getEc2InstanceId());
        jpaPool.setMeasurementType(MeasurementType.JpaConnectionPool.getMeasurementType());
        jpaPool.setValue((long)databaseConnectionPool.getJpaConnectionPool());
        jpaPool.setMeasurementDate(DateTimeUtils.now(databaseConnectionPool.getDate()));
        jvmMeasurementRepository.save(jpaPool);

        JvmMeasurement redshiftPool = new JvmMeasurement();
        redshiftPool.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftPool.setMeasurementType(MeasurementType.RedshiftWetConnectionPool.getMeasurementType());
        redshiftPool.setValue((long)databaseConnectionPool.getRedshiftWetConnectionPool());
        redshiftPool.setMeasurementDate(DateTimeUtils.now(databaseConnectionPool.getDate()));
        jvmMeasurementRepository.save(redshiftPool);
    }

    @Scheduled(fixedDelay=1133)
    private void getConnectionPoolInfoForEc2Instance1() {
        this.getCurrentActuatorMeasurementForDatabasePool(awsAlbDbPoolRequestParamsInstance1, dbPoolUsageHistory1);
    }

    @Scheduled(fixedDelay=3295)
    private void getConnectionPoolInfoForEc2Instance2() {
        this.getCurrentActuatorMeasurementForDatabasePool(awsAlbDbPoolRequestParamsInstance2, dbPoolUsageHistory2);
    }
}