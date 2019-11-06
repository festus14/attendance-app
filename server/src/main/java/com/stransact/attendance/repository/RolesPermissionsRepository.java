package com.stransact.attendance.repository;

import com.stransact.attendance.models.RolesPermissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * The interface Role repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface RolesPermissionsRepository extends JpaRepository<RolesPermissions, Long> {
    RolesPermissions findByRoleIdAndPermissionNameAndPrivilegeName(long roleId, String permissionName, String privilegeName);
}
