package com.stransact.attendance.models;

import javax.persistence.*;
import java.util.Date;

/**
 * The type RefreshId.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "refresh_ids")
public class RefreshId {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "refresh_id", nullable = false, unique = true)
    private String refreshId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "expiry", nullable = false)
    private Date expiry;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRefreshId() {
        return refreshId;
    }

    public void setRefreshId(String refreshId) {
        this.refreshId = refreshId;
    }

    public Date getExpiry() {
        return expiry;
    }

    public void setExpiry(Date expiry) {
        this.expiry = expiry;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}