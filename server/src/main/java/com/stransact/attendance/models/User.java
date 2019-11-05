package com.stransact.attendance.models;

import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotEmpty;

import java.io.Serializable;
import java.util.Set;

/**
 * The type User.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "users")
@Where(clause = "deleted_at is null")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotEmpty(message = "FIRST_NAME_INVALID")
    @NotNull(message = "FIRST_NAME_INVALID")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotEmpty(message = "LAST_NAME_INVALID")
    @NotNull(message = "LAST_NAME_INVALID")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotEmpty(message = "EMAIL_INVALID")
    @NotNull(message = "EMAIL_INVALID")
    @Email(message = "EMAIL_INVALID")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @NotEmpty(message = "STAFF_ID_INVALID")
    @NotNull(message = "STAFF_ID_INVALID")
    @Column(name = "staff_id", unique = true, nullable = false)
    private String staffId;

    @NotEmpty(message = "GENDER_INVALID")
    @NotNull(message = "GENDER_INVALID")
    @Column(name = "gender", nullable = false)
    private String gender;

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToOne
    @JoinColumn(name = "department_id", referencedColumnName = "id")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("departmentId")
    private Department department;

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonProperty("roleIds")
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false))
    private Set<Role> roles;

    /**
     * Gets id.
     *
     * @return the id
     */
    public long getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Gets first name.
     *
     * @return the first name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets first name.
     *
     * @param firstName the first name
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName.trim();
    }

    /**
     * Gets last name.
     *
     * @return the last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets last name.
     *
     * @param lastName the last name
     */
    public void setLastName(String lastName) {
        this.lastName = lastName.trim();
    }

    /**
     * Gets email.
     *
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets email.
     *
     * @param email the email
     */
    public void setEmail(String email) {
        this.email = email.trim();
    }

    /**
     * gets password
     *
     * @return the password
     */
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    /**
     * sets password
     *
     * @param password the password
     */
    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets staffId.
     *
     * @return the staffId
     */
    public String getStaffId() {
        return staffId;
    }

    /**
     * Sets staffId.
     *
     * @param staffId the staffId
     */
    public void setStaffId(String staffId) {
        this.staffId = staffId.trim();
    }

    /**
     * Gets gender.
     *
     * @return the gender
     */
    public String getGender() {
        return gender;
    }

    /**
     * Sets gender.
     *
     * @param gender the gender
     */
    public void setGender(String gender) {
        this.gender = gender.trim();
    }

    /**
     * Gets Department
     *
     * @return department the department
     */
    public Department getDepartment() {
        return department;
    }

    /**
     * Sets department
     *
     * @param id the department
     */
    public void setDepartment(Long id) {
        this.department = Department.fromId(id);
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public boolean hasRole(String auth) {
        for (Role role : roles) {
            if (role.getName().equals(auth)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", staffId='" + staffId + '\'' +
                ", gender='" + gender + '\'' +
                ", departmentId=" + department.getId() +
                ", createdAt=" + createdAt +
                ", createdBy=" + createdBy + '\'' +
                ", updatedAt=" + updatedAt +
                ", updatedBy=" + updatedBy + '\'' +
                '}';
    }
}