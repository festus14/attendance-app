package com.stransact.attendance.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.Set;

/**
 * The type Permission.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "permissions")
@Where(clause = "deleted_at is null")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
public class Permission extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "permission", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
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

    public Set<RolesPermissions> getRolesPermissions() {
        return rolesPermissions;
    }

    public void setRolesPermissions(Set<RolesPermissions> rolesPermissions) {
        this.rolesPermissions = rolesPermissions;
    }
}
