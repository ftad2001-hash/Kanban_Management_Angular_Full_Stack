package com.taskflow.api.repository;

import com.taskflow.api.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
    boolean existsByName(String name);
}
