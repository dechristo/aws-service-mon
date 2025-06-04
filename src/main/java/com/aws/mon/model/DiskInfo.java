package com.aws.mon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiskInfo {
    private BigInteger freeSpace;
    private BigInteger totalSpace;
}