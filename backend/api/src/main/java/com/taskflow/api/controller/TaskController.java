package com.taskflow.api.controller;

import com.taskflow.api.dto.TaskCreateDTO;
import com.taskflow.api.dto.TaskMoveDTO;
import com.taskflow.api.dto.TaskResponseDTO;
import com.taskflow.api.dto.TaskUpdateDTO;
import com.taskflow.api.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/boards/{boardId}/tasks")
    public ResponseEntity<List<TaskResponseDTO>> getTasksForBoard(@PathVariable Long boardId) {
        return ResponseEntity.ok(taskService.getTasksForBoard(boardId));
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(dto));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateDTO dto) {
        return ResponseEntity.ok(taskService.updateTask(id, dto));
    }

    @PatchMapping("/tasks/{id}/move")
    public ResponseEntity<TaskResponseDTO> moveTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskMoveDTO dto) {
        return ResponseEntity.ok(taskService.moveTask(id, dto.getColumnId()));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
