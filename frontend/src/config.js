// Global frontend configuration & feature flags

export const CONFIG = {
  // Set to true once backend OAuth2 endpoints are activated
  GOOGLE_LOGIN_ENABLED: false,

  // Set to true once OpenAPI / Swagger documentation dependency is included
  SWAGGER_ENABLED: false,
  SWAGGER_URL: '/swagger-ui/index.html',

  // Developer profile info for resume / portfolio showcase
  DEVELOPER: {
    name: 'Aman Ahmed',
    role: 'Java Backend Engineer',
    github: 'https://github.com/amanahmed', // Placeholder link
    linkedin: 'https://linkedin.com/in/amanahmed', // Placeholder link
    portfolio: 'https://amanahmed.dev', // Placeholder link
  },

  // Tech stack confirmed directly from backend code & configurations
  TECH_STACK: [
    { name: 'Java 17', category: 'Language', desc: 'Modern LTS Java Runtime' },
    { name: 'Spring Boot 4', category: 'Backend Framework', desc: 'REST API & Dependency Injection' },
    { name: 'Spring Security 7', category: 'Security', desc: 'Stateless JWT Filter & BCrypt Password Hashing' },
    { name: 'MongoDB', category: 'Database', desc: 'Document Storage with MongoTemplate & Transactions' },
    { name: 'Redis Cloud', category: 'Caching', desc: 'Lettuce client for caching weather & application config' },
    { name: 'Apache Kafka', category: 'Event Streaming', desc: 'Weekly sentiment batch analysis producer/consumer' },
    { name: 'Gmail SMTP', category: 'Notifications', desc: 'Spring Mail Service for weekly digest emails' },
    { name: 'Scheduled Jobs', category: 'Automation', desc: 'Spring @Scheduled cron workers' },
  ],

  // Sentiment options defined in the backend enum: Journal.App.Enum.Sentiment
  SENTIMENTS: [
    { value: 'HAPPY', label: 'Happy', emoji: '😊', color: 'emerald' },
    { value: 'SAD', label: 'Sad', emoji: '😔', color: 'blue' },
    { value: 'ANGRY', label: 'Angry', emoji: '🔥', color: 'rose' },
    { value: 'ANXIOUS', label: 'Anxious', emoji: '⚡', color: 'amber' },
  ],
};
