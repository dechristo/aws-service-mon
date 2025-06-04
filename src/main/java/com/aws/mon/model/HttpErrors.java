package com.aws.mon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HttpErrors {

    private int total5xx = 0;
    private int total4xx = 0;
}
