package com.stransact.attendance.controllers;

import com.stransact.attendance.config.JwtConfig;
import com.stransact.attendance.exceptions.ResourceNotFoundException;
import com.stransact.attendance.exceptions.UnauthorizedException;
import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.*;
import com.stransact.attendance.repository.AccessTokenRepository;
import com.stransact.attendance.repository.RefreshIdRepository;
import com.stransact.attendance.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * The type Authentication
 *
 * @author moore.dagogohart
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    public AuthenticationController(JwtConfig jwtConfig, UserRepository userRepository, RefreshIdRepository refreshIdRepository, AccessTokenRepository accessTokenRepository, BCryptPasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.jwtConfig = jwtConfig;
        this.userRepository = userRepository;
        this.refreshIdRepository = refreshIdRepository;
        this.accessTokenRepository = accessTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;
    private final RefreshIdRepository refreshIdRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    /**
     * @param request req
     * @return Response entity  success
     * @throws ResourceNotFoundException resource
     * @throws ValidationException validation
     */
    @PostMapping("/*")
    public ResponseEntity<SuccessResponse> createAuthToken(@Valid @RequestBody JwtRequest request) throws ResourceNotFoundException, ValidationException {
        User user = authenticate(request.getEmail(), request.getPassword());

        final String token = jwtConfig.generateToken(user, 60 * 60 * 24 * 7 * 4);
        final Date expiry = jwtConfig.getExpirationDateFromToken(token);
        final String refreshToken = jwtConfig.getRefreshIdFromToken(token);

        AccessToken accessToken = new AccessToken();
        accessToken.setExpiry(expiry);
        accessToken.setToken(token);
        accessToken.setUser(user);

        RefreshId refreshId = new RefreshId();
        refreshId.setRefreshId(refreshToken);
        refreshId.setUser(user);
        refreshId.setExpiry(jwtConfig.getExpirationDateFromToken(refreshToken));

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);
        responseData.put("user", user);
        responseData.put("expiry", expiry);
        responseData.put("refreshToken", refreshToken);

        refreshIdRepository.save(refreshId);
        accessTokenRepository.save(accessToken);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<SuccessResponse> refreshToken(@Valid @RequestBody Map<String, Object> request) throws UnauthorizedException {
        String oldAccessToken = (String) request.get("expiredToken");
        String refreshToken = (String) request.get("refreshToken");
//        if (!jwtConfig.getRefreshIdFromToken(oldAccessToken).equals(refreshToken)) throw new UnauthorizedException("UNAUTHORIZED");

        System.out.println(refreshToken);
        System.out.println(oldAccessToken);

        RefreshId refreshId = refreshIdRepository.findByRefreshId(refreshToken);
        if (refreshId == null || jwtConfig.isTokenExpired(refreshId.getRefreshId())) {
            throw new UnauthorizedException("REFRESH_TOKEN_EXPIRED_OR_INVALID");
        }

        User user = refreshId.getUser();

        final String token = jwtConfig.generateToken(user, 60);
        final Date expiry = jwtConfig.getExpirationDateFromToken(token);
        refreshToken = jwtConfig.getRefreshIdFromToken(token);

        AccessToken accessToken = new AccessToken();
        accessToken.setExpiry(expiry);
        accessToken.setToken(token);
        accessToken.setUser(user);

        refreshId.setRefreshId(refreshToken);
        refreshId.setExpiry(jwtConfig.getExpirationDateFromToken(refreshToken));

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);
        responseData.put("user", user);
        responseData.put("expiry", expiry);
        responseData.put("refreshToken", refreshToken);

        if (!jwtConfig.isTokenDeleted(oldAccessToken)) accessTokenRepository.deleteByToken(oldAccessToken);
        refreshIdRepository.save(refreshId);
        accessTokenRepository.save(accessToken);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    @DeleteMapping("/*")
    public ResponseEntity<SuccessResponse> deleteToken(@RequestHeader("Authorization") String authToken) throws UnauthorizedException {
        String oldAccessToken = authToken.substring(7);

        AccessToken accessToken = accessTokenRepository.findByToken(oldAccessToken);

        if (accessToken == null) {
            throw new UnauthorizedException("UNAUTHORIZED");
        }

        RefreshId refreshId = refreshIdRepository.findByRefreshIdAndUserEmail(jwtConfig.getRefreshIdFromToken(oldAccessToken), accessToken.getUser().getEmail());
        if (refreshId == null) {
            throw new UnauthorizedException("UNAUTHORIZED");
        }

        refreshIdRepository.delete(refreshId);
        accessTokenRepository.deleteByToken(oldAccessToken);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    /**
     * @param request email only is needed
     * @return success response
     * @throws ResourceNotFoundException if email is not found
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<SuccessResponse> forgotPassword(@Valid @RequestBody User request) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new ResourceNotFoundException("USER_NOT_FOUND");
        }

        final String token = jwtConfig.generateToken(request, 5 * 60);

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(request.getEmail());
        mail.setFrom("");
        mail.setSubject("Stransact Learning Center Password Reset!");
        mail.setText("To complete the password reset process, please click here: " + "http://localhost:8082/api/v1/confirm-token/" + token);

        mailSender.send(mail);

        Map<String, Object> data = new HashMap<>();

        data.put("sent", true);

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * @param token token
     * @return Success response
     * @throws UnauthorizedException unauthorized
     */
    @GetMapping("/confirm-token/{token}")
    public ResponseEntity<SuccessResponse> confirmResetToken(@PathVariable(value = "token") String token) throws UnauthorizedException, ExpiredJwtException {
        String email = jwtConfig.getEmailFromToken(token);
        User user = new User();
        user.setEmail(email);

        System.out.println(token);
        System.out.println(user);
        if (!jwtConfig.validateToken(token, user)) {
            throw new UnauthorizedException("TOKEN_EXPIRED");
        }

        Map<String, Object> data = new HashMap<>();

        data.put("message", "token is valid");

        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), data));
    }

    /**
     * @param email email
     * @param password password
     * @return user
     * @throws ResourceNotFoundException The resource not found
     * @throws ValidationException       Validation error
     */
    private User authenticate(String email, String password) throws ResourceNotFoundException, ValidationException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("USER_NOT_FOUND");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ValidationException("INVALID_CREDENTIALS");
        }

        return user;
    }
}