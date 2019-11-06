package com.stransact.attendance.config;

import com.stransact.attendance.models.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * The type Auditor Aware Implementation
 *
 * @author moore.dagogohart
 */
public class AuditorAwareImpl implements AuditorAware<String> {

    /**
     * @return auditor name
     */
    @Override
    public Optional<String> getCurrentAuditor() {
        // Can use Spring Security to return currently logged in user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.of("guest");
        }
        User user = (User) authentication.getPrincipal();
        return Optional.of((user.getEmail()));
    }
}
