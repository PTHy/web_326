package kr.hs.dgsw.web_326.Service;

import kr.hs.dgsw.web_326.Domain.Comment;
import kr.hs.dgsw.web_326.Domain.User;
import kr.hs.dgsw.web_326.Protocol.AttachmentProtocol;
import kr.hs.dgsw.web_326.Protocol.CommentUsernameProtocol;
import kr.hs.dgsw.web_326.Repository.CommentRepository;
import kr.hs.dgsw.web_326.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl
    implements CommentService{

    Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    private void init() {
        User u = this.userRepository.save(new User("aaa","aaa@dgsw.hs.kr"));
        this.commentRepository.save(new Comment(u.getId(),"아 밥먹고싶다"));
        this.commentRepository.save(new Comment(u.getId(),"집가고싶다"));
        this.commentRepository.save(new Comment(u.getId(),"흠"));
    }

    @Override
    public List<CommentUsernameProtocol> listAllContents() {
        List<CommentUsernameProtocol> cupList = new ArrayList<CommentUsernameProtocol>();

        List<Comment> commentList = this.commentRepository.findAll();
        commentList.forEach(comment -> {
            this.userRepository.findById(comment.getUserId())
                    .map(fu -> {
                        cupList.add(new CommentUsernameProtocol(comment, fu.getUsername()));
                        return fu;
                    })
                    .orElseGet(() -> {
                        cupList.add(new CommentUsernameProtocol(comment, null));
                        return null;
                    });
//            Optional<User> found = this.userRepository.findById(comment.getUserId());
//
//            String username = null;
//            if(found.isPresent()) {
//                username = found.get().getUsername();
//                logger.info(username);
//                }
//            CommentUsernameProtocol cup = new CommentUsernameProtocol(comment, username);
//            System.out.println(cup.toString());
//            cupList.add(cup);
        });
        return cupList;
    }

    @Override
    public CommentUsernameProtocol add(Comment c) {
//        return this.commentRepository.findById(c.getId())
//                .map(fc -> {
//                    return null;
//                })
//                .orElse(
//                );
        System.out.println(c);
        Comment nc = this.commentRepository.save(c);

        return this.userRepository.findById(nc.getUserId())
                .map(fu -> {
                    CommentUsernameProtocol cup = new CommentUsernameProtocol(nc, fu.getUsername());
                    System.out.println(cup);
                    return cup;
                })
                .orElse(new CommentUsernameProtocol(nc, null));
    }

    @Override
    public CommentUsernameProtocol view(Long id) {
        return this.commentRepository.findById(id)
            .map(fc -> {
                return this.userRepository.findById(fc.getUserId())
                        .map(fu -> {
                            return new CommentUsernameProtocol(fc, fu.getUsername());
                        })
                        .orElseGet(() -> {
                            return new CommentUsernameProtocol(fc, null);
                        });
            })
            .orElse(null);
    }

    @Override
    public CommentUsernameProtocol update(Comment c) {
        return this.commentRepository.findById(c.getId())
                .map(fc -> {
                    fc.setUserId(c.getUserId());
                    fc.setContent(c.getContent());
                    logger.info(this.commentRepository.save(fc).toString());
                    return this.userRepository.findById(fc.getUserId())
                            .map(fu -> {
                                logger.info(fu.getUsername());
                                return new CommentUsernameProtocol(fc, fu.getUsername());
                            })
                            .orElseGet(() -> {
                                return new CommentUsernameProtocol(fc, null);
                            });
                })
                .orElse(null);
    }

    @Override
    public boolean delete(Long id) {
        try {
            return this.commentRepository.findById(id)
                    .map(fc -> {
                        this.commentRepository.delete(fc);
                        return true;
                    })
                    .orElse(null);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public AttachmentProtocol getCommentImage(Long id) {
        Optional<Comment> found = this.commentRepository.findById(id);
        if(!found.isPresent())
            return null;
        return new AttachmentProtocol(found.get().getStoredPath(), found.get().getOriginName());
    }
}
