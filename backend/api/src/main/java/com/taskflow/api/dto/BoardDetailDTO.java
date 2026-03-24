package com.taskflow.api.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BoardDetailDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private List<ColumnDTO> columns;
}
