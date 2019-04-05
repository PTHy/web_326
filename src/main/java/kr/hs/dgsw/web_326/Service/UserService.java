package kr.hs.dgsw.web_326.Service;

import kr.hs.dgsw.web_326.Domain.User;

import java.util.List;

public interface UserService {
    User add(User u);
    User view(Long id);
    User update(User u);
    boolean delete(Long id);

    List<User> list();
}
