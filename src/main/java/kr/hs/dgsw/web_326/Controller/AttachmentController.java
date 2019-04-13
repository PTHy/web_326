package kr.hs.dgsw.web_326.Controller;

import kr.hs.dgsw.web_326.Domain.Comment;
import kr.hs.dgsw.web_326.Protocol.AttachmentProtocol;
import kr.hs.dgsw.web_326.Repository.CommentRepository;
import kr.hs.dgsw.web_326.Repository.UserRepository;
import kr.hs.dgsw.web_326.Service.CommentService;
import kr.hs.dgsw.web_326.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import kr.hs.dgsw.web_326.Domain.User;
import java.io.*;

import java.net.URLConnection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@RestController
public class AttachmentController {

    @Autowired
    private UserService userService;
    @Autowired
    private CommentService commentService;

    @PostMapping("/attachment")
    public AttachmentProtocol upload(@RequestPart MultipartFile uploadFile) {
        String destFilename = "D:/Dev/Spring/web_326/src/main/java/kr/hs/dgsw/web_326/upload/"
                                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                                + UUID.randomUUID().toString() + "_"
                                + uploadFile.getOriginalFilename();

        // ..../upload/2019/04/02/asdf-asdf-asf-adsf

        try {
            File destFile = new File(destFilename);
            destFile.getParentFile().mkdirs();
            uploadFile.transferTo(destFile);
            return new AttachmentProtocol(destFilename, uploadFile.getOriginalFilename());
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    @GetMapping("/attachment/{type}/{id}")
    public void download(@PathVariable String type, @PathVariable Long id, HttpServletRequest req, HttpServletResponse res)
    {
        try {
            AttachmentProtocol ap = null;
            String filePath, fileName;
            if (type.equals("user")) {
                ap = userService.getProfileImage(id);
            }
            else if (type.equals("comment")) {
                ap = commentService.getCommentImage(id);
            }

            if (ap == null) {
                System.out.println("File Not Found");
                return;
            }

            filePath = ap.getStoredPath();
            fileName = ap.getOriginName();

            File file = new File(filePath);

            if (!file.exists()) return;

            String mimeType = URLConnection.guessContentTypeFromName(file.getName());
            if (mimeType == null) mimeType = "application/octet-stream";

            res.setContentType(mimeType);
            res.setHeader("Content-Disposition", "inline; filename=\"" + fileName + "\"");
            res.setContentLength((int) file.length());

            InputStream is = new BufferedInputStream(new FileInputStream(file));
            FileCopyUtils.copy(is, res.getOutputStream());
        } catch (Exception ex) {
            System.out.println(ex);
        }
    }

    @GetMapping("/attachment")
    public void download(HttpServletRequest req, HttpServletResponse res)
    {
        try {
            String filePath = "D:\\Dev\\Spring\\web_326\\src\\main\\java\\kr\\hs\\dgsw\\web_326\\upload\\2019\\04\\05cffc7e87-10e4-4286-9164-7adcb3d3027a_47014401_504815266676146_8235251953563598848_n.jpg";
            String fileName = "47014401_504815266676146_8235251953563598848_n.jpg";

            File file = new File(filePath);

            if (!file.exists()) return;

            String mimeType = URLConnection.guessContentTypeFromName(file.getName());
            if (mimeType == null) mimeType = "application/octet-stream";

            res.setContentType(mimeType);
            res.setHeader("Content-Disposition", "inline; filename=\"" + fileName + "\"");
            res.setContentLength((int) file.length());

            InputStream is = new BufferedInputStream(new FileInputStream(file));
            FileCopyUtils.copy(is, res.getOutputStream());

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }
}
