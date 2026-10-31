package Journal.App.Repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import Journal.App.Service.EmailService;

@SpringBootTest

public class EmailServiceTest {

    @Autowired 
    private EmailService emailService;

    @Test 
    void testSendEmail() {
        emailService.sendEmail("jodarap442@aminavin.com",
                "Testing java mail sender",
                "Hlo kese ho yr");
    }

}
