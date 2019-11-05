package com.stransact.attendance.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

/**
 * The type Department.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "departments")
@Where(clause = "deleted_at is null")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Department extends Auditable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "NAME_INVALID")
    @NotEmpty(message = "NAME_INVALID")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

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

    static Set<Department> fromIds(Set<Long> ids) {
        Set<Department> departments = new HashSet<>();
        for (long id : ids) {
            departments.add(Department.fromId(id));
        }

        return departments;
    }

    static Department fromId(long id) {
        Department department = new Department();
        department.id = id;
        return department;
    }

    @Override
    public String toString() {
        return "Department{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", createdAt=" + createdAt +
                ", createdBy=" + createdBy + '\'' +
                ", updatedAt=" + updatedAt +
                ", updatedBy=" + updatedBy + '\'' +
                '}';
    }
}
