package com.stransact.attendance.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

/**
 * The type Roles Permission.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "roles_permissions")
@Where(clause = "deleted_at is null")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
public class RolesPermissions extends Auditable<String> {

    @EmbeddedId
    private RolesPermissionsId id = new RolesPermissionsId();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @MapsId("role_id")
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role = new Role();

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @MapsId("permission_id")
    @JoinColumn(name = "permission_id", referencedColumnName = "id")
    private Permission permission = new Permission();

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @MapsId("privilege_id")
    @JoinColumn(name = "privilege_id", referencedColumnName = "id")
    private Privilege privilege = new Privilege();

    public RolesPermissions() {
        id.setRoleId(role.getId());
        id.setPrivilegeId(privilege.getId());
        id.setPermissionId(permission.getId());
    }

    public RolesPermissionsId getId() {
        return id;
    }

    public void setId(RolesPermissionsId id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
        this.id.setRoleId(role.getId());
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
        this.id.setPermissionId(permission.getId());
    }

    public Privilege getPrivilege() {
        return privilege;
    }

    public void setPrivilege(Privilege privilege) {
        this.privilege = privilege;
        this.id.setPrivilegeId(privilege.getId());
    }
}
