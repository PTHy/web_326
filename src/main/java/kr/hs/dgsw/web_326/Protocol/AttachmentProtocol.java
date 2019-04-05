package kr.hs.dgsw.web_326.Protocol;

import lombok.Data;

@Data
public class AttachmentProtocol {
    private String storedPath;
    private String originName;

    public AttachmentProtocol (String storedPath, String originName) {
        this.storedPath = storedPath;
        this.originName = originName;
    }
}
