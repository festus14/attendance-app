package com.stransact.attendance.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Entity
@Table(name = "barcodes")
@Where(clause = "deleted_at is null")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Barcode  extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "BAR_STRING_INVALID")
    @NotEmpty(message = "BAR_STRING_EMPTY")
    @Column(name = "bar_string", nullable = false, unique = true)
    private String barString;

    @JsonIgnore
    @OneToMany(mappedBy = "barcode", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private Set<TimeLog> timeLogs;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getBarString() {
        return barString;
    }

    public void setBarString(String barString) {
        this.barString = barString;
    }

    public Set<TimeLog> getTimeLogs() {
        return timeLogs;
    }

    public void setTimeLogs(Set<TimeLog> timeLogs) {
        this.timeLogs = timeLogs;
    }
}
