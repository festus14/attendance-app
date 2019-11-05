package com.stransact.attendance.services;

import com.stransact.attendance.models.Role;
import com.stransact.attendance.models.RolesPermissions;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.*;

/**
 * The type User details service
 *
 * @author moore.dagogohart
 */
public class MyUserDetailsService implements UserDetailsService {
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private final UserRepository userRepository;

    /**
     * @param email
     * @return
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), true, true, true,
                true, getAuthorities(user.getRoles()));
    }

    private Set<? extends GrantedAuthority> getAuthorities(Set<Role> roles) {
        return getGrantedAuthorities(getPrivileges(roles));
    }

    /**
     * @param roles
     * @return privileges
     */
    private Set<String> getPrivileges(Set<Role> roles) {
        Set<String> privileges = new HashSet<>();
        Set<RolesPermissions> collection = new HashSet<>();
        for (Role role : roles) {
            collection.addAll(role.getRolesPermissions());
        }
        for (RolesPermissions item : collection) {
            privileges.add(item.getPermission().getName());
        }
        return privileges;
    }

    /**
     *
     * @param permissions gets permissions of user
     * @return granted authorities
     */
    private Set<GrantedAuthority> getGrantedAuthorities(Set<String> permissions) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        for (String privilege : permissions) {
            authorities.add(new SimpleGrantedAuthority(privilege));
        }
        return authorities;
    }
}
