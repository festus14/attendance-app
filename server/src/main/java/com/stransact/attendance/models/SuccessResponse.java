package com.stransact.attendance.models;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

public class SuccessResponse implements Serializable {
    private Date timestamp;
    private String status;
    private Map<String, ?> data;
    private boolean success;

    /**
     * Instantiates a new Error response.
     *
     * @param status the status
     * @param data   the data
     */
    public SuccessResponse(String status, Map<String, ?> data) {
        this.timestamp = new Date();
        this.status = status;
        this.data = data;
        this.success = true;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, ?> getData() {
        return data;
    }

    public void setData(Map<String, ?> data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
