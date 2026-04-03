package sasu.platform.mhm.pojo.dto;

import lombok.Data;

@Data
public class ContentReviewFileItemDTO {
    private String objectKey;
    private String fileId;
    private String fileName;
    private Long fileSize;
    private String mimeType;
}
