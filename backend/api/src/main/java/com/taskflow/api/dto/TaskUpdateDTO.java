package com.taskflow.api.dto;

import com.taskflow.api.entity.Task.Priority;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskUpdateDTO {

    @Size(max = 150, message = "Title must be 150 characters or fewer")
    private String title;

    private String description;

    private Priority priority;

    private LocalDate dueDate;
}
