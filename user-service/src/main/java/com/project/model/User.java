package com.project.model;

import lombok.*;
import org.springframework.data.annotation.Transient;

import java.io.Serializable;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class User implements Serializable {

    private static final long serialVersionUID = -1;

    private String id;
    private String gender;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String plainPassword;
    private String phoneNumber;
    private Address address;
    private String role;
    private boolean status;

    @Transient
    private boolean forgotPassword;
}
