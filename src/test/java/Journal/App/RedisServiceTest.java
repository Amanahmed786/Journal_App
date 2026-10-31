package Journal.App;

import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import Journal.App.Service.RedisService;
import api.response.WeatherResponse;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
public class RedisServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    private ObjectMapper objectMapper;
    private RedisService redisService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        redisService = new RedisService(redisTemplate, objectMapper);
    }

    @Test
    void testGet_CacheHit() {
        String key = "test:hit";
        String json = "{\"main\":{\"temp\":25.0,\"humidity\":60}}";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(key)).thenReturn(json);

        WeatherResponse response = redisService.get(key, WeatherResponse.class);

        Assertions.assertNotNull(response);
        Assertions.assertEquals(25.0, response.getMain().getTemp());
        Assertions.assertEquals(60, response.getMain().getHumidity());
    }

    @Test
    void testGet_CacheMiss() {
        String key = "test:miss";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(key)).thenReturn(null);

        WeatherResponse response = redisService.get(key, WeatherResponse.class);

        Assertions.assertNull(response);
    }

    @Test
    void testGet_RedisException_ReturnsNullGracefully() {
        String key = "test:error";

        when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis connection timed out"));

        WeatherResponse response = redisService.get(key, WeatherResponse.class);

        // Does not throw exception; returns null for safe fallback
        Assertions.assertNull(response);
    }

    @Test
    void testSet_WithTTL_Success() {
        String key = "test:set";
        WeatherResponse response = new WeatherResponse();
        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemp(30.0);
        response.setMain(main);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        redisService.set(key, response, 300L);

        verify(valueOperations).set(org.mockito.ArgumentMatchers.eq(key),
                org.mockito.ArgumentMatchers.contains("\"temp\":30.0"),
                org.mockito.ArgumentMatchers.eq(300L),
                org.mockito.ArgumentMatchers.eq(TimeUnit.SECONDS));
    }

    @Test
    void testSet_RedisException_HandledGracefully() {
        String key = "test:set_error";

        when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis unavailable"));

        // Must not throw exception
        Assertions.assertDoesNotThrow(() -> redisService.set(key, "data", 60L));
    }

    @Test
    void testDelete_Success() {
        String key = "test:delete";
        when(redisTemplate.delete(key)).thenReturn(true);

        boolean deleted = redisService.delete(key);

        Assertions.assertTrue(deleted);
        verify(redisTemplate).delete(key);
    }

    @Test
    void testDelete_RedisException_ReturnsFalseGracefully() {
        String key = "test:delete_error";
        when(redisTemplate.delete(key)).thenThrow(new RuntimeException("Redis unavailable"));

        boolean deleted = redisService.delete(key);

        Assertions.assertFalse(deleted);
    }
}
