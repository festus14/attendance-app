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
    console.log(departmentId, allDepartments)
    let department = allDepartments.map(department => {
        if (department.id === departmentId) {
            return department.name;
        }
    });
    return department[0];
}