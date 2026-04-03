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
    public R<String> sendSms(@RequestBody AuthSendSmsDTO dto) {
        log.info("发送注册短信验证码");
        authService.sendRegisterSmsCode(dto);
        return R.success("发送成功");
    }

    @PostMapping("/register")
    public R<String> register(@RequestBody AuthRegisterDTO dto) {
        log.info("用户注册: role={}", dto == null ? null : dto.getRole());
        authService.register(dto);
        return R.success("注册成功");
    }
}
