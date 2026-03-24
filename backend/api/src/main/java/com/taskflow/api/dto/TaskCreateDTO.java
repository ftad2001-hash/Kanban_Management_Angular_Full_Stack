package com.taskflow.api.dto;

import com.taskflow.api.entity.Task.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskCreateDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be 150 characters or fewer")
    private String title;

    private String description;

    private Priority priority = Priority.MEDIUM;

    private LocalDate dueDate;

    @NotNull(message = "Column ID is required")
    private Long columnId;
}
