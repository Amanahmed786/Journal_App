package Journal.App.Service;

import Journal.App.model.SentimentData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SentimentConsumerService {

    @Autowired
    private EmailService emailService;

    @KafkaListener(topics = "weekly_sentiments", groupId = "weekly-sentiment-group")
    public void consume(SentimentData sentimentData) {
        log.info("Received sentiment event from Kafka for email: {}", sentimentData.getEmail());
        emailService.sendEmail(
            sentimentData.getEmail(),
            "Sentiment for Last 7 Days",
            "Your sentiment for last week is: " + sentimentData.getSentiment()
        );
        log.info("Successfully sent weekly sentiment email to: {}", sentimentData.getEmail());
    }

}
