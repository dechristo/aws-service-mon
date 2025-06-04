package com.aws.mon.enums;

public enum MeasurementType {
    UsedMemory("usedMemory"),
    LiveThreads("liveThreads"),
    ActiveConnections("activeConnections"),
    TimeoutConnections("timeoutConnections"),
    PdwhConnectionPool("pdwhConnectionPool"),
    JpaConnectionPool("jpaConnectionPool"),
    NeoConnectionPool("neoConnectionPool"),
    RedshiftWetConnectionPool("redshiftWetConnectionPool"),
    RedshiftInlineConnectionPool("redshiftInlineConnectionPool"),
    TaskExecutorActive("taskExecutorActive"),
    TaskExecutorQueued("taskExecutorQueued"),
    TaskExecutorQueuedRedshiftWet("taskExecutorQueuedRedshiftWet"),
    TaskExecutorActiveRedshiftWet("taskExecutorActiveRedshiftWet"),
    TaskExecutorQueuedRedshiftInline("taskExecutorQueuedRedshiftInline"),
    TaskExecutorActiveRedshiftSort("taskExecutorActiveRedshiftSort"),
    TaskExecutorQueuedRedshiftSort("taskExecutorQueuedRedshiftSort"),
    TaskExecutorActiveCfm("taskExecutorActiveCfm"),
    TaskExecutorQueuedCfm("taskExecutorQueuedCfm"),
    TaskExecutorActiveRedshiftInline("taskExecutorActiveRedshiftInline"),
    TaskExecutorActiveFetcher("taskExecutorActiveFetcher"),
    TaskExecutorActiveAsyncRestController("taskExecutorActiveAsyncRestController"),
    TomcatActiveSessions("tomcatActiveSessions"),
    InstanceHealth("instanceHealth");
    private String measurementType;

    MeasurementType(String measurementType) {
        this.measurementType = measurementType;
    }

    public String getMeasurementType() {
        return measurementType;
    }
}
