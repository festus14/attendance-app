package com.stransact.attendance;

import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.*;
import com.stransact.attendance.repository.*;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.transaction.Transactional;
import java.util.*;

/**
 * The type Initial data loader
 *
 * @author moore.dagogohart
 */
@Component
public class InitialDataLoader implements ApplicationListener<ApplicationReadyEvent> {
    public InitialDataLoader(UserRepository userRepository, RoleRepository roleRepository, PrivilegeRepository privilegeRepository, DepartmentRepository departmentRepository, PermissionRepository permissionRepository, RolesPermissionsRepository rolesPermissionsRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.privilegeRepository = privilegeRepository;
        this.departmentRepository = departmentRepository;
        this.permissionRepository = permissionRepository;
        this.rolesPermissionsRepository = rolesPermissionsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private boolean alreadySetup = false;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final DepartmentRepository departmentRepository;
    private final PermissionRepository permissionRepository;
    private final RolesPermissionsRepository rolesPermissionsRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * @param event event
     */
    @Override
    @ExceptionHandler(ValidationException.class)
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (alreadySetup)
            return;
//        Privileges for controllers
        Privilege readAnyPrivilege
                = createPrivilegeIfNotFound("READ_ANY_PRIVILEGE");
        Privilege readOwnPrivilege
                = createPrivilegeIfNotFound("READ_OWN_PRIVILEGE");
        Privilege writeAnyPrivilege
                = createPrivilegeIfNotFound("WRITE_ANY_PRIVILEGE");
        Privilege writeOwnPrivilege
                = createPrivilegeIfNotFound("WRITE_OWN_PRIVILEGE");
        Privilege deleteAnyPrivilege
                = createPrivilegeIfNotFound("DELETE_ANY_PRIVILEGE");
        Privilege deleteOwnPrivilege
                = createPrivilegeIfNotFound("DELETE_OWN_PRIVILEGE");

//        Permissions for controllers here
        Permission usersPermission = createPermissionIfNotFound("users");
        Permission departmentPermission = createPermissionIfNotFound("departments");
        Permission questionPermission = createPermissionIfNotFound("questions");
        Permission rolePermission = createPermissionIfNotFound("roles");
        Permission permissionPermission = createPermissionIfNotFound("permissions");
        Permission privilegePermission = createPermissionIfNotFound("privileges");

        Role employeeRole = createRoleIfNotFound("ROLE_EMPLOYEE");
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN");

//        Admin has access to all
        Set<Privilege> adminPrivileges = new HashSet<>(Arrays.asList(readAnyPrivilege, readOwnPrivilege, writeAnyPrivilege, writeOwnPrivilege, deleteAnyPrivilege, deleteOwnPrivilege));
        Set<Permission> adminPermissions = new HashSet<>(Arrays.asList(usersPermission, departmentPermission,
                questionPermission, rolePermission, permissionPermission, privilegePermission));
        for (Privilege privilege : adminPrivileges) {
            for (Permission permission : adminPermissions) {
                RolesPermissions rolesPermissions = new RolesPermissions();
                rolesPermissions.setPermission(permission);
                rolesPermissions.setPrivilege(privilege);
                rolesPermissions.setRole(adminRole);
                rolesPermissionsRepository.save(rolesPermissions);
            }
        }

//        employee has controlled access
        Set<Permission> employeePermissions = new HashSet<>(Arrays.asList(usersPermission, departmentPermission,
                questionPermission, rolePermission, permissionPermission, privilegePermission));
        for (Permission permission : employeePermissions) {
            RolesPermissions rolesPermissions = new RolesPermissions();
            rolesPermissions.setPrivilege(readOwnPrivilege);
            rolesPermissions.setPermission(permission);
            rolesPermissions.setRole(employeeRole);
            rolesPermissionsRepository.save(rolesPermissions);
        }

        Department dept = createDepartmentIfNotFound("finance");

        createUserIfNotFound(new HashSet<>(Arrays.asList(adminRole, employeeRole)), dept);
        alreadySetup = true;
    }

    /**
     *
     * @param name string
     * @return privilege
     */
    @Transactional
    protected Privilege createPrivilegeIfNotFound(String name) {

        Privilege privilege = privilegeRepository.findByName(name);
        if (privilege == null) {
            privilege = new Privilege();
            privilege.setName(name);
            privilege = privilegeRepository.save(privilege);
        }
        return privilege;
    }

    /**
     * @param name string
     * @return permission
     */
    @Transactional
    protected Permission createPermissionIfNotFound(String name) {

        Permission permission = permissionRepository.findByName(name);
        if (permission == null) {
            permission = new Permission();
            permission.setName(name);
            permission = permissionRepository.save(permission);
        }
        return permission;
    }

    /**
     *
     * @param roles set of Roles
     * @param dept department
     * @return user
     */
    @Transactional
    protected User createUserIfNotFound(Set<Role> roles, Department dept) {
        User user = userRepository.findByEmail("admin@stransact.com");
        if (user == null) {
            user = new User();
            user.setFirstName("Admin");
            user.setLastName("Admin");
            user.setPassword(passwordEncoder.encode("testpassword"));
            user.setEmail("admin@stransact.com");
            user.setGender("male");
            user.setStaffId("1");
            user.setDepartment(dept.getId());
            user.setRoles(roles);
            user = userRepository.save(user);
        }

        return user;
    }

    /**
     *
     * @param name string
     * @return department
     */
    @Transactional
    protected Department createDepartmentIfNotFound(String name) {

        Department department = departmentRepository.findByName(name);
        if (department == null) {
            department = new Department();
            department.setName(name);
            departmentRepository.save(department);
        }
        return department;
    }

    /**
     *
     * @param name string
     * @return role
     */
    @Transactional
    protected Role createRoleIfNotFound(String name) {

        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role();
            role.setName(name);
            role = roleRepository.save(role);
        }
        return role;
    }
}
