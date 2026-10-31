package Journal.App.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import api.response.WeatherResponse;
import Journal.App.cache.AppCache;

/**
 * Service for fetching external weather data used in user greeting responses.
 *
 * Caching Rationale:
 * - External weather API calls introduce network latency (200-500ms) and are subject
 *   to strict third-party rate limits.
 * - Weather conditions for a given location do not fluctuate rapidly second-to-second.
 * - Weather data is public and identical across users, meaning caching it carries zero risk
 *   of leaking user-specific journal entries or sensitive authentication data.
 * - Key design: "weather:current" uniquely identifies the application's current weather cache.
 * - TTL: 300 seconds (5 minutes) provides optimal balance between low API calls and fresh data.
 * - Cache Miss Flow: Query Redis -> on miss, call external API -> cache in Redis Cloud with TTL -> return.
 * - Invalidation: clearCache() removes the key immediately when requested (e.g., via AdminController).
 */
@Service 
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);

    // Cache key for current weather response in Redis Cloud
    public static final String WEATHER_CACHE_KEY = "weather:current";
    // TTL of 5 minutes (300 seconds)
    public static final long WEATHER_CACHE_TTL_SECONDS = 300L;

    @Value("${weather.api.key}")
    private String apikey;

    @Autowired 
    private AppCache appCache;

    @Autowired 
    private RestTemplate restTemplate;

    @Autowired
    private RedisService redisService;

    public WeatherResponse getWeather() {
        // 1. Check Redis cache first (cache lookup)
        WeatherResponse cachedResponse = redisService.get(WEATHER_CACHE_KEY, WeatherResponse.class);
        if (cachedResponse != null) {
            logger.info("Returning cached weather response from Redis Cloud for key: {}", WEATHER_CACHE_KEY);
            return cachedResponse;
        }

        // 2. Cache miss: Fetch from external third-party API
        logger.info("Cache miss for key '{}'. Fetching weather from external API", WEATHER_CACHE_KEY);
        try {
            if (appCache.APP_Cache == null || !appCache.APP_Cache.containsKey("weather_api")) {
                logger.warn("AppCache weather_api template not found in MongoDB configuration");
                return null;
            }
            String finalAPI = appCache.APP_Cache.get("weather_api").replace("api_key", apikey);
            WeatherResponse response = restTemplate.exchange(finalAPI, HttpMethod.GET, null, WeatherResponse.class).getBody();

            // 3. Store in Redis Cloud with 5-minute TTL for subsequent requests
            if (response != null) {
                redisService.set(WEATHER_CACHE_KEY, response, WEATHER_CACHE_TTL_SECONDS);
            }
            return response;
        } catch (Exception e) {
            logger.error("Error fetching weather from external API: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Explicitly invalidates the weather cache in Redis Cloud.
     * Can be invoked on configuration refresh or via admin endpoints.
     */
    public void clearCache() {
        logger.info("Invalidating weather cache key '{}' in Redis Cloud", WEATHER_CACHE_KEY);
        redisService.delete(WEATHER_CACHE_KEY);
    }
}
