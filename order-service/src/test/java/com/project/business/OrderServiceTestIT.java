package com.project.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.model.Order;
import com.project.model.PaymentResponse;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.jeasy.random.EasyRandom;
import org.jeasy.random.EasyRandomParameters;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.integration.ClientAndServer;
import org.mockserver.model.HttpRequest;
import org.mockserver.model.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.sleuth.CurrentTraceContext;
import org.springframework.cloud.sleuth.Span;
import org.springframework.cloud.sleuth.TraceContext;
import org.springframework.cloud.sleuth.Tracer;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import reactor.util.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Map;

import static com.project.utils.PaymentStatusCode.WAITING;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@EmbeddedKafka
@ActiveProfiles("test")
@DirtiesContext
public class OrderServiceTestIT {

    private static final String ORDERS_QUEUE = "orders";

    private ClientAndServer clientAndServer;

    @Autowired
    private ReactiveMongoTemplate mongoTemplate;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;


    private final EasyRandomParameters easyRandomParameters = new EasyRandomParameters()
            .ignoreRandomizationErrors(true)
            .scanClasspathForConcreteTypes(true);

    @BeforeEach
    public void setup() {
        clientAndServer = ClientAndServer.startClientAndServer(9000);
    }

    @AfterEach
    public void teardown() {
        clientAndServer.stop();
        mongoTemplate.dropCollection("orders").block();
    }

    @Test
    public void testCheckoutOrderAndSave() throws Exception {
        // Mocking Sleuth vs Reactor Context
        Context context = mock(Context.class);
        TraceContext traceContext = mock(TraceContext.class);
        CurrentTraceContext currentTraceContext = mock(CurrentTraceContext.class);
        Tracer tracer = mock(Tracer.class);
        Span span = mock(Span.class);
        when(span.context()).thenReturn(traceContext);
        when(context.get(any())).thenReturn(currentTraceContext).thenReturn(tracer);
        when(tracer.nextSpan()).thenReturn(span);

        EasyRandom easyRandom = new EasyRandom(easyRandomParameters);
        Order order = easyRandom.nextObject(Order.class);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'hh:mm:ss.SSS");
        String format = LocalDateTime.now().format(formatter);

        order.setPaymentTime(LocalDateTime.parse(format));
        order.setOrderTime(LocalDateTime.parse(format));
        order.setShippingTime(LocalDateTime.parse(format));

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setStatus(WAITING.getValue());

        clientAndServer.when(HttpRequest.request()
                .withMethod("POST")
                .withPath("/pay")
                .withHeader("Accept", MediaType.ALL_VALUE)
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody(objectMapper.writeValueAsString(order)))
                .respond(HttpResponse.response().withBody(objectMapper.writeValueAsString(paymentResponse)));

        PaymentResponse paymentStatus = orderService.checkoutOrderAndSave(order)
                .contextWrite(ctx -> context)
                .block();


        Order orderByEmail = orderService.getOrderByUserEmail(order.getUserEmail())
                .blockFirst();

        assertThat(orderByEmail).usingRecursiveComparison().ignoringFields("paymentInfo.paymentIntentId", "paymentInfo.type").isEqualTo(order);
        //assertThat(paymentStatus).usingRecursiveComparison().isEqualTo(paymentResponse);
        //assertThat(orderByEmail.getPaymentStatus()).isEqualTo(WAITING.getValue());


        Consumer kafkaConsumer = createKafkaConsumer();
        ConsumerRecord singleRecord = KafkaTestUtils.getSingleRecord(kafkaConsumer, ORDERS_QUEUE);
        kafkaConsumer.close();

        assertThat(((Order) singleRecord.value()).getOrderId()).isEqualTo(order.getOrderId());

    }

    private Consumer createKafkaConsumer() throws Exception {
        Map<String, Object> consumerProperties = KafkaTestUtils.consumerProps(System.getProperty("spring.embedded.kafka.brokers"),
                "false", "true");

        consumerProperties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        JsonDeserializer<Order> jsonDeserializer = new JsonDeserializer<>(Order.class);
        jsonDeserializer.addTrustedPackages("*");
        jsonDeserializer.setRemoveTypeHeaders(false);
        jsonDeserializer.setUseTypeMapperForKey(true);

        DefaultKafkaConsumerFactory<String, Order> consumerFactory = new DefaultKafkaConsumerFactory<>(
                consumerProperties);

        consumerFactory.setKeyDeserializer(new StringDeserializer());
        consumerFactory.setValueDeserializer(jsonDeserializer);
        Consumer<String, Order> consumer = consumerFactory.createConsumer();
        consumer.subscribe(Collections.singleton(ORDERS_QUEUE));
        return consumer;
    }
}
