package sasu.platform.mhm.pojo.vo;

import lombok.Data;

import java.util.List;

/**
 * 开始测评返回 VO
 */
@Data
public class AssessmentStartVO {

    private String recordId;

    private AssessmentPlanVO plan;

    private List<AssessmentQuestionVO> questions;
}

