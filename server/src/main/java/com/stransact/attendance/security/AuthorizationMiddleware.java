package com.stransact.attendance.security;

import com.stransact.attendance.models.Role;
import com.stransact.attendance.models.RolesPermissions;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.RolesPermissionsRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AuthorizationMiddleware {
    public AuthorizationMiddleware(RolesPermissionsRepository rolesPermissionsRepository) {
        this.rolesPermissionsRepository = rolesPermissionsRepository;
    }

    private final RolesPermissionsRepository rolesPermissionsRepository;

    public boolean isAuthorized(String permission, String privilege) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Set<Role> roles = user.getRoles();
        for (Role role : roles) {
            RolesPermissions rolesPermissions = rolesPermissionsRepository.findByRoleIdAndPermissionNameAndPrivilegeName(role.getId(), permission, privilege);
            if (rolesPermissions != null) return true;
        }
        return false;
    }
}
