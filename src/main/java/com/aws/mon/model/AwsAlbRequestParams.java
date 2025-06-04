package com.aws.mon.model;

import com.aws.mon.enums.Ec2Instance;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;

@Data
@NoArgsConstructor
public class AwsAlbRequestParams {
    private Ec2Instance ec2Instance;
    private String awsAlbCookie;
    private HttpHeaders headers;

    public AwsAlbRequestParams(Ec2Instance ec2Instance, HttpHeaders authHeader) {
        this.ec2Instance = ec2Instance;
        this.headers = new HttpHeaders(authHeader);
    }
}
