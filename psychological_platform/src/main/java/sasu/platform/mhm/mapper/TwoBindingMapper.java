package sasu.platform.mhm.mapper;

import org.apache.ibatis.annotations.Mapper;
import sasu.platform.mhm.pojo.common.ParentStudentBindStatus;

@Mapper
public interface TwoBindingMapper {
    int getStatus(String studentId);


    void confirmBind(String studentId,Integer Status);
}
