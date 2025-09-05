package notesbackend.config;

import java.sql.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
  @Value("${jwt.secret}")
  private String secret;

  public String generateToken(Long userId) {
    return Jwts.builder()
    .setSubject(String.valueOf(userId))
    .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
    .signWith(SignatureAlgorithm.HS256, secret)
    .compact();
  }

  public Long validateTokenAndGetUserId(String token) {
    Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    return Long.valueOf(claims.getSubject());
  }
}