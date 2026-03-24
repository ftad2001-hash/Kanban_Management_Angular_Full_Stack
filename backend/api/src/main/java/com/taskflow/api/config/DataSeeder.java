package com.taskflow.api.config;

import com.taskflow.api.repository.BoardRepository;
import com.taskflow.api.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final BoardRepository boardRepository;
    private final BoardService boardService;

    @Override
    public void run(String... args) {
        if (boardRepository.count() == 0) {
            boardService.createBoard("My First Board");
            log.info("Seeded default board: 'My First Board'");
        } else {
            log.info("Database already has boards — skipping seed");
        }
    }
}
