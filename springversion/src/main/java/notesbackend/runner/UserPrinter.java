package notesbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class UserPrinter implements CommandLineRunner {

    private final UserRepository userRepository;

    public UserPrinter(UserRepository userRepository) {
      this.userRepository = userRepository;
      System.out.println("Spring bean constructed!");
    }

    @Override
    public void run(String... args) {
      System.out.println("Running!");
      List<User> users = userRepository.findAll();
      users.forEach(System.out::println);
    }
}