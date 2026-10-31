package Journal.App;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import Journal.App.scheduler.UserScheduler;


@SpringBootTest 
public class UserSchedulerTest {

    @Autowired 
    private UserScheduler userScheduler;

    @Test 
    public void testFetchUsersAndSendEmail() {
        userScheduler.fetchUsersandsendEmail();
    }
    

}
