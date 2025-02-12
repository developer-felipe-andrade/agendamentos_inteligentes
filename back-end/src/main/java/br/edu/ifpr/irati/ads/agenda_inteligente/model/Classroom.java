package br.edu.ifpr.irati.ads.agenda_inteligente.model;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Table(name = "classrooms")
@Entity(name = "classrooms")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "name")
    private String name;
    @Column(name = "qtd_place")
    private int qtdPlace;
    private String block;
    @Column(name = "is_accessible")
    private boolean acessible;
    private boolean active;
    private boolean confirmation;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User responsible;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "classroom",  fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "classroom", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ResourceClassroom> resources;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Classroom(ClassroomRequest classroom) {
        this.id = classroom.id();
        this.name = classroom.name();
        this.qtdPlace = classroom.qtdPlace();
        this.block = classroom.block();
        this.acessible = classroom.acessible();
        this.confirmation = classroom.confirmation();
        this.active = classroom.active();
    }
}
