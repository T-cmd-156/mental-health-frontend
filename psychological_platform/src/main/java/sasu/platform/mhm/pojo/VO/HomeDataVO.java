package sasu.platform.mhm.pojo.vo;

import lombok.Data;
import sasu.platform.mhm.pojo.common.PageResult;

import java.util.Map;

/**
 * 首页聚合数据（通知、活动等）
 */
@Data
public class HomeDataVO {

    private Map<String, Object> stats;

    private PageResult notices;

    private PageResult activities;
}
