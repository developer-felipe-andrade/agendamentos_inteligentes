package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.ResourceClassroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceClassroomRepository extends JpaRepository<ResourceClassroom, String> {
    void deleteByResourceId(String resourceId);
}