package com.aws.mon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DatabaseConnectionPool {
    private float activeConnections;
    private float timeoutConnections;
    private float pdwhConnectionPool;
    private float jpaConnectionPool;
    private float neoConnectionPool;
    private float redshiftWetConnectionPool;
    private float redshiftInlineConnectionPool;
    private String date;
}
