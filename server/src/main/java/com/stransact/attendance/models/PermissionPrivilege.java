package com.stransact.attendance.models;

public class PermissionPrivilege {
    private String permission;
    private String privilege;

    public PermissionPrivilege(String permission, String privilege) {
        this.permission = permission;
        this.privilege = privilege;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getPrivilege() {
        return privilege;
    }

    public void setPrivilege(String privilege) {
        this.privilege = privilege;
    }
}
