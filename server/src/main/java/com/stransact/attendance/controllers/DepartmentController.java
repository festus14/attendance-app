package com.stransact.attendance.controllers;

import com.stransact.attendance.exceptions.AlreadyExistsException;
import com.stransact.attendance.exceptions.ResourceNotFoundException;
import com.stransact.attendance.exceptions.UnauthorizedException;
import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.Department;
import com.stransact.attendance.models.SuccessResponse;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.DepartmentRepository;
import com.stransact.attendance.security.AuthorizationMiddleware;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The type Dept controller.
 *
 * @author Dagogo Hart Moore
 */
@RestController
@RequestMapping("/api/v1/departments")
public class DepartmentController {
    public DepartmentController(DepartmentRepository departmentRepository, AuthorizationMiddleware authorizationMiddleware) {
        this.departmentRepository = departmentRepository;
        this.authorizationMiddleware = authorizationMiddleware;
    }

    private final DepartmentRepository departmentRepository;
    private final AuthorizationMiddleware authorizationMiddleware;

    private final String endPoint = "departments";
    private final String noAccessError = "NO_ACCESS";

    /**
     * Get all departments list.
     *
     * @return the list
     */
    @GetMapping("/")
    public ResponseEntity<SuccessResponse> getAllDepartments() {
        final List<Department> department = departmentRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("departments", department);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Gets departments by id.
     *
     * @param departmentId the department id
     * @return the departments by id
     * @throws ResourceNotFoundException the resource not found exception
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse> getDepartmentsById(@PathVariable(value = "id") Long departmentId)
            throws ResourceNotFoundException {
        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));

        Map<String, Object> data = new HashMap<>();
        data.put("department", department);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Create department department.
     *
     * @param department the department
     * @exception AlreadyExistsException if dept exists
     * @exception UnauthorizedException unauthorized
     * @return the department
     */
    @PostMapping("/*")
    public ResponseEntity<SuccessResponse> createDepartment(@Valid @RequestBody Department department) throws AlreadyExistsException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        if (departmentRepository.findDeletedByName(department.getName()) != null) {
            throw new AlreadyExistsException("DEPARTMENT_ALREADY_EXISTS");
        }

        final Department savedDepartment = departmentRepository.save(department);

        Map<String, Object> data = new HashMap<>();
        data.put("department", savedDepartment);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Update department response entity.
     *
     * @param departmentId      the department id
     * @param departmentDetails the department details
     * @return the response entity
     * @throws ResourceNotFoundException the resource not found exception
     * @throws UnauthorizedException unauthorized
     * @throws AlreadyExistsException resource exists
     */
    @PatchMapping("/{id}")
    public ResponseEntity<SuccessResponse> updateDepartment(
            @PathVariable(value = "id") Long departmentId, @Valid @RequestBody Department departmentDetails)
            throws ResourceNotFoundException, AlreadyExistsException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));
        Department checkDept = departmentRepository.findDeletedByName(departmentDetails.getName());
        if (checkDept != null && department != checkDept) {
            throw new AlreadyExistsException("DEPARTMENT_NAME_ALREADY_EXISTS");
        }

        department.setName(departmentDetails.getName());
        final Department updatedDepartment = departmentRepository.save(department);

        Map<String, Object> data = new HashMap<>();
        data.put("department", updatedDepartment);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * Soft Delete department map.
     *
     * @param departmentId the department id
     * @return the map
     * @throws Exception the exception
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse> deleteDepartment(@PathVariable(value = "id") Long departmentId) throws Exception {
        if (!authorizationMiddleware.isAuthorized(endPoint, "DELETE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));

        department.setDeletedAt(new Date());
        departmentRepository.save(department);

        Map<String, Object> data = new HashMap<>();
        data.put("deleted", Boolean.TRUE);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<SuccessResponse> restoreDepartment(@PathVariable(value = "id") Long deptId) throws ResourceNotFoundException, UnauthorizedException, ValidationException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "WRITE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Department department = departmentRepository.findDeletedById(deptId);

        if (department == null) throw new ResourceNotFoundException("DEPARTMENT_NOT_FOUND");

        if (department.getDeletedAt() == null) throw new ValidationException("DEPARTMENT_NOT_DELETED");

        department.setDeletedAt(null);

        departmentRepository.save(department);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("restored", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    @DeleteMapping("/hard/{id}")
    public ResponseEntity<SuccessResponse> hardDeleteDepartment(@PathVariable(value = "id") Long deptId) throws ResourceNotFoundException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "DELETE_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Department department = departmentRepository.findById(deptId).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));

        departmentRepository.delete(department);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    private Department validateUser(String privilege, long id) throws ResourceNotFoundException, UnauthorizedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();

        Department department = departmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));
        if (department != authUser.getDepartment() && !authorizationMiddleware.isAuthorized(endPoint, privilege + "_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        return department;
    }
}