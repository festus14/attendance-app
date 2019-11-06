package com.stransact.attendance.controllers;

import com.stransact.attendance.exceptions.AlreadyExistsException;
import com.stransact.attendance.exceptions.ResourceNotFoundException;
import com.stransact.attendance.exceptions.UnauthorizedException;
import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.Department;
import com.stransact.attendance.models.Role;
import com.stransact.attendance.models.SuccessResponse;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.DepartmentRepository;
import com.stransact.attendance.repository.RoleRepository;
import com.stransact.attendance.repository.UserRepository;
import com.stransact.attendance.security.AuthorizationMiddleware;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

/**
 * The type User controller.
 *
 * @author Dagogo Hart Moore
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    public UserController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, AuthorizationMiddleware authorizationMiddleware, DepartmentRepository departmentRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorizationMiddleware = authorizationMiddleware;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
    }

    private final String endPoint = "users";
    private final String noAccessError = "NO_ACCESS";
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthorizationMiddleware authorizationMiddleware;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;

    /**
     * Get all users list.
     *
     * @return the list
     */
    @GetMapping("/")
    public ResponseEntity<SuccessResponse> getAllUsers() throws UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("users", userRepository.findAll());
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Gets users by id.
     *
     * @param userId the user id
     * @return the users by id
     * @throws ResourceNotFoundException the resource not found exception
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse> getUsersById(@PathVariable(value = "id") Long userId)
            throws ResourceNotFoundException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_OWN_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);
        User user = validateUser("READ", userId);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", user);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Create user user.
     *
     * @param userDetails the user
     * @return the user
     * @throws AlreadyExistsException if user exists
     */
    @PostMapping("/*")
    public ResponseEntity<SuccessResponse> createUser(@RequestBody Map<String, Object> userDetails) throws ValidationException, ResourceNotFoundException, AlreadyExistsException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        User user = new User();

        String password = (String) userDetails.get("password");

        if (password == null || password.equals("")) throw new ValidationException("PASSWORD_INVALID");

        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(((String) userDetails.get("email")).toLowerCase());
        user.setStaffId(((String) userDetails.get("staffId")).toLowerCase());
        user.setFirstName((String) userDetails.get("firstName"));
        user.setLastName((String) userDetails.get("lastName"));
        user.setGender((String) userDetails.get("gender"));

        if (userRepository.findDeletedByEmail(user.getEmail().toLowerCase()) != null) {
            throw new AlreadyExistsException("EMAIL_ALREADY_EXISTS");
        }

        if (userRepository.findDeletedByStaffId(user.getStaffId().toLowerCase()) != null) {
            throw new AlreadyExistsException("STAFF_ID_ALREADY_EXISTS");
        }

        Set<Role> roles = new HashSet<>();

        if (userDetails.get("roleIds") != null && userDetails.get("roleIds") instanceof ArrayList) {
            List<Integer> rIds = (ArrayList<Integer>) userDetails.get("roleIds");
            for (Integer id : rIds) {
                Long roleId = Long.valueOf(id);

                Role r = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));
                roles.add(r);
            }
        }

        Department department = departmentRepository.findById(Long.valueOf((Integer) userDetails.get("departmentId"))).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));

        user.setDepartment(department.getId());
        if (roles.size() > 0) user.setRoles(roles);
        else {
            throw new ValidationException("ROLES_INVALID");
        }

        @Valid
        User validUser = user;

        validUser = userRepository.save(validUser);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", validUser);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Gets users by role id.
     *
     * @param roleId the role id
     * @return the users by role id
     * @throws ResourceNotFoundException the resource not found exception
     */
    @GetMapping("/role/{id}")
    public ResponseEntity<SuccessResponse> getUsersByRoleId(@PathVariable(value = "id") Long roleId) throws ResourceNotFoundException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);
        List<User> users = userRepository.findUsersByRolesId(roleId);
        if (users == null) throw new ResourceNotFoundException("USERS_NOT_FOUND");
        Map<String, Object> data = new HashMap<>();
        data.put("users", users);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Gets users by dept id.
     *
     * @param deptId the dept id
     * @return the users by dept id
     * @throws ResourceNotFoundException the resource not found exception
     */
    @GetMapping("/department/{id}")
    public ResponseEntity<SuccessResponse> getUsersByDepartmentId(@PathVariable(value = "id") Long deptId) throws ResourceNotFoundException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);
        List<User> users = userRepository.findUsersByDepartmentId(deptId);
        if (users == null) throw new ResourceNotFoundException("USERS_NOT_FOUND");
        Map<String, Object> data = new HashMap<>();
        data.put("users", users);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Update user response entity.
     *
     * @param userId      the user id
     * @param userDetails the user details
     * @return the response entity
     * @throws ResourceNotFoundException the resource not found exception
     * @throws AlreadyExistsException the email is taken
     * @throws UnauthorizedException the logged in user is not user updated
     */
    @PatchMapping("/{id}")
    public ResponseEntity<SuccessResponse> updateUser(
            @PathVariable(value = "id") Long userId, @RequestBody Map<String, Object> userDetails)
            throws ResourceNotFoundException, AlreadyExistsException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_OWN_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        User user = validateUser("WRITE", userId);

        if (userDetails.get("email") instanceof String && userDetails.get("email") != null) user.setEmail(((String) userDetails.get("email")).toLowerCase());
        if (userDetails.get("staffId") instanceof String && userDetails.get("staffId") != null) user.setStaffId(((String) userDetails.get("staffId")).toLowerCase());
        if (userDetails.get("firstName") instanceof String && userDetails.get("firstName") != null) user.setFirstName((String) userDetails.get("firstName"));
        if (userDetails.get("lastName") instanceof String && userDetails.get("lastName") != null) user.setLastName((String) userDetails.get("lastName"));
        if (userDetails.get("gender") instanceof String && userDetails.get("gender") != null) user.setGender((String) userDetails.get("gender"));

        User emailCheck = userRepository.findDeletedByEmail(user.getEmail());
        if (emailCheck != null && user.getId() != emailCheck.getId()) {
            throw new AlreadyExistsException("EMAIL_ALREADY_EXISTS");
        }

        User staffIdCheck = userRepository.findDeletedByStaffId(user.getStaffId());
        if (staffIdCheck != null && staffIdCheck.getId() != user.getId()) {
            throw new AlreadyExistsException("STAFF_ID_ALREADY_EXISTS");
        }

        Set<Role> roles = new HashSet<>();

        if (userDetails.get("roleIds") != null && userDetails.get("roleIds") instanceof ArrayList) {
            List<Integer> rIds = (ArrayList<Integer>) userDetails.get("roleIds");
            for (Integer id : rIds) {
                Long roleId = Long.valueOf(id);

                Role r = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND"));
                roles.add(r);
            }
        }

        if (userDetails.get("departmentId") != null) {
            Department department = departmentRepository.findById(Long.valueOf((Integer) userDetails.get("departmentId"))).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));
            user.setDepartment(department.getId());
        }
        if (roles.size() > 0) user.setRoles(roles);

        @Valid
        User validUser = user;

        validUser = userRepository.save(validUser);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", validUser);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Update user password response entity.
     *
     * @param userId      the user id
     * @param userDetails the user details
     * @return the response entity
     * @throws ResourceNotFoundException the resource not found exception
     * @throws UnauthorizedException logged in user is not user updated
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<SuccessResponse> updateUserPassword(
            @PathVariable(value = "id") Long userId, @Valid @RequestBody Map<String, String> userDetails)
            throws ResourceNotFoundException, UnauthorizedException, ValidationException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_OWN_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        User user = validateUser("WRITE", userId);

        if (user.getPassword().equals(passwordEncoder.encode(userDetails.get("oldPassword"))))
            throw new ValidationException("INVALID_CREDENTIALS");

        user.setPassword(passwordEncoder.encode(userDetails.get("newPassword")));

        final User updatedUser = userRepository.save(user);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", updatedUser);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Soft deletes te user
     *
     * @param userId id for user to be deleted
     * @return success response
     * @throws ResourceNotFoundException if user not found
     * @throws UnauthorizedException if user unauthorized
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse> deleteUser(@PathVariable(value = "id") Long userId) throws ResourceNotFoundException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "DELETE_OWN_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        User user = validateUser("DELETE", userId);
        user.setDeletedAt(new Date());

        userRepository.save(user);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * @param userId id
     * @return res
     * @throws ResourceNotFoundException err
     * @throws UnauthorizedException     err
     */
    @PutMapping("/restore/{id}")
    public ResponseEntity<SuccessResponse> restoreUser(@PathVariable(value = "id") Long userId) throws ResourceNotFoundException, UnauthorizedException, ValidationException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_OWN_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        User user = userRepository.findDeletedById(userId);

        if (user == null) throw new ResourceNotFoundException("USER_NOT_FOUND");

        if (user.getDeletedAt() == null) throw new ValidationException("USER_NOT_DELETED");

        user.setDeletedAt(null);

        userRepository.save(user);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("restored", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * Hard deletes the user
     *
     * @param userId id for user to be deleted
     * @return success response
     * @throws ResourceNotFoundException if user not found
     * @throws UnauthorizedException     if user unauthorized
     */
    @DeleteMapping("/hard/{id}")
    public ResponseEntity<SuccessResponse> hardDeleteUser(@PathVariable(value = "id") Long userId) throws ResourceNotFoundException, UnauthorizedException {

        User user = validateUser("DELETE", userId);

        if (user.hasRole("ROLE_ADMIN")) throw new UnauthorizedException(noAccessError);

        userRepository.delete(user);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    private User validateUser(String privilege, long userId) throws UnauthorizedException, ResourceNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND"));

        if (authUser.getId() != user.getId() && !authorizationMiddleware.isAuthorized(endPoint, privilege + "_ANY_PRIVILEGE")) {
            throw new UnauthorizedException(noAccessError);
        }

        return user;
    }
}