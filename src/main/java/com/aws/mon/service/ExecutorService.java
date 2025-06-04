package com.aws.mon.service;

import com.aws.mon.entity.JvmMeasurement;
import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.ExecutorTask;
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
public class ExecutorService {
    private final String actuatorExecutorTasksUrl = "/actuator/metrics/executor";
    private final List<ExecutorTask> executorTasksHistoryInstance1 = new ArrayList<ExecutorTask>();
    private final List<ExecutorTask> executorTasksHistoryInstance2 = new ArrayList<ExecutorTask>();
    private AwsAlbRequestParams awsAlbExecutorRequestParamsInstance1;
    private AwsAlbRequestParams awsAlbExecutorRequestParamsInstance2;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;

    @Autowired
    private JvmMeasurementRepository jvmMeasurementRepository;

    public List<ExecutorTask> getExecutorHistoryByInstanceId(int instanceId) {
        if (instanceId == 1) return this.executorTasksHistoryInstance1;
        if (instanceId == 2) return this.executorTasksHistoryInstance2;
        return List.of();
    }

    public ExecutorTask getExecutorTasksForEc2Instance1() {
        if (executorTasksHistoryInstance1.isEmpty()){
            return new ExecutorTask();
        }

        return executorTasksHistoryInstance1.get(executorTasksHistoryInstance1.size()-1);
    }

    public ExecutorTask getExecutorTasksForEc2Instance2() {
        if (executorTasksHistoryInstance2.isEmpty()){
            return new ExecutorTask();
        }

        return executorTasksHistoryInstance2.get(executorTasksHistoryInstance2.size()-1);
    }

    @PostConstruct
    private void init() {
        this.awsAlbExecutorRequestParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1,
            httpUtils.initializeHeaderWithBasicAuth());

        this.awsAlbExecutorRequestParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2,
            httpUtils.initializeHeaderWithBasicAuth());
    }

    private void getCurrentEc2InstanceExecutorInfo(
        AwsAlbRequestParams awsAlbRequestParams,
        List<ExecutorTask> executorTaskHistory) {

        log.info("Acquiring Executor Pool data.");
        try {
            ExecutorTask executorTask = new ExecutorTask();

            HttpEntity httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());

            ResponseEntity<ActuatorMetricResponse> response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            String awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActive(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".queued",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setQueued(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".queued?tag=name:data-redshift-wet",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setQueuedRedshiftWet(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active?tag=name:data-redshift-wet",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActiveRedshiftWet(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".queued?tag=name:data-redshift-inline",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setQueuedRedshiftInline(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".queued?tag=name:data-redshift-wet",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setQueuedRedshiftWet(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active?tag=name:data-redshift-sort",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActiveRedshiftSort(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".queued?tag=name:data-redshift-sort",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setQueuedRedshiftSort(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active?tag=name:data-cfm",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActiveCfm(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".queued?tag=name:data-cfm",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setQueuedCfm(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());


            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active?tag=name:data-redshift-inline",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActiveRedshiftInline(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active?tag=name:fetcher",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActiveFetcher(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            httpEntity = new HttpEntity(awsAlbRequestParams.getHeaders());
            response = restTemplate
                .exchange(actuatorExecutorTasksUrl + ".active?tag=name:asyncRestController",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            awsAlbCookie = response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0];
            awsAlbRequestParams.setAwsAlbCookie(awsAlbCookie);
            executorTask.setActiveAsyncRestController(Float.parseFloat(response.getBody().getMeasurements()[0].getValue()));
            awsAlbRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbRequestParams.getAwsAlbCookie());

            executorTask.setDate(DateTimeUtils.now());
            executorTaskHistory.add(executorTask);
            printAcquiredData(awsAlbRequestParams, executorTask);
            this.save(executorTask, awsAlbRequestParams.getEc2Instance());
        } catch(Exception ex) {
            log.error("ExecutorService ERROR:" + ex.getMessage());
            executorTaskHistory.add(new ExecutorTask());
        }
    }

    private void printAcquiredData(AwsAlbRequestParams awsAlbRequestParams, ExecutorTask executorTask) {
        log.info("-----> EC2: " + awsAlbRequestParams.getEc2Instance());
        log.info("-----> Active: " + executorTask.getActive() );
        log.info("-----> Queued: " + executorTask.getQueued());
    }

    private void save(ExecutorTask executorTask, Ec2Instance ec2Instance) {
        JvmMeasurement executorActive = new JvmMeasurement();
        executorActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        executorActive.setValue((long)executorTask.getActive());
        executorActive.setMeasurementType(MeasurementType.TaskExecutorActive.getMeasurementType());
        executorActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(executorActive);

        JvmMeasurement executorQueued = new JvmMeasurement();
        executorQueued.setEc2Instance(ec2Instance.getEc2InstanceId());
        executorQueued.setValue((long) executorTask.getQueued());
        executorQueued.setMeasurementType(MeasurementType.TaskExecutorQueued.getMeasurementType());
        executorQueued.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(executorActive);

        JvmMeasurement redshiftWetQueued = new JvmMeasurement();
        redshiftWetQueued.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftWetQueued.setValue((long)executorTask.getQueuedRedshiftWet());
        redshiftWetQueued.setMeasurementType(MeasurementType.TaskExecutorQueuedRedshiftWet.getMeasurementType());
        redshiftWetQueued.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(redshiftWetQueued);

        JvmMeasurement redshiftWetActive = new JvmMeasurement();
        redshiftWetActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftWetActive.setValue((long)executorTask.getActiveRedshiftWet());
        redshiftWetActive.setMeasurementType(MeasurementType.TaskExecutorActiveRedshiftWet.getMeasurementType());
        redshiftWetActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(redshiftWetActive);

        JvmMeasurement redshiftSortQueued = new JvmMeasurement();
        redshiftWetQueued.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftWetQueued.setValue((long)executorTask.getQueuedRedshiftSort());
        redshiftWetQueued.setMeasurementType(MeasurementType.TaskExecutorQueuedRedshiftSort.getMeasurementType());
        redshiftWetQueued.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(redshiftSortQueued);

        JvmMeasurement redshiftSortActive = new JvmMeasurement();
        redshiftWetActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftWetActive.setValue((long)executorTask.getActiveRedshiftSort());
        redshiftWetActive.setMeasurementType(MeasurementType.TaskExecutorActiveRedshiftSort.getMeasurementType());
        redshiftWetActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(redshiftSortActive);

        JvmMeasurement cfmQueued = new JvmMeasurement();
        redshiftWetQueued.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftWetQueued.setValue((long)executorTask.getQueuedCfm());
        redshiftWetQueued.setMeasurementType(MeasurementType.TaskExecutorQueuedCfm.getMeasurementType());
        redshiftWetQueued.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(cfmQueued);

        JvmMeasurement cfmActive = new JvmMeasurement();
        redshiftWetActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftWetActive.setValue((long)executorTask.getActiveCfm());
        redshiftWetActive.setMeasurementType(MeasurementType.TaskExecutorActiveCfm.getMeasurementType());
        redshiftWetActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(cfmActive);

        JvmMeasurement redshiftInlineQueued = new JvmMeasurement();
        redshiftInlineQueued.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftInlineQueued.setValue((long)executorTask.getQueuedRedshiftInline());
        redshiftInlineQueued.setMeasurementType(MeasurementType.TaskExecutorQueuedRedshiftInline.getMeasurementType());
        redshiftInlineQueued.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(redshiftInlineQueued);

        JvmMeasurement redshiftInlineActive = new JvmMeasurement();
        redshiftInlineActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        redshiftInlineActive.setValue((long)executorTask.getActiveRedshiftInline());
        redshiftInlineActive.setMeasurementType(MeasurementType.TaskExecutorActiveRedshiftInline.getMeasurementType());
        redshiftInlineActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(redshiftInlineActive);

        JvmMeasurement fetcherActive = new JvmMeasurement();
        fetcherActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        fetcherActive.setValue((long)executorTask.getActiveFetcher());
        fetcherActive.setMeasurementType(MeasurementType.TaskExecutorActiveFetcher.getMeasurementType());
        fetcherActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(fetcherActive);

        JvmMeasurement asyncRestControllerActive = new JvmMeasurement();
        asyncRestControllerActive.setEc2Instance(ec2Instance.getEc2InstanceId());
        asyncRestControllerActive.setValue((long)executorTask.getActiveAsyncRestController());
        asyncRestControllerActive.setMeasurementType(MeasurementType.TaskExecutorActiveAsyncRestController.getMeasurementType());
        asyncRestControllerActive.setMeasurementDate(DateTimeUtils.now(executorTask.getDate()));
        jvmMeasurementRepository.save(asyncRestControllerActive);
    }

    @Scheduled(fixedDelay=1335)
    private void getExecutorInfoInstance1() {
        this.getCurrentEc2InstanceExecutorInfo(
            awsAlbExecutorRequestParamsInstance1, executorTasksHistoryInstance1);
    }

    @Scheduled(fixedDelay=3333)
    private void getExecutorInfoInstance2() {
        this.getCurrentEc2InstanceExecutorInfo(
            awsAlbExecutorRequestParamsInstance2, executorTasksHistoryInstance2);
    }
}
