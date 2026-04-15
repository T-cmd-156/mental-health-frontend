package sasu.platform.mhm.pojo.common;

import lombok.Getter;

/**
 * 家长学生绑定状态枚举
 * 0:待学生确认 1:已验证 2:已拒绝
 */
@Getter
public enum ParentStudentBindStatus {

    /**
     * 待学生确认（家长已发起绑定）
     */
    PENDING_CONFIRM(0, "待学生确认"),

    /**
     * 已验证（学生已确认）
     */
    VERIFIED(1, "已验证"),

    /**
     * 已拒绝（学生已拒绝）
     */
    REJECTED(2, "已拒绝");

    // getter
    // 状态码
    private final Integer code;

    // 状态描述
    private final String desc;

    // 构造方法
    ParentStudentBindStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    /**
     * 根据 code 获取枚举
     */
    public static ParentStudentBindStatus getByCode(Integer code) {
        if (code == null) {
            return null;
        }
        for (ParentStudentBindStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }

}
