package Journal.App.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class StaticResourceSecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain staticResourceFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/", "/index.html", "/assets/**", "/favicon.*", "/*.svg", "/*.png", "/*.ico", "/robots.txt", "/swagger-ui/**", "/v3/api-docs/**")
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .build();
    }
}
