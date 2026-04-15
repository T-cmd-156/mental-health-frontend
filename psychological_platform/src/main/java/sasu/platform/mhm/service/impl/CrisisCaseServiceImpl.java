package sasu.platform.mhm.service.impl;

import cn.hutool.core.util.IdUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import sasu.platform.mhm.mapper.CrisisReportMapper;
import sasu.platform.mhm.pojo.vo.CrisisReportVO;
import sasu.platform.mhm.pojo.vo.CrisistLevelVO;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.dto.CrisisListQueryDTO;
import sasu.platform.mhm.pojo.dto.CrisisReportCreateDTO;
import sasu.platform.mhm.pojo.dto.CrisistLevelDTO;
import sasu.platform.mhm.service.CrisisCaseService;

import java.util.List;

@Service
public class CrisisCaseServiceImpl implements CrisisCaseService {

    @Autowired
    CrisisReportMapper crisisReportMapper;

    /**
     * 学生端自助上报时前端可省略咨询师：使用库中真实存在的 counselor_id（与 counselor_info 外键一致）
     */
    @Value("${crisis.default-counselor-id:}")
    private String defaultCounselorId;

    @Override
    public boolean report(CrisisReportCreateDTO crisisReportCreateDTO) {
        if (crisisReportCreateDTO.getStudentId() == null || crisisReportCreateDTO.getStudentId().trim().isEmpty()) {
            throw new RuntimeException("学生ID(studentId)不能为空");
        }
        if (!StringUtils.hasText(crisisReportCreateDTO.getCounselorId())) {
            if (StringUtils.hasText(defaultCounselorId)) {
                crisisReportCreateDTO.setCounselorId(defaultCounselorId.trim());
            } else {
                throw new RuntimeException("咨询师ID(counselorId)不能为空，请在 application.yml 配置 crisis.default-counselor-id 为 counselor_info 表中存在的 counselor_id");
            }
        }

        // 表字段 report_type / incident_description / risk_assessment 为 NOT NULL，补全默认值避免插入失败
        if (!StringUtils.hasText(crisisReportCreateDTO.getReportType())) {
            crisisReportCreateDTO.setReportType("OTHER");
        }
        if (!StringUtils.hasText(crisisReportCreateDTO.getIncidentDescription())) {
            crisisReportCreateDTO.setIncidentDescription("（学生端未填写详情）");
        }
        if (!StringUtils.hasText(crisisReportCreateDTO.getRiskAssessment())) {
            crisisReportCreateDTO.setRiskAssessment("待评估");
        }

        //设置唯一ID
        crisisReportCreateDTO.setReportId(IdUtil.randomUUID());

        crisisReportMapper.report(crisisReportCreateDTO);
        return true;
    }


    @Override
    public PageResult getCrisisList(Integer page, Integer pageSize, CrisisListQueryDTO crisisListQueryDTO) {
        // 设置分页参数
        PageHelper.startPage(page,pageSize);
        // 从DTO中获取查询参数，传递给Mapper层
        List<CrisisReportVO> empList = crisisReportMapper.getCrisisList(crisisListQueryDTO.getCrisis_level(),
                crisisListQueryDTO.getReport_status(),
                crisisListQueryDTO.getCollege()
        );
        // 获取分页结果
        // 使用 PageInfo 获取分页结果
        PageInfo<CrisisReportVO> pageInfo = new PageInfo<>(empList);
        // 封装 PageResult
        PageResult pageResult = new PageResult(pageInfo.getTotal(), pageInfo.getList());
        return pageResult;
    }

    @Override
    public CrisistLevelVO setLevel(CrisistLevelDTO crisistLevelDTO) {
        if (crisisReportMapper.setLevel(crisistLevelDTO)){
            CrisistLevelVO result = new CrisistLevelVO();
            result.setCrisisLevel(crisistLevelDTO.getCrisisLevel());
            result.setReportId(crisistLevelDTO.getReportId());
            return result;
        }
        return null;
    }
}

