package com.taskflow.api.dto;

import com.taskflow.api.entity.Task;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponseDTO {

    private Long   id;
    private String title;
    private String description;
    private String priority;
    private LocalDate dueDate;

    // Column info flattened — no back-reference to tasks list
    private Long   columnId;
    private String columnName;
    private Integer columnPosition;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Static factory — converts a Task entity to a safe DTO. */
    public static TaskResponseDTO from(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .columnId(task.getColumn().getId())
                .columnName(task.getColumn().getName())
                .columnPosition(task.getColumn().getPosition())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
