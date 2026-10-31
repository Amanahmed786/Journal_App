package Journal.App.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;

import Journal.App.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import Journal.App.Repository.JornalEntryRepository;
import Journal.App.entity.JournalEntry;



@Component
public class JournalEntryService {


    

    @Autowired
    private JornalEntryRepository journalEntryRepository;

    
    @Autowired
    private UserService userService;

    @Transactional
    public void saveJournalEntry(JournalEntry journalEntry, String username) {
      try{
        User user = userService.findByUsername(username);
        journalEntry.setDate(LocalDateTime.now());
        JournalEntry saved = journalEntryRepository.save(journalEntry);
        user.getJournalEntries().add(saved);
        //user.setUsername(null);
        userService.saveUser(user);
      }
      catch(Exception e){
        
        throw new RuntimeException("Failed to save journal entry for user: " + username, e);
      }
    }


    public void saveJournalEntry(JournalEntry journalEntry) {
        journalEntryRepository.save(journalEntry);
    }
    
    

    public void saveEntry(JournalEntry journalEntry) {
    journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAllEntries() {
        return journalEntryRepository.findAll();
    }

    public JournalEntry getEntryById(ObjectId myId) {
        return journalEntryRepository.findById(myId).orElse(null);
    }


    @Transactional
    public void deleteEntryById(ObjectId myId, String username) {

        try {
            User user = userService.findByUsername(username);
            boolean removed = user.getJournalEntries().removeIf(entry -> entry.getId().equals(myId));
            if (removed) {
                userService.saveUser(user);
                journalEntryRepository.deleteById(myId);
        } 
            
        } catch (Exception e) {
            
            throw new RuntimeException("Journal entry not found for user: " + username, e);
        }
        }
       
    

    /*public void deleteEntryById(ObjectId myId) {
    journalEntryRepository.deleteById(myId);
}*/

    public Optional<JournalEntry> findById(ObjectId myId) {
        return journalEntryRepository.findById(myId);
    }

    public List<JournalEntry> findAllByUser(String user) {
        return journalEntryRepository.findAllByUser(user);
    }

  
}
