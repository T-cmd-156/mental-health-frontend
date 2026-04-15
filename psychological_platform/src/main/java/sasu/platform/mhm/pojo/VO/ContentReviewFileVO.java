package sasu.platform.mhm.pojo.vo;

import lombok.Data;

@Data
public class ContentReviewFileVO {
    private String fileId;
    private String reviewId;
    private String objectKey;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String previewUrl;
    private String finalUrl;
    private Integer sortIndex;
}
