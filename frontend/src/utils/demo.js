// Demo Seeder for Recruiters & Guests
// Creates a real randomized user, performs actual signup & login, and seeds sample entries

import { signup, login } from '../api/auth';
import { createJournalEntry } from '../api/journal';

export async function createDemoSession() {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const username = `guest_${randomSuffix}`;
  const password = `DemoPass_${randomSuffix}!`;
  const email = `guest.${randomSuffix}@example.com`;

  // 1. Real signup
  await signup({
    username,
    password,
    email,
    sentimentAnalysis: true,
  });

  // 2. Real login & JWT issue
  const auth = await login(username, password);

  // Mark as demo in sessionStorage for the dismissible banner
  try {
    sessionStorage.setItem('aura_is_demo', 'true');
  } catch {
    // ignore
  }

  // 3. Seed 4 attractive sample entries
  const sampleEntries = [
    {
      title: 'Decoupling Sentiment Analytics with Apache Kafka',
      content: `Implemented a decoupled event-driven architecture using Spring Kafka. Every Sunday morning at 9:00 AM, our UserScheduler batch-queries active users opting into sentiment tracking and computes their 7-day emotional velocity.\n\nEvents are streamed onto the 'weekly_sentiments' topic, consumed asynchronously, and forwarded to Jackzo's Gmail SMTP service. This prevents scheduled background reporting from impacting regular journal write operations.`,
      sentiment: 'HAPPY',
    },
    {
      title: 'Optimizing Weather API Invalidation with Redis',
      content: `Integrated Redis Cloud via Lettuce to cache real-time weather responses for our personalized user greeting header. Configured a 10-minute automated cache eviction cycle to balance data freshness against external API quota limits.\n\nRedis cache hits cut latency from 320ms down to 12ms.`,
      sentiment: 'HAPPY',
    },
    {
      title: 'Debugging MongoDB ObjectId Serialization in Jackson 3',
      content: `Discovered an interesting edge case with Spring Boot 4 and tools.jackson.databind: MongoDB BSON ObjectId instances were serializing as composite objects containing {date, timestamp} instead of standard 24-character hexadecimal strings.\n\nResolved this cleanly by introducing a dedicated JacksonConfig registering a ToStringSerializer for ObjectId.class, ensuring full REST spec compliance.`,
      sentiment: 'ANXIOUS',
    },
    {
      title: 'Stateless Security & Dual Filter Chains',
      content: `Configured Spring Security with stateless SessionCreationPolicy. Enforced BCrypt password encoding (strength 10) and implemented a custom OncePerRequestFilter for Bearer token validation with 5-minute token TTL.\n\nAdded a secondary high-priority filter chain with securityMatcher for static assets, allowing lightning-fast frontend delivery without unnecessary token overhead.`,
      sentiment: 'HAPPY',
    },
  ];

  for (const entry of sampleEntries) {
    try {
      await createJournalEntry(entry);
    } catch (e) {
      console.warn('Failed to seed entry:', entry.title, e);
    }
  }

  return auth;
}
