package Journal.App.Enum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public enum Sentiment {

    HAPPY,
    SAD,
    ANGRY,
    ANXIOUS;

    @NotBlank
    @Email
    public
    String getEmail() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getEmail'");
    }

}
