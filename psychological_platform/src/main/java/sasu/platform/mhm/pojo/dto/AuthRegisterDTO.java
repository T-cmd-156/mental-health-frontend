package sasu.platform.mhm.pojo.dto;

import lombok.Data;

@Data
public class AuthRegisterDTO {
    private String account;
    private String username;
    private String password;
    private String name;
    private String real_name;
    private String role;
    private String phone;
    private String mobile;
    private String smsCode;
    private String email;
    private Integer gender;
}
