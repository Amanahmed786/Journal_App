package Journal.App.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import tools.jackson.databind.ObjectMapper;

/**
 * Configuration class for Redis integration.
 * Adapts Spring Boot Data Redis for Redis Cloud connectivity.
 *
 * Configures a RedisTemplate with String serializers for keys and values.
 * Storing data as JSON strings (via ObjectMapper in RedisService) ensures human-readable
 * representation in Redis Cloud, avoids brittle Java bytecode serialization, and eliminates
 * unsafe polymorphic deserialization security vulnerabilities.
 */
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        // String serializer for keys so keys are readable in Redis Cloud (e.g., "weather:current")
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);

        // Value serializer: values are serialized as JSON strings by RedisService using Jackson,
        // so StringRedisSerializer ensures raw JSON text is stored directly without extra encoding.
        redisTemplate.setValueSerializer(stringRedisSerializer);
        redisTemplate.setHashValueSerializer(stringRedisSerializer);

        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
