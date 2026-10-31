package api.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import api.response.WeatherResponse.Weather;
import lombok.Getter;
import lombok.Setter;


@Getter 
@Setter 
public class WeatherResponse {

    @Getter 
    @Setter 
    @JsonProperty("weather")
    private List<Weather> weather;

    @Getter 
    @Setter
    @JsonProperty("main")
    private Main main;

    @Getter 
    @Setter 
    @JsonProperty("wind")
    private Wind wind;

    @Getter 
    @Setter 
    @JsonProperty("clouds")
    private Clouds clouds;




    @Getter
    @Setter
    public static class Clouds {
        @JsonProperty("all")
        private int all;
    }

    @Getter
    @Setter
    public static class Main {
        @JsonProperty("temp")
        private double temp;

        @JsonProperty("feels_like")
        private double feels_like;

        @JsonProperty("temp_min")
        private double temp_min;

        @JsonProperty("temp_max")
        private double temp_max;

        @JsonProperty("pressure")
        private int pressure;

        @JsonProperty("humidity")
        private int humidity;
    }

    @Getter
    @Setter
    public static class Weather {

        @JsonProperty("description")
        private String description;

    }

    @Getter
    @Setter
    public static class Wind {
        @JsonProperty("speed")
        private double speed;
    }
}