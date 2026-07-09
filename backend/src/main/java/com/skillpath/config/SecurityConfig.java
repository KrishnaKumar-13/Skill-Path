package com.skillpath.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
/**
 * Security Configuration
 *
 * Architecture:
 * ┌──────────────────────────────────────────────────────────┐
 * │  React Frontend                                          │
 * │  - User logs in via Supabase Auth (supabase-js)          │
 * │  - Receives a JWT (Supabase-issued)                      │
 * │  - Sends JWT in Authorization: Bearer <token> header     │
 * └──────────────────────────────────────────────────────────┘
 *              ↓
 * ┌──────────────────────────────────────────────────────────┐
 * │  Spring Boot API (this file)                             │
 * │  - SupabaseJwtFilter intercepts every request            │
 * │  - Verifies the JWT using the Supabase JWT secret        │
 * │  - Extracts user_id (UUID) from JWT claims               │
 * │  - Sets it in Spring Security context                    │
 * └──────────────────────────────────────────────────────────┘
 *              ↓
 * ┌──────────────────────────────────────────────────────────┐
 * │  Supabase PostgreSQL (Cloud DB)                          │
 * │  - Spring Boot connects via JDBC                         │
 * │  - Uses the extracted user_id for queries                │
 * └──────────────────────────────────────────────────────────┘
 *
 * Public endpoints (no auth needed):
 *   GET /api/questions          ← Anyone can browse questions
 *   GET /api/questions/{lang}   ← Public
 *   GET /api/health             ← Health check
 *
 * Protected endpoints (Supabase JWT required):
 *   GET  /api/profile           ← Your profile
 *   POST /api/progress/complete ← Record task completion
 *   GET  /api/progress          ← Your progress
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${supabase.jwt.secret}")
    private String supabaseJwtSecret;

    @Bean
    public SupabaseJwtFilter supabaseJwtFilter() {
        return new SupabaseJwtFilter(supabaseJwtSecret);
    }
    @Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (using JWT, not cookies)
            .csrf(csrf -> csrf.disable())

            // Stateless sessions — JWT on every request
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/api/health",
                    "/api/questions",
                    "/api/questions/**",
                    "/api/daily-task"
                ).permitAll()

                // All other /api/** endpoints require valid Supabase JWT
                .requestMatchers("/api/**").authenticated()

                // Allow everything else (Actuator, etc.)
                .anyRequest().permitAll()
            )

            // Add our Supabase JWT verification filter
            .addFilterBefore(supabaseJwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
