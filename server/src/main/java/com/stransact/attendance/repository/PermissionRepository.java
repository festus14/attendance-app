package com.stransact.attendance.repository;

import com.stransact.attendance.models.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * The interface Role repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Permission findByName(String name);
}
