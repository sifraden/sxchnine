package com.project.business;

import com.project.model.User;
import com.sendgrid.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;

@Service
@RefreshScope
@Slf4j
public class EmailUpdatesSender extends EmailSender<User> {

    @Value("${sendGrid.mail.templateUpdatesId}")
    private String templateId;

    @Value("${sendGrid.mail.name}")
    private String senderName;

    public EmailUpdatesSender(SendGrid sendGrid) {
        super(sendGrid);
    }

    @Override
    public String getTemplateId() {
        return templateId;
    }

    @Override
    public String type() {
        return "UPDATES";
    }

    @Override
    public Mail mailBuilder(User user) {
        log.info("Send Updates Email to {}", user.getEmail());
        Email emailFrom = new Email(from, senderName);
        Email emailTo = new Email(user.getEmail());

        Personalization personalization = new Personalization();
        personalization.addTo(emailTo);

        Content content = new Content("text/html", "plain");
        Mail mail = new Mail();
        mail.setFrom(emailFrom);
        mail.setTemplateId(getTemplateId());
        mail.addPersonalization(personalization);
        mail.addContent(content);

        return mail;
    }
}