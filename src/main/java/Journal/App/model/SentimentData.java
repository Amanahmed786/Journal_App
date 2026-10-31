package Journal.App.model;

import lombok.Builder;
import lombok.Data;

@Data 
@Builder 
public class SentimentData {

    private String email;
    private String sentiment;

    public SentimentData() {
    }

    public SentimentData(String email, String sentiment) {
        this.email = email;
        this.sentiment = sentiment;
    }

    
}
