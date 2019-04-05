package kr.hs.dgsw.web_326.Controller;

import kr.hs.dgsw.web_326.Domain.Comment;
import kr.hs.dgsw.web_326.Service.CommentService;
import kr.hs.dgsw.web_326.Domain.User;
import kr.hs.dgsw.web_326.Protocol.CommentUsernameProtocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/comment")
    public List<CommentUsernameProtocol> listComments() {
        return this.commentService.listAllContents();
    }

    @GetMapping("/comment/{id}")
    public CommentUsernameProtocol view(@PathVariable Long id) {
        return this.commentService.view(id);
    }

    @PostMapping("/comment")
    public CommentUsernameProtocol add(@RequestBody Comment c) {
        return this.commentService.add(c);
    }

    @PutMapping("/comment")
    public CommentUsernameProtocol update(@RequestBody Comment c) {
        return this.commentService.update(c);
    }

    @DeleteMapping("/comment/{id}")
    public boolean delete(@PathVariable Long id) {
        return this.commentService.delete(id);
    }
}
