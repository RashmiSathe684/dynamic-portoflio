package com.rashmi.portfolio.repository;

import com.rashmi.portfolio.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Project> searchProjects(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Project> searchProjectsList(@Param("search") String search);
}
