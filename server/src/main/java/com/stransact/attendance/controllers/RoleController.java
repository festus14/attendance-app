package com.stransact.attendance.controllers;

import com.stransact.attendance.exceptions.AlreadyExistsException;
import com.stransact.attendance.exceptions.ResourceNotFoundException;
import com.stransact.attendance.exceptions.UnauthorizedException;
import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.Role;
import com.stransact.attendance.models.SuccessResponse;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.RoleRepository;
import com.stransact.attendance.security.AuthorizationMiddleware;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * The type Role controller.
 *
 * @author Dagogo Hart Moore
 */
@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {
    public RoleController(RoleRepository roleRepository, AuthorizationMiddleware authorizationMiddleware) {
        this.roleRepository = roleRepository;
        this.authorizationMiddleware = authorizationMiddleware;
    }

    private final RoleRepository roleRepository;
    private final AuthorizationMiddleware authorizationMiddleware;

    private final String endPoint = "roles";
    private final String noAccessError = "NO_ACCESS";

    /**
     * Get all roles list.
     *
     * @return the list
     */
    @GetMapping("/")
    public ResponseEntity<SuccessResponse> getAllRoles() {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("roles", roleRepository.findAll());
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Gets roles by id.
     *
     * @param roleId the role id
     * @return the roles by id
     * @throws ResourceNotFoundException the resource not found exception
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse> getRoleById(@PathVariable(value = "id") Long roleId)
            throws ResourceNotFoundException {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));

        Map<String, Object> data = new HashMap<>();
        data.put("role", role);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Create role role.
     *
     * @param role the role
     * @return the role
     */
    @PostMapping("/*")
    public ResponseEntity<SuccessResponse> createRole(@Valid @RequestBody Role role) throws AlreadyExistsException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        if (roleRepository.findByName(role.getName()) != null) {
            throw new AlreadyExistsException("ROLE_ALREADY_EXISTS");
        }

        final Role updatedRole = roleRepository.save(role);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("role", updatedRole);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Update role response entity.
     *
     * @param roleId      the role id
     * @param roleDetails the role details
     * @return the response entity
     * @throws ResourceNotFoundException the resource not found exception
     */
    @PatchMapping("/{id}")
    public ResponseEntity<SuccessResponse> updateRole(
            @PathVariable(value = "id") Long roleId, @Valid @RequestBody Role roleDetails)
            throws ResourceNotFoundException, AlreadyExistsException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));
        Role checkRole = roleRepository.findByName(roleDetails.getName());

        if (checkRole != null && role != checkRole) {
            throw new AlreadyExistsException("ROLE_NAME_ALREADY_EXISTS");
        }

        role.setName(roleDetails.getName());
        final Role updatedRole = roleRepository.save(role);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("role", updatedRole);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Soft Delete role map.
     *
     * @param roleId the role id
     * @return the map
     * @throws Exception the exception
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse> deleteRole(@PathVariable(value = "id") Long roleId) throws Exception {
        if (!authorizationMiddleware.isAuthorized(endPoint, "DELETE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));

        role.setDeletedAt(new Date());
        roleRepository.save(role);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", true);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Restore role map.
     *
     * @param roleId the role id
     * @return the map
     * @throws ResourceNotFoundException the exception
     */
    @PutMapping("/restore/{id}")
    public ResponseEntity<SuccessResponse> restoreRole(@PathVariable(value = "id") Long roleId) throws ResourceNotFoundException, ValidationException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Role role = roleRepository.findDeletedById(roleId);

        if (role == null) throw new ResourceNotFoundException("DEPARTMENT_NOT_FOUND");

        if (role.getDeletedAt() == null) throw new ValidationException("DEPARTMENT_NOT_DELETED");
        role.setDeletedAt(null);
        roleRepository.save(role);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("restored", true);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Delete role map.
     *
     * @param roleId the role id
     * @return the map
     * @throws Exception the exception
     */
    @DeleteMapping("/hard/{id}")
    public ResponseEntity<SuccessResponse> hardDeleteRole(@PathVariable(value = "id") Long roleId) throws Exception {
        if (!authorizationMiddleware.isAuthorized(endPoint, "DELETE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));

        roleRepository.delete(role);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", true);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    private Role validateUser(String privilege, long id) throws ResourceNotFoundException, UnauthorizedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();

        Role role = roleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));
        if (!authUser.hasRole(role.getName()) && !authorizationMiddleware.isAuthorized(endPoint, privilege + "_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        return role;
    }
}