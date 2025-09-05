@Component
public class JwtFilter extends OncePerRequestFilter {
  @Autowired private JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      try {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.validateTokenAndGetUserId(token);
        request.setAttribute("userId", userId);
      } catch (Exception e) {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid token");
        return;
      }
    }
    chain.doFilter(request, response);
  }
}