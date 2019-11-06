package com.stransact.attendance.repository;

import com.stransact.attendance.models.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Date;

/**
 * The interface Resource repository.
 *
 * @author Dagogo Hart Moore
 */
@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {
    AccessToken findByToken(String token);

    @Transactional
    @Modifying
    @Query(value = "delete from AccessToken token where token.expiry < :date")
    void deleteAllByExpiryIsBefore(@Param("date") Date now);

    @Modifying
    @Transactional
    @Query(value = "delete from AccessToken token where token.token = :token")
    void deleteByToken(@Param("token") String token);
}