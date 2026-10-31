package Journal.App;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * Automated test for verifying Redis Cloud connectivity, key writing, reading, TTL assignment, and cleanup.
 * Converted from a startup CommandLineRunner to a proper JUnit test so test writes do not run on every
 * application startup or pollute the context for other tests.
 */
@SpringBootTest
public class RedisConnectionTest {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Test
    public void testRedisCloudConnectionAndOperations() {
        String key = "journalapp:connection-test";
        String expectedValue = "Redis Cloud Connected Successfully";

        try {
            // 1. Write a temporary test value with a 2-minute TTL
            redisTemplate.opsForValue().set(key, expectedValue, Duration.ofMinutes(2));

            // 2. Read the value back and assert equality
            String actualValue = redisTemplate.opsForValue().get(key);
            Assertions.assertEquals(expectedValue, actualValue, "Value retrieved from Redis must match the stored value");

            // 3. Verify TTL is positive and assigned
            Long expire = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            Assertions.assertNotNull(expire, "TTL should not be null");
            Assertions.assertTrue(expire > 0 && expire <= 120, "TTL should be positive and within the set duration");

            System.out.println("SUCCESS: Redis Cloud connection, read/write, and TTL verified successfully!");
        } finally {
            // 4. Non-invasive cleanup: delete temporary test key so Redis Cloud is not polluted
            redisTemplate.delete(key);
            Assertions.assertNull(redisTemplate.opsForValue().get(key), "Temporary test key should be cleaned up");
        }
    }
}
