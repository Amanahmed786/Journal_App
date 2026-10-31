package Journal.App.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Config_journal_app")
@Data
@NoArgsConstructor
public class ConfigJournalAppEntity {

    @Id
    private ObjectId id;

    private String key;
    private String value;
}
