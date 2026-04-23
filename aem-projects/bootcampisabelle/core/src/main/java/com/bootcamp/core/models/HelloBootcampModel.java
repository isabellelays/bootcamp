package com.bootcamp.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
        adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class HelloBootcampModel {

    @ValueMapValue
    private String message;

    @ValueMapValue
    private String visitorName;

    public String getMessage() {
        return message != null ? message : "Mensagem não configurada";
    }

    public String getGreeting() {
        if (visitorName != null && !visitorName.isEmpty()) {
            return message + ", " + visitorName + "Isabelle";
        }
        return message;
    }

    public String getVisitorName() {
        return visitorName;
    }
}