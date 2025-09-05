package notesbackend.service;

import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import notesbackend.config.JwtUtil;

import static notesbackend.jooq.public_.tables.Member.MEMBER;

@Service
public class AuthService {
  @Autowired private DSLContext dsl;
  @Autowired private JwtUtil jwtUtil;

  public String login(String username, String password) {
    var user = dsl.selectFrom(MEMBER)
    .where(MEMBER.NAME.eq(username))
    .fetchOne();

    if (user == null) { 
      throw new RuntimeException("Invalid credentials");
    }

    if (!BCrypt.checkpw(password, user.getPassword())) {
      throw new RuntimeException("Invalid credentials");
    }

    return jwtUtil.generateToken(user.getId().longValue());
  }
}