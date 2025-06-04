package com.aws.mon.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActuatorMetricResponse {
    String name;
    String description;
    String baseUnit;
    Measurement[] measurements;
    AvailableTags[] availableTags;
}
