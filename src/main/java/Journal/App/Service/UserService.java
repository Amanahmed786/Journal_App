package Journal.App.Service;

import java.util.Arrays;
import java.util.List;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import Journal.App.Repository.UserRepository;
import Journal.App.entity.User;

@Component
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public void saveNewUser(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(Arrays.asList("USER"));
            userRepository.save(user);
        } catch (Exception e) {
            //logger.error("Failed to save new user: " + user.getUsername(), e);

            logger.error("hahaha");
            logger.warn("hahaha");
            logger.info("hahaha");
            logger.debug("hahaha");
            logger.trace("hahaha");

            throw new RuntimeException("Failed to save new user: " + user.getUsername(), e);
        }
    }


    public void saveNewAdmin(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER", "ADMIN"));
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(ObjectId myId) {
        return userRepository.findById(myId).orElse(null);
    }

    public void deleteUserById(ObjectId myId) {
        userRepository.deleteById(myId);
    }

    /*public void deleteUserByUsername(String username) {
        User user = findByUsername(username);
        if (user != null) {
            userRepository.delete(user);
        }
    }*/

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}