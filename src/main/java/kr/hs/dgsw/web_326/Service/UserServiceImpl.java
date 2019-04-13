package kr.hs.dgsw.web_326.Service;

import kr.hs.dgsw.web_326.Domain.User;
import kr.hs.dgsw.web_326.Protocol.AttachmentProtocol;
import kr.hs.dgsw.web_326.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public AttachmentProtocol getProfileImage(Long id) {
        Optional<User> found = this.userRepository.findById(id);
        if (!found.isPresent())
            return null;
        return new AttachmentProtocol(found.get().getStoredPath(), found.get().getOriginName());
    }

    @Override
    public User add(User u) {
//        return (User) this.userRepository.findByEmail(u.getEmail())
//                .map(fu -> {  return null; })
//                .orElse(this.userRepository.save(u));
        Optional<User> user = this.userRepository.findByEmail(u.getEmail());
        if(user.isPresent())
            return null;
        System.out.println(u);
        return this.userRepository.save(u);
    }



    @Override
    public User view(Long id) {
        return this.userRepository.findById(id).get();
    }

    @Override
    public User update(User u) {
        return this.userRepository.findById(u.getId())
                .map(fu -> {
                    if(u.getUsername() != null)
                        fu.setUsername(u.getUsername());
                    if(u.getEmail() != null)
                        fu.setEmail(u.getEmail());
                    if(u.getStoredPath() != null)
                        fu.setStoredPath(u.getStoredPath());
                    if(u.getOriginName() != null)
                        fu.setOriginName(u.getOriginName());
                    return this.userRepository.save(fu);
                })
                .orElse(null);
    }

    @Override
    public boolean delete(Long id) {
        try {
            return this.userRepository.findById(id)
                    .map(fu -> {
                        this.userRepository.delete(fu);
                        return true;
                    })
                    .orElse(false);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public User login(User u) {
        return this.userRepository.findByIdAndPassword(u.getId(), u.getPassword())
                .map(fu -> {
                    return fu;
                })
                .orElse(null);
    }

    @Override
    public List<User> list() {
        try {
            return this.userRepository.findAll();
        } catch (Exception e) {
            return null;
        }
    }
}
