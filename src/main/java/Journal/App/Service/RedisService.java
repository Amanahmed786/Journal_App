package Journal.App.Service;

import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import tools.jackson.databind.ObjectMapper;

/**
 * Reusable Redis service encapsulating key-value caching operations.
 *
 * Implements the core caching pattern covered in the tutorial:
 * - Read key-value data with type-safe deserialization from JSON.
 * - Write key-value data with JSON serialization and explicit TTL (expiry).
 * - Cache eviction / invalidation via key deletion.
 * - Fault tolerance: Redis network or server failures are logged with full detail,
 *   returning null on cache lookup so that the application safely falls back to MongoDB
 *   or downstream services without throwing 500 errors to the client.
 */
@Service
public class RedisService {

    private static final Logger logger = LoggerFactory.getLogger(RedisService.class);

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public RedisService(RedisTemplate<String, Object> redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Retrieves an object from Redis cache by key and deserializes it from JSON.
     *
     * @param key         Cache key
     * @param entityClass Expected class type
     * @param <T>         Target generic type
     * @return Deserialized object if found, or null on cache miss or Redis error
     */
    public <T> T get(String key, Class<T> entityClass) {
        try {
            Object rawValue = redisTemplate.opsForValue().get(key);
            if (rawValue == null) {
                logger.debug("Cache miss for key: {}", key);
                return null;
            }
            logger.debug("Cache hit for key: {}", key);
            return objectMapper.readValue(rawValue.toString(), entityClass);
        } catch (Exception e) {
            // Log Redis failures clearly without crashing the calling workflow,
            // enabling graceful fallback to primary database or external API.
            logger.error("Failed to retrieve or deserialize key '{}' from Redis: {}", key, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Serializes an object to JSON and stores it in Redis with a specified Time-To-Live (TTL).
     *
     * @param key          Cache key
     * @param o            Object to serialize and cache
     * @param ttlInSeconds Expiry time in seconds
     */
    public void set(String key, Object o, Long ttlInSeconds) {
        try {
            String jsonValue = objectMapper.writeValueAsString(o);
            if (ttlInSeconds != null && ttlInSeconds > 0) {
                redisTemplate.opsForValue().set(key, jsonValue, ttlInSeconds, TimeUnit.SECONDS);
            } else {
                redisTemplate.opsForValue().set(key, jsonValue);
            }
            logger.debug("Cached key '{}' with TTL {} seconds", key, ttlInSeconds);
        } catch (Exception e) {
            // Log failure to write cache so administrators know Redis is encountering issues,
            // but do not abort the user request.
            logger.error("Failed to serialize or store key '{}' into Redis: {}", key, e.getMessage(), e);
        }
    }

    /**
     * Evicts / invalidates a cached key from Redis.
     * Used when underlying data is updated, deleted, or manually refreshed.
     *
     * @param key Cache key to delete
     * @return true if key was deleted, false otherwise
     */
    public boolean delete(String key) {
        try {
            Boolean deleted = redisTemplate.delete(key);
            logger.debug("Invalidated cache key '{}': {}", key, deleted);
            return Boolean.TRUE.equals(deleted);
        } catch (Exception e) {
            logger.error("Failed to delete key '{}' from Redis: {}", key, e.getMessage(), e);
            return false;
        }
    }
}
