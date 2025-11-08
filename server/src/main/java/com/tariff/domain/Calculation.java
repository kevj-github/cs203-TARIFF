package com.tariff.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "calculations")
public class Calculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hs_code")
    private String hsCode;

    @Column(name = "origin_iso2")
    private String originIso2;

    @Column(name = "dest_iso2")
    private String destIso2;

    // Add other fields as needed (customsValue, quantity, baseDuty, total, notes, etc.)
    @Column(name = "notes")
    private String notes;

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHsCode() { return hsCode; }
    public void setHsCode(String hsCode) { this.hsCode = hsCode; }

    public String getOriginIso2() { return originIso2; }
    public void setOriginIso2(String originIso2) { this.originIso2 = originIso2; }

    public String getDestIso2() { return destIso2; }
    public void setDestIso2(String destIso2) { this.destIso2 = destIso2; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
