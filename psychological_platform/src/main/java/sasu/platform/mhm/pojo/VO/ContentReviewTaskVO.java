package sasu.platform.mhm.pojo.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ContentReviewTaskVO {
    private String id;
    private String sourceType;
    private String title;
    private String description;
    private String status;
    private String submitterId;
    private String submitterName;
    private String reviewerId;
    private String reviewerName;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private List<ContentReviewFileVO> files;
}
