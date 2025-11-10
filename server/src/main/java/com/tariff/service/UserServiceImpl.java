package com.tariff.service;

import com.tariff.domain.User;
import com.tariff.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(String username, String email, String password) {
        // Normalize inputs
        String normalizedUsername = username == null ? null : username.trim();
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();

        if (existsByUsername(normalizedUsername)) {
            throw new RuntimeException("Username already exists");
        }
        if (existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(password));
        // Assign default role
        user.setRole("USER");

        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean validateCredentials(String username, String password) {
        return findByUsername(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
    }

    @Override
    public User updateUsername(User user, String newUsername) {
        String trimmed = newUsername == null ? null : newUsername.trim();
        if (trimmed == null || trimmed.isEmpty()) {
            throw new RuntimeException("Username cannot be empty");
        }
        if (!user.getUsername().equals(trimmed) && existsByUsername(trimmed)) {
            throw new RuntimeException("Username already exists");
        }
        user.setUsername(trimmed);
        return userRepository.save(user);
    }

    @Override
    public User changePassword(User user, String currentPassword, String newPassword) {
        if (currentPassword == null || newPassword == null) {
            throw new RuntimeException("Passwords cannot be null");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        if (newPassword.length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}