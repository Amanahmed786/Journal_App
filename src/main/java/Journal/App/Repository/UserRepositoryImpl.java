package Journal.App.Repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import Journal.App.entity.User;

public class UserRepositoryImpl {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<User> getUsersForSentimentAnalysis() {
        Query query = new Query();
        
        //This query will return all users 
        //when both the conditions are true.
        /*
        // Instead of writing this validation of email, we can use regular expression
        query.addCriteria(Criteria.where("email").exists(true));
        query.addCriteria(Criteria.where("email").ne(null).ne(""));*/

        Criteria criteria = new Criteria();

        query.addCriteria(criteria.where("email").regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"));
        query.addCriteria(criteria.where("sentimentAnalysis").is(true));

        //This query will return all users when either of the conditions is true.
        
        
        /*query.addCriteria(criteria.orOperator(
            Criteria.where("sentimentAnalysis").is(true),
            Criteria.where("sentimentAnalysis").is(true)
        )); */


        return this.mongoTemplate.find(query, User.class);
    }
}  