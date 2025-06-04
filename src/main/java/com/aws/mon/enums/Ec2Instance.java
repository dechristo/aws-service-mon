package com.aws.mon.enums;

public enum Ec2Instance {
    Ec2Instance1("Ec2-1"),
    Ec2Instance2("Ec2-2");
    private String instanceId;

    Ec2Instance(String instanceId) {
        this.instanceId = instanceId;
    }

    public String getEc2InstanceId() {
        return this.instanceId;
    }
}
