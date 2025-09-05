package notesbackend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import notesbackend.dto.BackupRequest;
import notesbackend.service.NotesService;

@RestController
@RequestMapping("/notes")
public class NotesController {
    @Autowired private NotesService notesService;

    @GetMapping("/reload_backup")
    public ResponseEntity<?> reloadBackup(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        var notes = notesService.getUserNotes(userId);
        if (notes.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No saved backup!"));
        }
        return ResponseEntity.ok(Map.of("data", notes));
    }

    @PostMapping("/backup_notes")
    public ResponseEntity<?> backupNotes(@RequestBody BackupRequest backup, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        boolean success = notesService.backupNotes(userId, backup);
        return ResponseEntity.ok(Map.of("message", success ? "Success!" : "Failed to save backup!"));
    }
}