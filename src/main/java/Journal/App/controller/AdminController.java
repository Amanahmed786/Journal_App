package Journal.App.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Journal.App.Service.UserService;
import Journal.App.entity.User;
import Journal.App.cache.AppCache;

@RestController
@RequestMapping("/admin")

public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired 
    private AppCache appCache;

    @Autowired
    private Journal.App.Service.WeatherService weatherService;
 

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        
        List<User> all = userService.getAllUsers();
        if(all!= null && !all.isEmpty()) {
            return new ResponseEntity<>(all,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/create-admin-user")
    public void createUser(@RequestBody User user) {
        
        userService.saveNewAdmin(user);
        
    }

    @GetMapping ("/clear-cache")
    public void clearAppCache()
    {
        appCache.APP_Cache.clear();
        appCache.init();
        // Invalidate cached external API data in Redis Cloud
        weatherService.clearCache();
    }

}
