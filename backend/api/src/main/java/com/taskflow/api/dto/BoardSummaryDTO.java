package com.taskflow.api.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BoardSummaryDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}
