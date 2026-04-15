package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sasu.platform.mhm.pojo.common.ParentStudentBindStatus;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.entity.User;
import sasu.platform.mhm.service.TwoBindingService;
import sasu.platform.mhm.service.UserService;

@Slf4j
@RestController
@RequestMapping("/api/bind")
public class TwoBindingController {

    @Autowired
    public TwoBindingService twoBindingService;

    @GetMapping("/status/{studentId}")
    public R<Integer> BindRequests(@PathVariable("studentId") String studentId){
        if(studentId != null){
           int Status = twoBindingService.getStatus(studentId);
           return R.success("查询成功",Status);
        }
        return R.error("参数为空");
    }

    @PostMapping("/confirm/{studentId}")
    public R ConfirmBind(@PathVariable("studentId") String studentId){
        if(studentId != null){
            int Status = twoBindingService.getStatus(studentId);
            if(Status != 1){
                twoBindingService.confirmBind(studentId);
                return R.success("确认绑定成功");
            }
            return R.error("该学生已绑定");
        }
        return R.error("参数为空");
    }

    @PostMapping("/reject/{studentId}")
    public R RejectBind(@PathVariable("studentId") String studentId){
        if(studentId != null){
            int Status = twoBindingService.getStatus(studentId);
            if(Status != 1 ){
                twoBindingService.RejectBind(studentId);
                return R.success("拒绝绑定");
            }
            return R.error("该学生已绑定");
        }
        return R.error("参数为空");
    }
}
