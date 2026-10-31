package Journal.App.entity;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "users")

@Getter
@Setter
public class User {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    @Nonnull
    private String username;

    private String email;
    private boolean sentimentAnalysis;
    @NonNull
    private String password;

    @DBRef
    private List<JournalEntry> journalEntries = new ArrayList<>();

    private List<String> roles = new ArrayList<>();
}
