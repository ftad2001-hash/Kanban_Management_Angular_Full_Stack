package com.taskflow.api.repository;

import com.taskflow.api.entity.ColumnConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ColumnRepository extends JpaRepository<ColumnConfig, Long> {
    List<ColumnConfig> findByBoardIdOrderByPositionAsc(Long boardId);
}
