package Journal.App.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import Journal.App.entity.User;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    // Define custom query methods if needed

    User findByUsername(String username);

    void deleteByUsername(String username);
}

