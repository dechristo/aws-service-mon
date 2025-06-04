package com.aws.mon.repository;

import com.aws.mon.entity.JvmMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JvmMeasurementRepository extends JpaRepository<JvmMeasurement, Long> {
}
