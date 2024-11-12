package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, String> {
    boolean existsByNameAndType(String name, String type);
}
