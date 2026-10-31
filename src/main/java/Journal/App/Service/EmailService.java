package Journal.App.Service;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.mail.MailSender;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import java.util.regex.Pattern;

/**
 * Service for sending emails using Spring's MailSender.
 * Provides validation, error handling, and logging for email operations.
 */
@Service
@Slf4j
public class EmailService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );

    private final MailSender mailSender;

    /**
     * Creates an EmailService with the given MailSender.
     *
     * @param mailSender the Spring MailSender to use for sending emails
     */
    public EmailService(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a simple email with the given parameters.
     *
     * @param to      the recipient email address (must be valid format)
     * @param subject the email subject (must not be blank)
     * @param body    the email body text (must not be blank)
     * @throws IllegalArgumentException if any parameter is invalid
     */
    public void sendEmail(@NotBlank @Email String to, @NotBlank String subject, @NotBlank String body) {
        validateEmailParams(to, subject, body);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
            log.debug("Email sent successfully to: {}", to);
        } catch (MailSendException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new EmailSendException("Failed to send email to " + to, e);
        }
    }

    /**
     * Sends a simple email with a custom from address.
     *
     * @param from    the sender email address (must be valid format)
     * @param to      the recipient email address (must be valid format)
     * @param subject the email subject (must not be blank)
     * @param body    the email body text (must not be blank)
     * @throws IllegalArgumentException if any parameter is invalid
     */
    public void sendEmail(@NotBlank @Email String from, @NotBlank @Email String to, @NotBlank String subject, @NotBlank String body) {
        validateEmailParams(to, subject, body);
        if (from == null || from.isBlank() || !EMAIL_PATTERN.matcher(from).matches()) {
            throw new IllegalArgumentException("Invalid 'from' email address: " + from);
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
            log.debug("Email sent successfully from: {} to: {}", from, to);
        } catch (MailSendException e) {
            log.error("Failed to send email from: {} to: {}", from, to, e);
            throw new EmailSendException("Failed to send email from " + from + " to " + to, e);
        }
    }

    /**
     * Validates email parameters.
     *
     * @param to      recipient email
     * @param subject email subject
     * @param body    email body
     * @throws IllegalArgumentException if validation fails
     */
    private void validateEmailParams(String to, String subject, String body) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("Recipient email address cannot be null or empty");
        }
        if (!EMAIL_PATTERN.matcher(to).matches()) {
            throw new IllegalArgumentException("Invalid email address format: " + to);
        }
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("Email subject cannot be null or empty");
        }
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Email body cannot be null or empty");
        }
    }

    /**
     * Exception thrown when email sending fails.
     */
    public static class EmailSendException extends RuntimeException {
        public EmailSendException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
