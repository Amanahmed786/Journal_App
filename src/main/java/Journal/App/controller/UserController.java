package Journal.App.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Journal.App.Repository.UserRepository;
import Journal.App.Service.UserService;
import Journal.App.Service.WeatherService;
import Journal.App.entity.User;
import api.response.WeatherResponse;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherService weatherService;


    /*@GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }*/

    @PostMapping
    public void createUser(@RequestBody User user) {
        userService.saveNewUser(user);
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User newUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User userInDb = userService.findByUsername(username);

        userInDb.setUsername(newUser.getUsername());
        userInDb.setPassword(newUser.getPassword());
        userService.saveNewUser(userInDb);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.deleteByUsername(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<?> greeting() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        WeatherResponse weatherResponse = weatherService.getWeather();
        String greeting ="";
        if (weatherResponse != null) {
                greeting = ", the current temperature is " + weatherResponse.getMain().getTemp() + "°C, "
                    + weatherResponse.getWeather().get(0).getDescription() + " and the humidity is "
                    + weatherResponse.getMain().getHumidity() + "%.";
        } 
        return new ResponseEntity<>("Hi " + authentication.getName() + greeting, HttpStatus.OK);
    }
}
