package sasu.platform.mhm.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sasu.platform.mhm.mapper.ConsulateMapper;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.dto.AppointmentDTO;
import sasu.platform.mhm.pojo.dto.ConsultationScheduleDTO;
import sasu.platform.mhm.pojo.dto.PageQueryDTO;
import sasu.platform.mhm.pojo.entity.Appointment;
import sasu.platform.mhm.pojo.entity.ConsultationSchedule;
import sasu.platform.mhm.pojo.entity.UserDetailsImpl;
import sasu.platform.mhm.pojo.vo.CounselorDetailVO;
import sasu.platform.mhm.pojo.vo.CounselorVO;
import sasu.platform.mhm.service.ConsulateService;
import sasu.platform.mhm.util.ConsultationScheduleBuilderConverter;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ConsulateServiceImpl implements ConsulateService {
    @Autowired
    private ConsultationScheduleBuilderConverter consultationScheduleBuilderConverter;
    @Autowired
    private ConsulateMapper consulateMapper;
    @Autowired
    private RedisTemplate redisTemplate;
    @Override
    public boolean setConsultationTime(ConsultationScheduleDTO consultationScheduleDTO) {
        //获取当前用户的个人信息SecurityContextHolder
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userDetails.getUser().getUserId();
        //将ConsultationScheduleDTO转换为ConsultationSchedule
        ConsultationSchedule consultationSchedule = consultationScheduleBuilderConverter.toEntity(consultationScheduleDTO);
        consultationSchedule.setUserId(userId);
        //将ConsultationSchedule保存到数据库中
        boolean result = consulateMapper.insertConsultationSchedule(consultationSchedule);
        log.info("用户id为：{}", userId);
        return true;
    }

    @Override
    @Transactional
    public Map<Boolean, String> makeAppointment(AppointmentDTO appointmentDTO) {
        // 获取当前用户信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 参数验证
        if (appointmentDTO.getScheduleId() == null || appointmentDTO.getScheduleId().trim().isEmpty()) {
            throw new RuntimeException("排班ID(scheduleId)不能为空");
        }
        if (appointmentDTO.getAppointmentType() == null || appointmentDTO.getAppointmentType().trim().isEmpty()) {
            throw new RuntimeException("预约类型(appointmentType)不能为空");
        }

        // 验证排班是否存在
        ConsultationSchedule schedule = consulateMapper.getScheduleInfoByScheduleId(appointmentDTO.getScheduleId());
        if (schedule == null) {
            throw new RuntimeException("排班不存在");
        }

        //将预约信息存储到数据库中
        Appointment appointment = Appointment.builder()
                .userId(userDetails.getUser().getUserId())
                .scheduleId(appointmentDTO.getScheduleId())
                .appointmentType(appointmentDTO.getAppointmentType())
                .consultationMode(appointmentDTO.getConsultationMode())
                .location(appointmentDTO.getLocation())
                .appointmentStatus("待处理")
                .isUrgent(appointmentDTO.getIsUrgent())
                .notes(appointmentDTO.getNotes())
                .build();
        //获取预约时间段的相关信息
        boolean result = consulateMapper.insertAppointment(appointment);
        return Map.of(result, result ? "预约成功" : "预约失败");
    }


    @Override
    public PageResult getScheduleByParams(PageQueryDTO pageQueryDTO) {
        if (pageQueryDTO.getPage() == null || pageQueryDTO.getPageSize() == null) {
            pageQueryDTO.setPage(1);
            pageQueryDTO.setPageSize(10);
        }
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());
        Page<ConsultationSchedule> appointmentVOS = consulateMapper.getScheduleByParams(pageQueryDTO);
        return new PageResult(appointmentVOS.getTotal(), appointmentVOS.getResult());
    }

    @Override
    public PageResult counselorList(PageQueryDTO pageQueryDTO) {
        if (pageQueryDTO.getPage() == null || pageQueryDTO.getPageSize() == null) {
            pageQueryDTO.setPage(1);
            pageQueryDTO.setPageSize(10);
        }
        PageHelper.startPage(pageQueryDTO.getPage(), pageQueryDTO.getPageSize());
        List<ConsultationSchedule> scheduleList = consulateMapper.getScheduleByParams(pageQueryDTO);
        PageInfo<ConsultationSchedule> pageInfo = new PageInfo<>(scheduleList);
        return new PageResult(pageInfo.getTotal(), pageInfo.getList());
    }

    @Override
    public CounselorDetailVO getCounselorDetail(String counselorId) {
        if (counselorId == null || counselorId.trim().isEmpty()) {
            throw new RuntimeException("咨询师ID不能为空");
        }

        CounselorDetailVO detailVO = consulateMapper.getCounselorDetail(counselorId);
        if (detailVO == null) {
            throw new RuntimeException("咨询师不存在");
        }

        //获取咨询师的咨询时间段安排
        detailVO.setConsultationSchedule(consulateMapper.getScheduleByCounselorId(counselorId));
        return detailVO;
    }

}
