package com.taskflow.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskMoveDTO {

    @NotNull(message = "Column ID is required")
    private Long columnId;
}
