package com.taskflow.api.controller;

import com.taskflow.api.dto.BoardDetailDTO;
import com.taskflow.api.entity.Board;
import com.taskflow.api.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDetailDTO> getBoardById(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoardById(id));
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(boardService.createBoard(name));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Board> renameBoard(
        @PathVariable Long id,
        @RequestBody Map<String, String> body) {
        String name = body.get("name");
        return ResponseEntity.ok(boardService.renameBoard(id, name));
}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }
}
