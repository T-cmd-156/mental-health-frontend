package sasu.platform.mhm.service;

import sasu.platform.mhm.pojo.dto.AuthRegisterDTO;
import sasu.platform.mhm.pojo.dto.AuthSendSmsDTO;

public interface AuthService {
    void sendRegisterSmsCode(AuthSendSmsDTO dto);

    void register(AuthRegisterDTO dto);
}
