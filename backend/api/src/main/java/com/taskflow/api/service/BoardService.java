package com.taskflow.api.service;

import com.taskflow.api.dto.BoardDetailDTO;
import com.taskflow.api.dto.BoardSummaryDTO;
import com.taskflow.api.dto.ColumnDTO;
import com.taskflow.api.dto.TaskResponseDTO;
import com.taskflow.api.entity.Board;
import com.taskflow.api.entity.ColumnConfig;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.repository.BoardRepository;
import com.taskflow.api.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository  boardRepository;
    private final ColumnRepository columnRepository;

    public List<BoardSummaryDTO> getAllBoards() {
        return boardRepository.findAll().stream()
            .map(b -> BoardSummaryDTO.builder()
                .id(b.getId())
                .name(b.getName())
                .createdAt(b.getCreatedAt())
                .build())
            .toList();
    }

    @Transactional(readOnly = true)
    public BoardDetailDTO getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board with id " + id + " not found"));

        List<ColumnDTO> columnDTOs = columnRepository
                .findByBoardIdOrderByPositionAsc(id)
                .stream()
                .map(col -> ColumnDTO.builder()
                        .id(col.getId())
                        .name(col.getName())
                        .position(col.getPosition())
                        // Map each Task entity → TaskResponseDTO (no circular ref)
                        .tasks(col.getTasks().stream()
                                .map(TaskResponseDTO::from)
                                .toList())
                        .build())
                .toList();

        return BoardDetailDTO.builder()
                .id(board.getId())
                .name(board.getName())
                .createdAt(board.getCreatedAt())
                .columns(columnDTOs)
                .build();
    }

    @Transactional
    public Board createBoard(String name) {
        Board board = boardRepository.save(Board.builder().name(name).build());
        createDefaultColumns(board);
        return board;
    }

    private void createDefaultColumns(Board board) {
        List<String> columnNames = List.of("To Do", "In Progress", "Done");
        for (int i = 0; i < columnNames.size(); i++) {
            columnRepository.save(ColumnConfig.builder()
                    .name(columnNames.get(i))
                    .position(i)
                    .board(board)
                    .build());
        }
    }
    @Transactional
    public Board renameBoard(Long id, String name) {
    Board board = boardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Board with id " + id + " not found"));
    board.setName(name);
    return boardRepository.save(board);
    }

    @Transactional
    public void deleteBoard(Long id) {
        if (!boardRepository.existsById(id)) {
            throw new ResourceNotFoundException("Board with id " + id + " not found");
        }
        boardRepository.deleteById(id);
    }
}
