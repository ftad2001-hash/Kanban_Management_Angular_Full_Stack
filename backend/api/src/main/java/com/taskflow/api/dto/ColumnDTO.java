package com.taskflow.api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ColumnDTO {
    private Long   id;
    private String name;
    private Integer position;
    private List<TaskResponseDTO> tasks;   // ← was List<Task> (caused circular ref)
}
