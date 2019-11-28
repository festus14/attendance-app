export const getRolesById = (roleId, allRoles) => {
    let roles = [];
    roleId.forEach(userRoles => {
        allRoles.forEach(role => {
            if (userRoles === role.id) {
                roles.push(role.name.split("_")[1])
            }
        })
    });
    return roles;
}

export const getDepartmentById = (departmentId, allDepartments) => {
    console.log(departmentId, allDepartments, "all")
    let departmentName = ""
    allDepartments.forEach(department => {
        if (department.id === departmentId) {
            departmentName = department.name;
        }
    });
    return departmentName;
}