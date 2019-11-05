package com.stransact.attendance.repository;

import com.stransact.attendance.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface Role repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    @Query(value = "SELECT * FROM roles WHERE id = :id", nativeQuery = true)
    Role findDeletedById(@Param("id") long id);

    @Query(value = "SELECT * FROM question_choices WHERE name = :name", nativeQuery = true)
    Role findDeletedByName(@Param("name") String name);

    Role findByName(String name);

    List<Role> findRolesByUsersId(long id);
}
