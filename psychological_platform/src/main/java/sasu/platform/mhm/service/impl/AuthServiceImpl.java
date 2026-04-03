package sasu.platform.mhm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import sasu.platform.mhm.mapper.UserMapper;
import sasu.platform.mhm.pojo.dto.AuthRegisterDTO;
import sasu.platform.mhm.pojo.dto.AuthSendSmsDTO;
import sasu.platform.mhm.pojo.entity.User;
import sasu.platform.mhm.service.AuthService;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements AuthService {

    private static final String SMS_CACHE_PREFIX = "register:sms:";

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Override
    public void sendRegisterSmsCode(AuthSendSmsDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("请求参数不能为空");
        }
        String phone = normalizePhone(dto.getPhone(), dto.getMobile());
        validatePhone(phone);

        // 开发阶段固定验证码，便于联调；后续可替换为真实短信发送逻辑
        redisTemplate.opsForValue().set(SMS_CACHE_PREFIX + phone, "123456", 5, TimeUnit.MINUTES);
    }

    @Override
    public void register(AuthRegisterDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("请求参数不能为空");
        }

        String username = firstNonBlank(dto.getAccount(), dto.getUsername());
        String realName = firstNonBlank(dto.getName(), dto.getReal_name());
        String phone = normalizePhone(dto.getPhone(), dto.getMobile());
        String roleCode = normalizeRoleCode(dto.getRole());

        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("账号不能为空");
        }
        if (!StringUtils.hasText(dto.getPassword())) {
            throw new IllegalArgumentException("密码不能为空");
        }
        if (!StringUtils.hasText(realName)) {
            throw new IllegalArgumentException("姓名不能为空");
        }
        if (!StringUtils.hasText(roleCode)) {
            throw new IllegalArgumentException("角色不能为空");
        }
        validatePhone(phone);
        if (!StringUtils.hasText(dto.getSmsCode())) {
            throw new IllegalArgumentException("短信验证码不能为空");
        }

        String cachedCode = redisTemplate.opsForValue().get(SMS_CACHE_PREFIX + phone);
        if (!dto.getSmsCode().equals(cachedCode)) {
            throw new IllegalArgumentException("短信验证码错误或已过期");
        }

        if (userMapper.selectByUsername(username) != null) {
            throw new IllegalArgumentException("账号已存在");
        }
        User existedByPhone = userMapper.selectByPhone(phone);
        if (existedByPhone != null) {
            throw new IllegalArgumentException("手机号已被注册");
        }

        String roleId = userMapper.selectRoleIdByCode(roleCode);
        if (!StringUtils.hasText(roleId)) {
            roleId = userMapper.selectRoleIdByCode(roleCode.toUpperCase());
        }
        if (!StringUtils.hasText(roleId)) {
            throw new IllegalArgumentException("角色不存在: " + roleCode);
        }

        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(phone);
        user.setEmail(dto.getEmail());
        user.setRealName(realName);
        user.setGender(mapGender(dto.getGender()));
        user.setAccountStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.insertUser(user);
        userMapper.insertUserRoleMapping(UUID.randomUUID().toString(), user.getUserId(), roleId);
        redisTemplate.delete(SMS_CACHE_PREFIX + phone);
    }

    private Integer mapGender(Integer gender) {
        if (gender == null) {
            return null;
        }
        // 前端约定: 0-女,1-男；数据库约定: 1-男,2-女
        if (gender == 0) {
            return 2;
        }
        if (gender == 1) {
            return 1;
        }
        return gender;
    }

    private String normalizeRoleCode(String role) {
        if (!StringUtils.hasText(role)) {
            return null;
        }
        return role.trim();
    }

    private void validatePhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            throw new IllegalArgumentException("手机号不能为空");
        }
        if (!phone.matches("^1[3-9]\\d{9}$")) {
            throw new IllegalArgumentException("手机号格式不正确");
        }
    }

    private String normalizePhone(String phone, String mobile) {
        return firstNonBlank(phone, mobile);
    }

    private String firstNonBlank(String v1, String v2) {
        if (StringUtils.hasText(v1)) {
            return v1.trim();
        }
        if (StringUtils.hasText(v2)) {
            return v2.trim();
        }
        return null;
    }
}
