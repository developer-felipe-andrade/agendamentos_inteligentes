package br.edu.ifpr.irati.ads.agenda_inteligente.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resource_classroom")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ResourceClassroom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, unique = true)
    private String id;

    @Column(name = "resource_id", nullable = false)
    private String resourceId;

    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @Column(nullable = false)
    private Integer qtd;
}
