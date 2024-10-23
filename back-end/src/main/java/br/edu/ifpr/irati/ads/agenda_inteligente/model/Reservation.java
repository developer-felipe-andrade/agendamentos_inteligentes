package br.edu.ifpr.irati.ads.agenda_inteligente.model;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Table(name = "reservations")
@Entity(name = "reservations")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Reservation {

    @Id
    @Column(length = 255)  // Define o tamanho máximo da string
    private String id;

    private LocalDateTime dt_start;

    private LocalDateTime dt_end;

    private String status;

    @Lob
    private String obs;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = true)
    private Classroom classroom;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;
}
