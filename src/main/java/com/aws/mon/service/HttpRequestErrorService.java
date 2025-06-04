package com.aws.mon.service;

import com.aws.mon.model.AwsAlbRequestParams;
import com.aws.mon.model.HttpErrors;
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

import java.util.Arrays;

@Service
@Slf4j
public class HttpRequestErrorService {
    private final String actuatorHttpRequestsBaseUrl = "/actuator/metrics/http.server.requests?tag=status:";
    private HttpErrors totalHttpErrorsEc2Instance1 = new HttpErrors();
    private HttpErrors totalHttpErrorsEc2Instance2 = new HttpErrors();
    private AwsAlbRequestParams awsAlbHttpErrorsRequestParamsInstance1;
    private AwsAlbRequestParams awsAlbHttpErrorsRequestParamsInstance2;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpUtils httpUtils;

    public HttpErrors getHttpErrorsEc2Instance1() {
        return this.totalHttpErrorsEc2Instance1;
    }
    public HttpErrors getHttpErrorsEc2Instance2() {
      return this.totalHttpErrorsEc2Instance2;
    }

    @PostConstruct
    private void init() {
        this.awsAlbHttpErrorsRequestParamsInstance1 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance1, httpUtils.initializeHeaderWithBasicAuth());
        this.awsAlbHttpErrorsRequestParamsInstance2 = new AwsAlbRequestParams(
            Ec2Instance.Ec2Instance2, httpUtils.initializeHeaderWithBasicAuth());
    }

    /**
     *
     * Separated try/catch blocks are needed because the response from not found drill down (e.g.: tag=status:500)
     * throws an error because the 404 response has no body. Having only one try/catch block would not trigger
     * any subsequent requests after an error occurs.
     */
    //TODO: Call the http.server.requests actuator endpoint in order to checking the existent error codes.
    // Then re-enable 404
    private void getHttpErrors(
        HttpErrors totalHttpErrors,
        AwsAlbRequestParams awsAlbHttpErrorsRequestParams) {

        log.info("Acquiring Instances Http Errors.");
        ResponseEntity<ActuatorMetricResponse> response = null;
        int errorCount4xx = 0;
        int errorCount5xx = 0;
        HttpEntity httpEntity = new HttpEntity(awsAlbHttpErrorsRequestParams.getHeaders());

        try {
            response =
                restTemplate.exchange(actuatorHttpRequestsBaseUrl + "500",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            errorCount5xx += Float.parseFloat(Arrays.stream(response.getBody().getMeasurements())
                .filter(m -> m.getStatistic().equals("COUNT"))
                .findFirst().get().getValue());
        } catch(Exception ex) {
            log.error("HttpRequestErrorService error acquiring 500 errors:" + ex.getMessage());
        }
        setAwsAlbCookieForStickySession(awsAlbHttpErrorsRequestParams, response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0]);

        try {
                httpEntity = new HttpEntity(awsAlbHttpErrorsRequestParams.getHeaders());
            response =
                restTemplate.exchange(actuatorHttpRequestsBaseUrl + "502",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            errorCount5xx += Float.parseFloat(Arrays.stream(response.getBody().getMeasurements())
                .filter(m -> m.getStatistic().equals("COUNT"))
                .findFirst().get().getValue());
        } catch(Exception ex) {
            log.error("HttpRequestErrorService error acquiring 502 errors:" + ex.getMessage());
        }
        setAwsAlbCookieForStickySession(awsAlbHttpErrorsRequestParams, response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0]);

        try {
            response =
                restTemplate.exchange(actuatorHttpRequestsBaseUrl + "503",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            errorCount5xx += Float.parseFloat(Arrays.stream(response.getBody().getMeasurements())
                .filter(m -> m.getStatistic().equals("COUNT"))
                .findFirst().get().getValue());
        } catch(Exception ex) {
            log.error("HttpRequestErrorService error acquiring 503 errors:" + ex.getMessage());
        }
        setAwsAlbCookieForStickySession(awsAlbHttpErrorsRequestParams, response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0]);

        try {
            httpEntity = new HttpEntity(awsAlbHttpErrorsRequestParams.getHeaders());
            response =
                restTemplate.exchange(actuatorHttpRequestsBaseUrl + "400",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            errorCount4xx += Float.parseFloat(Arrays.stream(response.getBody().getMeasurements())
                .filter(m -> m.getStatistic().equals("COUNT"))
                .findFirst().get().getValue());
        } catch(Exception ex) {
            log.error("HttpRequestErrorService error acquiring 400 errors:" + ex.getMessage());
        }
        setAwsAlbCookieForStickySession(awsAlbHttpErrorsRequestParams, response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0]);

        try {
            httpEntity = new HttpEntity(awsAlbHttpErrorsRequestParams.getHeaders());
            response =
                restTemplate.exchange(actuatorHttpRequestsBaseUrl + "405",
                    HttpMethod.GET, httpEntity, ActuatorMetricResponse.class);
            errorCount4xx += Float.parseFloat(Arrays.stream(response.getBody().getMeasurements())
                .filter(m -> m.getStatistic().equals("COUNT"))
                .findFirst().get().getValue());
        } catch(Exception ex) {
            log.error("HttpRequestErrorService error acquiring 405 errors:" + ex.getMessage());
        }
        setAwsAlbCookieForStickySession(awsAlbHttpErrorsRequestParams, response.getHeaders().get(HttpHeaders.SET_COOKIE).get(0).split(";")[0]);
        totalHttpErrors.setTotal4xx(errorCount4xx);
        totalHttpErrors.setTotal5xx(errorCount5xx);
    }

    private void setAwsAlbCookieForStickySession(AwsAlbRequestParams awsAlbHttpErrorsRequestParams, String awsAlbCookie) {
        awsAlbHttpErrorsRequestParams.setAwsAlbCookie(awsAlbCookie);
        awsAlbHttpErrorsRequestParams.getHeaders().set(HttpHeaders.COOKIE, awsAlbCookie);
    }
    @Scheduled(fixedDelay=9555)
    private void getHttpErrorsForInstance1() {
        this.getHttpErrors(totalHttpErrorsEc2Instance1, awsAlbHttpErrorsRequestParamsInstance1);
    }

    @Scheduled(fixedDelay=13777)
    private void getHttpErrorsForInstance2() {
        this.getHttpErrors(totalHttpErrorsEc2Instance2, awsAlbHttpErrorsRequestParamsInstance2);
    }
}
