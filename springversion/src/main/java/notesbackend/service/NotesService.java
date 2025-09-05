@Service
public class NotesService {
  @Autowired private DSLContext dsl;

  public List<NoteDto> getUserNotes(Long userId) {
    return dsl.select(NOTES.TITLE, NOTES.TEXT)
    .from(NOTES)
    .where(NOTES.USER_ID.eq(userId).and(NOTES.ACTIVE.eq(true)))
    .fetchInto(NoteDto.class);
  }

  public boolean backupNotes(Long userId, BackupRequest backup) {
    try {
      // mark old notes inactive
      dsl.update(NOTES)
      .set(NOTES.ACTIVE, false)
      .where(NOTES.USER_ID.eq(userId))
      .execute();

      // insert new notes
      for (NoteDto note : backup.getNotes()) {
        dsl.insertInto(NOTES, NOTES.USER_ID, NOTES.TITLE, NOTES.TEXT, NOTES.ACTIVE)
        .values(userId, note.getTitle(), note.getText(), true)
        .execute();
      }

      // remove old inactive notes
      dsl.deleteFrom(NOTES)
      .where(NOTES.USER_ID.eq(userId).and(NOTES.ACTIVE.eq(false)))
      .execute();

      return true;
    } catch (Exception e) {
      return false;
    }
  }
}