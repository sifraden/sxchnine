package com.project.repository;

import com.project.model.User;

public interface UserRepository {

    User findUserByEmail(String email);
}
