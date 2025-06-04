package com.aws.mon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JvmThreadMeasurement {
    private BigInteger liveThreads;
    private String date;
}

