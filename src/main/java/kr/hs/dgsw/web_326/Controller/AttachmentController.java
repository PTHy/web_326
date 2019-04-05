package kr.hs.dgsw.web_326.Controller;

import kr.hs.dgsw.web_326.Protocol.AttachmentProtocol;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RestController
public class AttachmentController {
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
}
