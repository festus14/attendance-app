package com.stransact.attendance.security;

import com.stransact.attendance.config.JwtConfig;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * The type Jwt requuest filter
 *
 * @author moore.dagogohart
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    public JwtRequestFilter(JwtConfig jwtConfig, UserRepository userRepository) {
        this.jwtConfig = jwtConfig;
        this.userRepository = userRepository;
    }

    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;

    /**
     * @param request req
     * @param response res
     * @param chain chain
     * @throws ServletException exception
     * @throws IOException i/o
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        final String requestTokenHeader = request.getHeader("Authorization");

        String email = null;
        String token = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            token = requestTokenHeader.substring(7);
            try {
                email = jwtConfig.getEmailFromToken(token);
            } catch (IllegalArgumentException e) {
                System.out.println(request.getRequestURI() + " Unable to get Jwt Token");
            } catch (ExpiredJwtException e) {
                System.out.println(request.getRequestURI() + " JWT Token has expired");
            } catch (MalformedJwtException e) {
                System.out.println(request.getRequestURI() + " JWT Invalid");
            }
        } else {
            logger.warn(request.getRequestURI() + "JWT token does not begin with Bearer String");
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepository.findByEmail(email);

            if (jwtConfig.validateToken(token, user)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getRoles());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        chain.doFilter(request, response);
    }

}