package com.stransact.attendance.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

/**
 * The type Role.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "roles")
@Where(clause = "deleted_at is null")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
public class Role extends Auditable<String> implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "NAME_INVALID")
    @NotEmpty(message = "NAME_INVALID")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "roles")
    private Set<User> users;

    @JsonIgnore
    @OneToMany(mappedBy = "role", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<RolesPermissions> rolesPermissions;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<RolesPermissions> getRolesPermissions() {
        return rolesPermissions;
    }

    public void setRolesPermissions(Set<RolesPermissions> rolesPermissions) {
        this.rolesPermissions = rolesPermissions;
    }

    public Set<PermissionPrivilege> getPermissionsAndPrivileges() {
        Set<PermissionPrivilege> permissionPrivileges = new HashSet<>();
        for (RolesPermissions rolesPermission : this.rolesPermissions) {
            permissionPrivileges.add(new PermissionPrivilege(rolesPermission.getPermission().getName(), rolesPermission.getPrivilege().getName()));
        }
        return permissionPrivileges;
    }

    public static Set<Role> fromIds(Set<Long> ids) {
        Set<Role> roles = new HashSet<>();
        for (long id : ids) {
            Role role = new Role();
            role.id = id;
            roles.add(role);
        }

        return roles;
    }

    public static Role fromId(long id) {
        Role role = new Role();
        role.id = id;
        return role;
    }

    @Override
    public String getAuthority() {
        return name;
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", createdAt=" + createdAt +
                ", createdBy=" + createdBy + '\'' +
                ", updatedAt=" + updatedAt +
                ", updatedBy=" + updatedBy + '\'' +
                '}';
    }
}
