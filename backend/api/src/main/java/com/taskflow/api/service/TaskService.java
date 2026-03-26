package com.taskflow.api.service;

import com.taskflow.api.dto.TaskCreateDTO;
import com.taskflow.api.dto.TaskResponseDTO;
import com.taskflow.api.dto.TaskUpdateDTO;
import com.taskflow.api.entity.ColumnConfig;
import com.taskflow.api.entity.Task;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.repository.ColumnRepository;
import com.taskflow.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository   taskRepository;
    private final ColumnRepository columnRepository;

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getTasksForBoard(Long boardId) {
        return taskRepository.findByColumn_Board_Id(boardId)
                .stream()
                .map(TaskResponseDTO::from)
                .toList();
    }

    @Transactional
    public TaskResponseDTO createTask(TaskCreateDTO dto) {
        ColumnConfig column = columnRepository.findById(dto.getColumnId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Column with id " + dto.getColumnId() + " not found"));

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .dueDate(dto.getDueDate())
                .column(column)
                .build();

        return TaskResponseDTO.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDTO updateTask(Long id, TaskUpdateDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));

        if (dto.getTitle() != null)       task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getPriority() != null)    task.setPriority(dto.getPriority());
        if (dto.getDueDate() != null)     task.setDueDate(dto.getDueDate());

        return TaskResponseDTO.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDTO moveTask(Long taskId, Long columnId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + taskId + " not found"));

        ColumnConfig newColumn = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Column with id " + columnId + " not found"));

        task.setColumn(newColumn);
        return TaskResponseDTO.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task with id " + id + " not found");
        }
        taskRepository.deleteById(id);
    }
}
