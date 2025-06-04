package com.aws.mon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="jvm_measurement")
public class JvmMeasurement
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "ec2_instance")
    private String ec2Instance;

    @Column(name = "measurement_type")
    private String measurementType;
    private long value;
    @Column(name ="measurement_date")
    private LocalDateTime measurementDate;
}
