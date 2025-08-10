package notesbackend.order;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class APIController {

  @GetMapping("/")
  public String welcome() {
    return "Hello World!!!";
  }
}
