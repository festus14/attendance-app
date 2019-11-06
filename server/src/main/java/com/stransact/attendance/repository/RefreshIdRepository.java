package com.stransact.attendance.repository;

import com.stransact.attendance.models.RefreshId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Date;

/**
 * The interface Resource repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface RefreshIdRepository extends JpaRepository<RefreshId, Long> {
    RefreshId findByRefreshId(String refreshId);

    @Transactional
    @Modifying
    @Query(value = "delete from RefreshId refresh where refresh.expiry < :date")
    void deleteAllByExpiryIsBefore(@Param("date") Date now);

    RefreshId findByRefreshIdAndUserEmail(String refreshId, String email);
}