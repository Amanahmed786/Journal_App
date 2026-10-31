package Journal.App;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import Journal.App.Repository.UserRepository;



@SpringBootTest 
public class UserServicetest {


    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByUsername() {
        assertEquals(1,  1);
        assertNotNull(userRepository.findByUsername("Aman"));
    }
}
