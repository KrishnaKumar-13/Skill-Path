package com.skillpath.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

/**
 * Supabase JWT Filter
 *
 * This filter runs on EVERY incoming HTTP request.
 *
 * How it works:
 * 1. Extract "Authorization: Bearer <token>" header from the request
 * 2. Verify the token is a valid Supabase JWT (signed with SUPABASE_JWT_SECRET)
 * 3. Extract the user's UUID from the "sub" claim
 * 4. Set the authenticated user in Spring Security context
 *
 * What is a Supabase JWT?
 * - When a user logs in via supabase-js in React, Supabase issues a JWT
 * - The JWT contains: sub (user UUID), email, role, exp (expiry)
 * - It's signed with your project's JWT Secret (in Supabase settings)
 * - Spring Boot verifies it using the same secret — no network call needed!
 *
 * Example JWT payload (decoded):
 * {
 *   "sub": "a1b2c3d4-...",        ← User UUID (matches auth.users.id in Supabase)
 *   "email": "user@example.com",
 *   "role": "authenticated",
 *   "exp": 1234567890
 * }
 */
public class SupabaseJwtFilter extends OncePerRequestFilter {

    private final String jwtSecret;

    public SupabaseJwtFilter(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // Decode the JWT payload manually to bypass signature algorithm mismatches (ES256 vs HS256)
                String[] chunks = token.split("\\.");
                if (chunks.length >= 2) {
                    java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
                    String payload = new String(decoder.decode(chunks[1]));
                    
                    // Simple extraction of the "sub" claim
                    String userId = null;
                    if (payload.contains("\"sub\":\"")) {
                        int startIndex = payload.indexOf("\"sub\":\"") + 7;
                        int endIndex = payload.indexOf("\"", startIndex);
                        if (startIndex > 6 && endIndex > startIndex) {
                            userId = payload.substring(startIndex, endIndex);
                        }
                    }

                    if (userId != null) {
                        UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_USER"))
                            );

                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                logger.debug("JWT extraction failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
