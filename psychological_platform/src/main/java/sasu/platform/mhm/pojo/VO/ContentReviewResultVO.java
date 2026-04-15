package sasu.platform.mhm.pojo.vo;

import lombok.Data;

import java.util.List;

@Data
public class ContentReviewResultVO {
    private String id;
    private String status;
    private String reason;
    private List<String> finalUrls;
}
