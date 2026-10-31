package Journal.App;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

import Journal.App.Repository.UserRepository;
import Journal.App.Service.UserDetailsServiceImpl;
import Journal.App.entity.User;

@ActiveProfiles("dev")
@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private UserRepository userRepository;

    @Test
    void loadUserByUsername_ReturnsUserDetails_WhenUserExists() {
        // Given: a user entity in the repository
        User mockUser = new User();
        mockUser.setRoles(new ArrayList<>());

        when(userRepository.findByUsername(ArgumentMatchers.anyString())).thenReturn(mockUser);

        // When: loading user by username
        UserDetails userDetails = userDetailsService.loadUserByUsername("ram");

        // Then: user details should not be null
        Assertions.assertNotNull(userDetails, "UserDetails should not be null");

        // And: username should match
        Assertions.assertEquals("ram", userDetails.getUsername(), "Username should be ram");

        // And: password should match
        Assertions.assertEquals("inrinrick", userDetails.getPassword(), "Password should be inrinrick");

        // And: authorities should have ROLE_ prefix (even with empty roles list, it should be empty array)
        Assertions.assertTrue(userDetails.getAuthorities().isEmpty(), "Authorities should be empty when user has no roles");
    }

    @Test
    void loadUserByUsername_ThrowsException_WhenUserNotFound() {
        // Given: no user in the repository
        when(userRepository.findByUsername(ArgumentMatchers.anyString())).thenReturn(null);

        // When/Then: should throw UsernameNotFoundException
        Assertions.assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("nonexistent_user");
        });
    }
}