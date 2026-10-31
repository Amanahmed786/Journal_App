package Journal.App.Repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import Journal.App.entity.JournalEntry;

public interface JornalEntryRepository extends MongoRepository<JournalEntry, ObjectId> {

    public List<JournalEntry> findAllByUser(String user);

}
