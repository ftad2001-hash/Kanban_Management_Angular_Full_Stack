package com.taskflow.api.dto;

import com.taskflow.api.entity.Task;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ColumnDTO {
    private Long id;
    private String name;
    private Integer position;
    private List<Task> tasks;
}
