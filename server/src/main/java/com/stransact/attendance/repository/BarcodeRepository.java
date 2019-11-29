package com.stransact.attendance.repository;

import com.stransact.attendance.models.Barcode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * The interface User repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface BarcodeRepository extends JpaRepository<Barcode, Long> {
    @Query(value = "SELECT * FROM barcodes WHERE id = :id", nativeQuery = true)
    Barcode findDeletedById(@Param("id") long id);
}