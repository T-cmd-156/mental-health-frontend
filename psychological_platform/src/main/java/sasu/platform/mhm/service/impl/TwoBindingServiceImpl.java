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
       return twoBindingMapper.getStatus(studentId);
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
