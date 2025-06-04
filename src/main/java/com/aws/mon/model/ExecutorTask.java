package com.aws.mon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExecutorTask {
    private float active;
    private float queued;
    private float queuedRedshiftWet;
    private float activeRedshiftWet;
    private float queuedRedshiftInline;
    private float activeRedshiftInline;
    private float queuedRedshiftSort;
    private float activeRedshiftSort;
    private float queuedCfm;
    private float activeCfm;
    private float activeFetcher;
    private float activeAsyncRestController;
    private String date;
}
