package Journal.App.cache;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import Journal.App.Repository.ConfigJournalAppRepository;
import Journal.App.entity.ConfigJournalAppEntity;
import jakarta.annotation.PostConstruct;

@Component 
public class AppCache {


    @Autowired 
    private ConfigJournalAppRepository configJournalAppRepository;
    public  Map<String, String> APP_Cache;

    
    @PostConstruct
    public void init(){
        APP_Cache = new HashMap<>();
        List<ConfigJournalAppEntity> all = configJournalAppRepository.findAll();
        for(ConfigJournalAppEntity configJournalAppEntity : all){
            APP_Cache.put(configJournalAppEntity.getKey(), configJournalAppEntity.getValue());
        }
    }
    
}
