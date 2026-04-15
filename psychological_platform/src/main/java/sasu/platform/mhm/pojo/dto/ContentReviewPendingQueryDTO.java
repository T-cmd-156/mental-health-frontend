package sasu.platform.mhm.pojo.dto;

import lombok.Data;

@Data
public class ContentReviewPendingQueryDTO {
    private Integer page = 1;
    private Integer pageSize = 10;
    private String sourceType;
    private String keyword;
    private String status;
}
