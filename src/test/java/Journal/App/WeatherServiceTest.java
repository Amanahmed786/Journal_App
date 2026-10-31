package Journal.App;

import java.util.HashMap;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import Journal.App.Service.RedisService;
import Journal.App.Service.WeatherService;
import Journal.App.cache.AppCache;
import api.response.WeatherResponse;

@ExtendWith(MockitoExtension.class)
public class WeatherServiceTest {

    @Mock
    private RedisService redisService;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private AppCache appCache;

    @InjectMocks
    private WeatherService weatherService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(weatherService, "apikey", "test-api-key");
    }

    @Test
    void testGetWeather_CacheHit_DoesNotCallExternalApi() {
        WeatherResponse mockResponse = new WeatherResponse();
        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemp(22.0);
        mockResponse.setMain(main);

        // Given Redis has cached response
        when(redisService.get(WeatherService.WEATHER_CACHE_KEY, WeatherResponse.class))
                .thenReturn(mockResponse);

        // When
        WeatherResponse result = weatherService.getWeather();

        // Then: Result is returned from Redis and RestTemplate is never invoked
        Assertions.assertNotNull(result);
        Assertions.assertEquals(22.0, result.getMain().getTemp());
        verify(restTemplate, never()).exchange(any(), any(), any(), eq(WeatherResponse.class));
    }

    @Test
    void testGetWeather_CacheMiss_CallsExternalApiAndCachesResult() {
        WeatherResponse mockApiResponse = new WeatherResponse();
        WeatherResponse.Main main = new WeatherResponse.Main();
        main.setTemp(27.5);
        mockApiResponse.setMain(main);

        HashMap<String, String> cacheMap = new HashMap<>();
        cacheMap.put("weather_api", "https://api.weather.com/data?appid=api_key");

        // Given Redis cache miss
        when(redisService.get(WeatherService.WEATHER_CACHE_KEY, WeatherResponse.class))
                .thenReturn(null);

        // AppCache returns API template
        ReflectionTestUtils.setField(appCache, "APP_Cache", cacheMap);

        // RestTemplate returns API response
        when(restTemplate.exchange(eq("https://api.weather.com/data?appid=test-api-key"),
                eq(HttpMethod.GET), any(), eq(WeatherResponse.class)))
                .thenReturn(new ResponseEntity<>(mockApiResponse, HttpStatus.OK));

        // When
        WeatherResponse result = weatherService.getWeather();

        // Then: External API is called and result is cached in Redis with 300s TTL
        Assertions.assertNotNull(result);
        Assertions.assertEquals(27.5, result.getMain().getTemp());
        verify(redisService).set(WeatherService.WEATHER_CACHE_KEY, mockApiResponse, 300L);
    }

    @Test
    void testClearCache_DeletesRedisKey() {
        weatherService.clearCache();
        verify(redisService).delete(WeatherService.WEATHER_CACHE_KEY);
    }
}
