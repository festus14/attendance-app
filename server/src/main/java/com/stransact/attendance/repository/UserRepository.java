package com.stransact.attendance.repository;

import com.stransact.attendance.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface User repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "SELECT * FROM users WHERE id = :id", nativeQuery = true)
    User findDeletedById(@Param("id") long id);

    @Query(value = "SELECT * FROM user WHERE email = :email", nativeQuery = true)
    User findDeletedByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM user WHERE staff_id = :staffId", nativeQuery = true)
    User findDeletedByStaffId(@Param("staffId") String staffId);

    User findByEmail(String email);

    User findByStaffId(String staffId);

    List<User> findUsersByDepartmentId(long id);

    List<User> findUsersByRolesId(long id);
}