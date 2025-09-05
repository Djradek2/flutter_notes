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