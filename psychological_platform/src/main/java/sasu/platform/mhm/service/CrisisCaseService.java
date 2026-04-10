package sasu.platform.mhm.service;

import org.springframework.stereotype.Service;
import sasu.platform.mhm.pojo.vo.CrisistLevelVO;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.dto.CrisisListQueryDTO;
import sasu.platform.mhm.pojo.dto.CrisisReportCreateDTO;
import sasu.platform.mhm.pojo.dto.CrisistLevelDTO;

@Service
public interface CrisisCaseService {

    boolean report(CrisisReportCreateDTO crisisReportCreateDTO);

    PageResult getCrisisList(Integer page, Integer pageSize, CrisisListQueryDTO crisisListQueryDTO);

    CrisistLevelVO setLevel(CrisistLevelDTO crisistLevelDTO);
}


