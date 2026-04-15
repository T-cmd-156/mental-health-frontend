package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.dto.PageQueryDTO;
import sasu.platform.mhm.pojo.vo.CmsContentVO;
import sasu.platform.mhm.service.CmsService;

/**
 * 心理美文/百科类文章（与 CMS type=5 心理美文 对齐；传 id 时返回单篇详情）
 */
@Slf4j
@RestController
@RequestMapping("/api/psychology")
public class PsychologyController {

    private static final int ARTICLE_TYPE = 5;

    @Autowired
    private CmsService cmsService;

    @GetMapping("/article")
    public R<?> article(PageQueryDTO query, @RequestParam(required = false) Long id) {
        if (id != null) {
            log.info("心理文章详情: id={}", id);
            CmsContentVO detail = cmsService.getCmsDetail(id);
            return R.success(detail);
        }
        if (query == null) {
            query = new PageQueryDTO();
        }
        if (query.getPage() == null || query.getPage() < 1) {
            query.setPage(1);
        }
        if (query.getPageSize() == null || query.getPageSize() < 1) {
            query.setPageSize(10);
        }
        query.setType(ARTICLE_TYPE);
        log.info("心理文章列表: page={}, pageSize={}", query.getPage(), query.getPageSize());
        PageResult result = cmsService.getCmss(1, query);
        return R.success(result);
    }
}
