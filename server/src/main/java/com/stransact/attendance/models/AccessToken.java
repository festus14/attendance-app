package com.stransact.attendance.models;

import javax.persistence.*;
import java.util.Date;

/**
 * The type Access Token.
 *
 * @author Dagogo Hart Moore
 */
@Entity
@Table(name = "access_tokens")
public class AccessToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "token", nullable = false, unique = true, length = 512)
    private String token;

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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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