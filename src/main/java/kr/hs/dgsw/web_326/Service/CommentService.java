package kr.hs.dgsw.web_326.Service;

import kr.hs.dgsw.web_326.Domain.Comment;
import kr.hs.dgsw.web_326.Protocol.CommentUsernameProtocol;

import java.util.List;

public interface CommentService {
    List<CommentUsernameProtocol> listAllContents();
    CommentUsernameProtocol add(Comment c);
    CommentUsernameProtocol view(Long id);
    CommentUsernameProtocol update(Comment c);
    boolean delete(Long id);
}
