package com.stransact.attendance.config;

import com.stransact.attendance.security.JwtAuthEntryPoint;
import com.stransact.attendance.security.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * The type web configuration
 *
 * @author moore.dagogohart
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebConfig extends WebSecurityConfigurerAdapter {
    public WebConfig(JwtAuthEntryPoint jwtAuthEntryPoint, JwtRequestFilter jwtRequestFilter) {
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final JwtRequestFilter jwtRequestFilter;

    /**
     * @return encrypted password
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JavaMailSenderImpl mailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

        javaMailSender.setProtocol("SMTP");
        javaMailSender.setHost("127.0.0.1");
        javaMailSender.setPort(25);

        return javaMailSender;
    }

    /**
     * @param httpSecurity http
     * @throws Exception yeah
     */
    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable()
                .authorizeRequests().
                antMatchers(HttpMethod.POST, "/api/v1/auth/**")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/users/**")
                .hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/v1/auth/forgot-password/**")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/auth/refresh-token/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/auth/confirm-token/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/roles/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/departments/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/resources/view/**")
                .permitAll()
                .antMatchers("/api/v1/attendance-websocket/**")
                .permitAll()
                .anyRequest().authenticated().and()
                .exceptionHandling().authenticationEntryPoint(jwtAuthEntryPoint)
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
