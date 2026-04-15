package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.dto.AuthRegisterDTO;
import sasu.platform.mhm.pojo.dto.AuthSendSmsDTO;
import sasu.platform.mhm.service.AuthService;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/send-sms")
    public R<String> sendSms(@RequestBody(required = false) AuthSendSmsDTO dto) {
        if (dto == null || (dto.getPhone() == null && dto.getMobile() == null)) {
            return R.error("请提供手机号(phone 或 mobile)");
        }

        String phone = dto.getPhone() != null ? dto.getPhone() : dto.getMobile();

        // 创建新的 DTO 对象传递给 Service
        AuthSendSmsDTO validDto = new AuthSendSmsDTO();
        validDto.setPhone(phone);
        validDto.setMobile(phone);

        log.info("发送注册短信验证码到: {}", phone);
        authService.sendRegisterSmsCode(validDto);
        return R.success("发送成功");
    }


    @PostMapping("/register")
    public R<String> register(@RequestBody(required = false) AuthRegisterDTO dto) {
        if (dto == null) {
            return R.error("请提供注册信息");
        }

        // 基本参数验证
        if (dto.getPhone() == null || dto.getPhone().trim().isEmpty()) {
            return R.error("手机号不能为空");
        }
        if (dto.getSmsCode() == null || dto.getSmsCode().trim().isEmpty()) {
            return R.error("验证码不能为空");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            return R.error("密码不能为空");
        }
        if (dto.getRole() == null || dto.getRole().trim().isEmpty()) {
            return R.error("角色不能为空");
        }

        log.info("用户注册: role={}, phone={}", dto.getRole(), dto.getPhone());
        authService.register(dto);
        return R.success("注册成功");
    }
}
