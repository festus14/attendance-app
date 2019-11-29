package com.stransact.attendance.repository;

import com.stransact.attendance.models.TimeLog;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * The interface User repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findTimeLogsByUserId(long id, Sort sort);
    List<TimeLog> findTimeLogByCreatedAtAfterAndCreatedAtBefore(Date from, Date to);
    List<TimeLog> findTimeLogByCreatedAtAfterAndCreatedAtBeforeAndUserId(Date from, Date to, Long id, Sort sort);
}