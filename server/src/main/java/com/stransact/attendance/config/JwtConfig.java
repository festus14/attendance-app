package com.stransact.attendance.config;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.AccessTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * The type JWT Configuration
 *
 * @author moore.dagogohart
 */
@Component
public class JwtConfig implements Serializable {
    public JwtConfig(AccessTokenRepository accessTokenRepository) {
        this.accessTokenRepository = accessTokenRepository;
    }

    private static final long serialVersionUID = -2550185165626007488L;

    @Value("${jwt.secret}")
    private String secret;

    private final AccessTokenRepository accessTokenRepository;

    //retrieve username from jwt token

    /**
     * @param token tok
     * @return token claims
     */
    public String getEmailFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    //retrieve expiration date from jwt token

    /**
     * @param token tok
     * @return expiration
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public String getRefreshIdFromToken(String token) {
        return (String) getAllClaimsFromToken(token).get("refreshId");
    }

    /**
     *
     * @param token tok
     * @param claimsResolver function
     * @param <T> param
     * @return return claims
     */
    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    //for retrieving any information from token we will need the secret key

    /**
     *
     * @param token string
     * @return all claims
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    //check if the token has expired

    /**
     *
     * @param token string
     * @return boolean if token is expired
     */
    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    //generate token for user
//    Then generate refresh token

    /**
     *
     * @param user User
     * @return generated token
     */
    public String generateToken(User user, long expiry) {
        Map<String, Object> claims = new HashMap<>();
        String refreshId = doGenerateToken(new HashMap<>(), user.getEmail() + System.currentTimeMillis(), 2 * 24 * 60 * 60);

        claims.put("refreshId", refreshId);
        return doGenerateToken(claims, user.getEmail(), expiry);
    }

    //while creating the token -
    //1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    //2. Sign the JWT using the HS512 algorithm and secret key.
    //3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //   compaction of the JWT to a URL-safe string

    /**
     * @param claims string
     * @param subject subject
     * @return generated token
     */
    private String doGenerateToken(Map<String, Object> claims, String subject, long expiry) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiry * 1000))
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }

    //validate token

    /**
     *
     * @param token token
     * @param user User
     * @return boolean if token exists
     */
    public Boolean validateToken(String token, User user) {
        final String email = getEmailFromToken(token);
        return (email.equals(user.getEmail()) && !isTokenExpired(token) && !isTokenDeleted(token));
    }

    /**
     * @param token tok
     * @return boolean
     */
    public Boolean isTokenDeleted(String token) {
        return accessTokenRepository.findByToken(token) == null;
    }
}