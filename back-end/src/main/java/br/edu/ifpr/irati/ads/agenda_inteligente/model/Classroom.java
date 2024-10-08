package br.edu.ifpr.irati.ads.agenda_inteligente.model;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.ClassroomRequest;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

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
    private UUID id;

    private String name;

    @Column(name = "qtd_place")
    private int qtdPlace;

    private String block;

    @Column(name = "is_acessibled")
    private boolean isAcessibled;

    private String status;

    private boolean confirmation;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Classroom (ClassroomRequest classroom) {
        this.id = classroom.id();
        this.name = classroom.name();
        this.qtdPlace = classroom.qtdPlace();
        this.block = classroom.block();
        this.isAcessibled = classroom.isAcessibled();
        this.confirmation = classroom.confirmation();
        this.status = classroom.status();
    }
}
