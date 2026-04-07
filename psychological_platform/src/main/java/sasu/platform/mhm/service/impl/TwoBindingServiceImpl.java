package sasu.platform.mhm.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import sasu.platform.mhm.mapper.TwoBindingMapper;
import sasu.platform.mhm.pojo.common.ParentStudentBindStatus;
import sasu.platform.mhm.service.TwoBindingService;

@Service
@Slf4j
@RequiredArgsConstructor
public class TwoBindingServiceImpl implements TwoBindingService {
    private final TwoBindingMapper twoBindingMapper;

    @Override
    public int getStatus(String studentId) {
//        log.info("查询绑定状态1:{}",studentId);
        Integer status = twoBindingMapper.getStatus(studentId);
//        log.info("查询绑定状态:{}",status);
        //默认未绑定
        return status != null ? status : -1;
    }

    @Override
    public void confirmBind(String studentId) {
        twoBindingMapper.confirmBind(studentId,ParentStudentBindStatus.VERIFIED.getCode());
    }

    @Override
    public void RejectBind(String studentId) {
        twoBindingMapper.confirmBind(studentId,ParentStudentBindStatus.REJECTED.getCode());
    }

}
