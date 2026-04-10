package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.dto.PreAssessmentSubmitDTO;
import sasu.platform.mhm.service.PreAssessmentService;

import java.util.Map;

/**
 * 学生提交前测量表接口（写入 pre_assessment 表）
 */
@Slf4j
@RestController
@RequestMapping("/api/pre-assessment")
public class PreAssessmentController {

    @Autowired
    private PreAssessmentService preAssessmentService;

    /**
     * 提交前测量表（电子/手写）
     *
     * 共同必填：appointmentId、scaleType、scaleName、totalScore
     * 电子版必填：assessmentData
     * 手写版必填：handwrittenScaleFile
     */
    @PostMapping("/submit")
    public R submit(@RequestParam(required = false) String appointmentId,
                    @RequestParam(required = false) String scaleType,
                    @RequestParam(required = false) String scaleName,
                    @RequestParam(required = false) Integer totalScore,
                    @RequestParam(required = false) String scoreInterpretation,
                    @RequestParam(required = false) String assessmentData,
                    @RequestParam(required = false) MultipartFile handwrittenScaleFile) {

        // 参数验证
        if (scaleType == null || scaleType.trim().isEmpty()) {
            return R.error("量表类型(scaleType)不能为空");
        }
        if (scaleName == null || scaleName.trim().isEmpty()) {
            return R.error("量表名称(scaleName)不能为空");
        }
        if (totalScore == null) {
            return R.error("总分(totalScore)不能为空");
        }

        // 至少需要提供电子版数据或手写版文件之一
        boolean hasAssessmentData = assessmentData != null && !assessmentData.trim().isEmpty();
        boolean hasHandwrittenFile = handwrittenScaleFile != null && !handwrittenScaleFile.isEmpty();

        if (!hasAssessmentData && !hasHandwrittenFile) {
            return R.error("请提供评估数据(assessmentData)或上传手写量表文件(handwrittenScaleFile)");
        }

        PreAssessmentSubmitDTO dto = new PreAssessmentSubmitDTO();
        dto.setAppointmentId(appointmentId);
        dto.setScaleType(scaleType);
        dto.setScaleName(scaleName);
        dto.setTotalScore(totalScore);
        dto.setScoreInterpretation(scoreInterpretation);
        dto.setAssessmentData(assessmentData);
        dto.setHandwrittenScaleFile(handwrittenScaleFile);

        Map<String, Object> res = preAssessmentService.submit(dto);
        return R.success("提交成功", res);
    }

}


