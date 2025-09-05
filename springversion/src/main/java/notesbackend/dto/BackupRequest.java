package notesbackend.dto;

import java.util.List;
import lombok.Data;

@Data
public class BackupRequest {
  private List<NoteDto> notes;
}