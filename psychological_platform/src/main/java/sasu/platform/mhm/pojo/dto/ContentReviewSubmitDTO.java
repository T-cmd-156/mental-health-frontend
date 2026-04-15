package sasu.platform.mhm.pojo.dto;

import lombok.Data;

import java.util.List;

@Data
public class ContentReviewSubmitDTO {
    private String sourceType;
    private String title;
    private String description;
    private List<ContentReviewFileItemDTO> files;
    private String clientBatchId;
}
