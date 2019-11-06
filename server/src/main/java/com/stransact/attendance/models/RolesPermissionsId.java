package com.stransact.attendance.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Type Test Progress ID
 * ID of Pivot table for users and tests
 *
 * @author moore.dagogohart
 */
@Embeddable
public class RolesPermissionsId implements Serializable {
    @Column(name = "role_id")
    private long roleId;

    @Column(name = "permission_id")
    private long permissionId;

    @Column(name = "privilege_id")
    private long privilegeId;

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(long permissionId) {
        this.permissionId = permissionId;
    }

    public long getPrivilegeId() {
        return privilegeId;
    }

    public void setPrivilegeId(long privilegeId) {
        this.privilegeId = privilegeId;
    }

    /**
     * @param o the object
     * @return boolean
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RolesPermissionsId)) return false;
        RolesPermissionsId that = (RolesPermissionsId) o;
        return getRoleId() == that.getRoleId() &&
                getPermissionId() == that.getPermissionId() &&
                getPrivilegeId() == that.getPrivilegeId();
    }

    /**
     * @return hash of three primary keys
     */
    @Override
    public int hashCode() {
        return Objects.hash(getPermissionId(), getPrivilegeId(), getRoleId());
    }
}
