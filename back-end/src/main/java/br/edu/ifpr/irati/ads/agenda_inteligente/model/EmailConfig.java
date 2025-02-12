package br.edu.ifpr.irati.ads.agenda_inteligente.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "email_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "host", nullable = false)
    private String host;

    @Column(name = "port", nullable = false)
    private Integer port;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "use_ssl", nullable = false)
    private Boolean useSsl;
}
