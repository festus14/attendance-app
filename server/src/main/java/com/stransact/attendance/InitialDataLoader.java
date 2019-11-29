package com.stransact.attendance;

import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.*;
import com.stransact.attendance.repository.*;
import com.stransact.attendance.services.Utils;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.transaction.Transactional;
import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
 * The type Initial data loader
 *
 * @author moore.dagogohart
 */
@Component
public class InitialDataLoader implements ApplicationListener<ApplicationReadyEvent> {
    public InitialDataLoader(UserRepository userRepository, BarcodeRepository barcodeRepository, RoleRepository roleRepository, PrivilegeRepository privilegeRepository, DepartmentRepository departmentRepository, PermissionRepository permissionRepository, RolesPermissionsRepository rolesPermissionsRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.privilegeRepository = privilegeRepository;
        this.departmentRepository = departmentRepository;
        this.permissionRepository = permissionRepository;
        this.rolesPermissionsRepository = rolesPermissionsRepository;
        this.passwordEncoder = passwordEncoder;
        this.barcodeRepository = barcodeRepository;
    }

    private boolean alreadySetup = false;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BarcodeRepository barcodeRepository;
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
        Permission barcodesPermission = createPermissionIfNotFound("barcodes");
        Permission logsPermission = createPermissionIfNotFound("logs");
        Permission rolePermission = createPermissionIfNotFound("roles");
        Permission permissionPermission = createPermissionIfNotFound("permissions");
        Permission privilegePermission = createPermissionIfNotFound("privileges");

        Role employeeRole = createRoleIfNotFound("ROLE_EMPLOYEE");
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN");
        Role generatorRole = createRoleIfNotFound("ROLE_GENERATOR");

//        Admin has access to all
        Set<Privilege> adminPrivileges = new HashSet<>(Arrays.asList(readAnyPrivilege, readOwnPrivilege, writeAnyPrivilege, writeOwnPrivilege, deleteAnyPrivilege, deleteOwnPrivilege));
        Set<Permission> adminPermissions = new HashSet<>(Arrays.asList(usersPermission, departmentPermission,
                barcodesPermission, rolePermission, permissionPermission, privilegePermission, logsPermission));
        for (Privilege privilege : adminPrivileges) {
            for (Permission permission : adminPermissions) {
                createRolePermissionsIfNotFound(privilege, permission, adminRole);
            }
        }

//        employee has controlled access
        Set<Permission> employeePermissions = new HashSet<>(Arrays.asList(usersPermission, departmentPermission,
                barcodesPermission, rolePermission, permissionPermission, privilegePermission, logsPermission));
        for (Permission permission : employeePermissions) {
            createRolePermissionsIfNotFound(readOwnPrivilege, permission, employeeRole);
        }

        Set<Privilege> generatorPrivileges = new HashSet<>(Arrays.asList(readAnyPrivilege, writeAnyPrivilege));
        Set<Permission> generatorPermissions = new HashSet<>(Arrays.asList(usersPermission, departmentPermission, rolePermission, permissionPermission, privilegePermission, logsPermission));
        for (Permission permission : generatorPermissions) {
            createRolePermissionsIfNotFound(readOwnPrivilege, permission, generatorRole);
        }

        for (Privilege privilege : generatorPrivileges) {
            createRolePermissionsIfNotFound(privilege, barcodesPermission, generatorRole);
        }

        Department financeDept = createDepartmentIfNotFound("finance");
        Department adminDept = createDepartmentIfNotFound("admin");
        Department itDept = createDepartmentIfNotFound("IT");
        Department barcodeDept = createDepartmentIfNotFound("barcode");

        createUserIfNotFound("admin@stransact.com", "Admin", "Admin", "1", new HashSet<>(Arrays.asList(adminRole, employeeRole)), adminDept);
        createUserIfNotFound("generator@stransact.com", "Barcode", "Generator", "2", new HashSet<>(Arrays.asList(generatorRole, employeeRole)), barcodeDept);
        createUserIfNotFound("demo@stransact.com", "Demo", "Demo", "3", new HashSet<>(Collections.singleton(employeeRole)), itDept);
        createBarcodeIfNotFound();
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

    @Transactional
    protected Barcode createBarcodeIfNotFound() {
        try {
            List<Barcode> barcodes = barcodeRepository.findAll(Sort.by(Sort.Direction.ASC, "createdAt"));
            if (barcodes.size() == 0) {
                String barString = Utils.hashString(String.valueOf((new Date()).getTime()));

                Barcode barcode = new Barcode();
                barcode.setBarString(barString);
                barcodes.add(barcodeRepository.save(barcode));
            }

            return barcodes.get(barcodes.size() - 1);
        } catch (NoSuchAlgorithmException ex) {
            return null;
        }
    }

    @Transactional
    protected RolesPermissions createRolePermissionsIfNotFound(Privilege privilege, Permission permission, Role role) {
        RolesPermissions rolesPermissions = rolesPermissionsRepository.findByRoleIdAndPermissionNameAndPrivilegeName(role.getId(), permission.getName(), privilege.getName());
        if (rolesPermissions == null) {
            rolesPermissions = new RolesPermissions();
            rolesPermissions.setPermission(permission);
            rolesPermissions.setPrivilege(privilege);
            rolesPermissions.setRole(role);
            rolesPermissions = rolesPermissionsRepository.save(rolesPermissions);
        }
        return rolesPermissions;
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
    protected User createUserIfNotFound(String email, String firstName, String lastName, String staffId, Set<Role> roles, Department dept) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword(passwordEncoder.encode("testpassword"));
            user.setEmail(email);
            user.setGender("male");
            user.setStaffId(staffId);
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
