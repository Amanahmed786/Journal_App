package Journal.App.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import Journal.App.Enum.Sentiment;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode

@Document(collection = "journal_entries")


public class JournalEntry {

    @Id
    private ObjectId id;

    @NonNull
    private String title;

    private String content;


    private LocalDateTime date;

     private String user;

     private Sentiment sentiment;

    


}
