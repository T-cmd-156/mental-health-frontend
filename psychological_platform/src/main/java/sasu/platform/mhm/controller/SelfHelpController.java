package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.dto.PageQueryDTO;
import sasu.platform.mhm.pojo.vo.CmsContentVO;
import sasu.platform.mhm.service.CmsService;

/**
 * 心理自助（文章列表等与 CMS 栏目对齐；点赞/收藏暂无独立表，先返回成功占位）
 */
@Slf4j
@RestController
@RequestMapping("/api/self-help")
public class SelfHelpController {

    private static final int DEFAULT_TYPE = 4;

    @Autowired
    private CmsService cmsService;

    @GetMapping("/list")
    public R<PageResult> list(PageQueryDTO query) {
        if (query == null) {
            query = new PageQueryDTO();
        }
        normalizePaging(query);
        Integer type = query.getType();
        if (type == null || type < 1 || type > 5) {
            type = DEFAULT_TYPE;
            query.setType(type);
        }
        log.info("自助文章列表: type={}, page={}", type, query.getPage());
        PageResult result = cmsService.getCmss(1, query);
        return R.success(result);
    }

    @GetMapping("/detail")
    public R<CmsContentVO> detail(@RequestParam Long id) {
        log.info("自助文章详情: id={}", id);
        return R.success(cmsService.getCmsDetail(id));
    }

    @PostMapping("/like")
    public R<String> like(@RequestParam Long id) {
        log.info("自助文章点赞(占位): id={}", id);
        return R.success("操作成功");
    }

    @PostMapping("/collect")
    public R<String> collect(@RequestParam Long id) {
        log.info("自助文章收藏(占位): id={}", id);
        return R.success("操作成功");
    }

    private static void normalizePaging(PageQueryDTO query) {
        if (query.getPage() == null || query.getPage() < 1) {
            query.setPage(1);
        }
        if (query.getPageSize() == null || query.getPageSize() < 1) {
            query.setPageSize(10);
        }
    }
}
