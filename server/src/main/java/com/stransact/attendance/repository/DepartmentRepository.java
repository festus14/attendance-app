package com.stransact.attendance.repository;

import com.stransact.attendance.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface Department repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    @Query(value = "SELECT * FROM departments WHERE id = :id", nativeQuery = true)
    Department findDeletedById(@Param("id") long id);

    @Query(value = "SELECT * FROM tests WHERE name = :name", nativeQuery = true)
    Department findDeletedByName(@Param("name") String name);

    Department findByName(String name);
}