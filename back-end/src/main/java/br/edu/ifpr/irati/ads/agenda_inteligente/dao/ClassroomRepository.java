package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, String> {}
