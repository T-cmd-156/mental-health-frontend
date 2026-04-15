package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.dto.ActivityListQueryDTO;
import sasu.platform.mhm.pojo.dto.NoticeListQueryDTO;
import sasu.platform.mhm.pojo.vo.HomeDataVO;
import sasu.platform.mhm.service.ActivityService;
import sasu.platform.mhm.service.NoticeService;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/data")
    public R<HomeDataVO> data() {
        NoticeListQueryDTO noticeQuery = new NoticeListQueryDTO();
        noticeQuery.setPage(1);
        noticeQuery.setPageSize(10);
        noticeQuery.setStatus(1);
        PageResult notices = noticeService.list(noticeQuery);

        ActivityListQueryDTO activityQuery = new ActivityListQueryDTO();
        activityQuery.setPage(1);
        activityQuery.setPageSize(10);
        PageResult activities = activityService.list(activityQuery);

        Map<String, Object> stats = new HashMap<>();
        stats.put("noticeTotal", notices.getTotal());
        stats.put("activityTotal", activities.getTotal());

        HomeDataVO vo = new HomeDataVO();
        vo.setStats(stats);
        vo.setNotices(notices);
        vo.setActivities(activities);
        log.debug("首页数据: notices.total={}, activities.total={}", notices.getTotal(), activities.getTotal());
        return R.success(vo);
    }
}
