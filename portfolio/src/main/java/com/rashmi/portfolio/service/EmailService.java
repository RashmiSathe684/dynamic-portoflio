package com.rashmi.portfolio.service;

import com.rashmi.portfolio.entity.ContactMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String adminEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public void sendContactNotification(ContactMessage message) {
        if (mailSender == null || adminEmail == null || adminEmail.isEmpty() || mailPassword == null || mailPassword.isEmpty()) {
            log.warn("Email forwarding is skipped: GMAIL_APP_PASSWORD is not configured in environment or properties.");
            return;
        }

        try {
            log.info("Attempting to send contact notification email for message from {}...", message.getName());
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(adminEmail);
            mail.setTo(adminEmail);
            mail.setSubject("New Portfolio Message from " + message.getName());
            mail.setText("Hello Rashmi,\n\n" +
                    "You have received a new contact message on your portfolio website:\n\n" +
                    "--------------------------------------------------\n" +
                    "Name:      " + message.getName() + "\n" +
                    "Email:     " + message.getEmail() + "\n" +
                    "Sent Date: " + message.getCreatedAt() + "\n" +
                    "--------------------------------------------------\n\n" +
                    "Message:\n" + message.getMessage() + "\n\n" +
                    "You can manage this message on your RS Dashboard.\n" +
                    "Best regards,\n" +
                    "Your Portfolio App Backend");
            mailSender.send(mail);
            log.info("Contact notification email sent successfully to {}!", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send contact notification email. Error: {}", e.getMessage());
        }
    }
}
