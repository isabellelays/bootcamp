package com.bootcamp.core.models;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import com.bootcamp.core.testcontext.AppAemContext;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(AemContextExtension.class)
class HelloWorldModelTest {

    private final AemContext context = AppAemContext.newAemContext();

    private HelloWorldModel hello;

    @BeforeEach
    public void setup() throws Exception {
        Resource resource = context.create().resource("/content/test/helloworld",
            "sling:resourceType", "bootcampisabelle/components/helloworld",
            "message", "Bem-vindo ao Bootcamp",
            "visitorName", "Isabelle");

        hello = resource.adaptTo(HelloWorldModel.class);
    }

    @Test
    void testGetMessage() {
        assertNotNull(hello.getMessage());
        assertEquals("Bem-vindo ao Bootcamp", hello.getMessage());
    }

    @Test
    void testGetGreetingWithVisitorName() {
        assertEquals("Bem-vindo ao Bootcamp, Isabelle!", hello.getGreeting());
    }

    @Test
    void testGetGreetingWithoutVisitorName() {
        Resource resource = context.create().resource("/content/test/helloworld2",
            "sling:resourceType", "bootcampisabelle/components/helloworld",
            "message", "Olá");
        HelloWorldModel model = resource.adaptTo(HelloWorldModel.class);
        assertNotNull(model);
        assertEquals("Olá", model.getGreeting());
    }

    @Test
    void testDefaultMessageWhenNull() {
        Resource resource = context.create().resource("/content/test/helloworld3",
            "sling:resourceType", "bootcampisabelle/components/helloworld");
        HelloWorldModel model = resource.adaptTo(HelloWorldModel.class);
        assertNotNull(model);
        assertEquals("Mensagem não configurada", model.getMessage());
    }

}
