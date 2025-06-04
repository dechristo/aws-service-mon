package com.aws.mon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessInfo {
    private double startTimeAppInstance1;
    private double startTimeAppInstance2;
}
