package Journal.App.scheduler;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import Journal.App.Enum.Sentiment;
import Journal.App.Repository.UserRepositoryImpl;
import Journal.App.Service.EmailService;
import Journal.App.cache.AppCache;
import Journal.App.entity.JournalEntry;
import Journal.App.entity.User;
import Journal.App.model.SentimentData;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class UserScheduler {

    @Autowired
    private KafkaTemplate<String, SentimentData> kafkaTemplate;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepositoryImpl userRepositoryImpl;

    @Autowired
    private AppCache appcache;

    @Scheduled(cron = "0 0 9 * * 0") // Runs every Sunday at 9 AM

    //@Scheduled (cron = "*/10 * * * * *") // Runs every 5 seconds for testing purposes

    public void fetchUsersandsendEmail() {
        log.info("Fetching users for weekly sentiment analysis and producing to Kafka");

        List<User> users = userRepositoryImpl.getUsersForSentimentAnalysis();
        for (User user : users) {
            List<JournalEntry> journalsEntries = user.getJournalEntries();
            List<Sentiment> filteredEntries = journalsEntries.stream()
                    .filter(x -> x.getDate().toLocalDate().isAfter(LocalDate.now().minusDays(7)))
                    .map(JournalEntry::getSentiment)
                    .collect(Collectors.toList());

            Map<Sentiment, Integer> sentimentCount = new HashMap<>();
            for (Sentiment sentiment : filteredEntries) {
                if (sentiment != null) {
                    sentimentCount.put(sentiment, sentimentCount.getOrDefault(sentiment, 0) + 1);
                }
            }
            Sentiment mostFrequentSentiment = null;
            int maxCount = 0;
            for (Map.Entry<Sentiment, Integer> entry : sentimentCount.entrySet()) {
                if (entry.getValue() > maxCount) {
                    mostFrequentSentiment = entry.getKey();
                    maxCount = entry.getValue();
                }
            }

            if (mostFrequentSentiment != null) {
                SentimentData sentimentData = SentimentData.builder()
                        .email(user.getEmail())
                        .sentiment("Sentiment for last 7 days: " + mostFrequentSentiment)
                        .build();
                log.info("Publishing weekly sentiment event to Kafka for user: {}", user.getEmail());

                try{
                    kafkaTemplate.send("weekly_sentiments", sentimentData.getEmail(), sentimentData);
                } catch (Exception e) {
                    emailService.sendEmail(sentimentData.getEmail(),"Sentiment for Last 7 Days","Your sentiment for last week is: " + sentimentData.getSentiment());
                }

                
            }
        }
    }

    @Scheduled(cron = "0 */10 * * * *") // Runs every 10 minutes
    public void clearAppCache() {
        appcache.init();
    }
}
