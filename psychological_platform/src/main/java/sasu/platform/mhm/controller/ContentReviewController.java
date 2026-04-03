package sasu.platform.mhm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.common.R;
import sasu.platform.mhm.pojo.dto.ContentReviewApproveDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewPendingQueryDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewRejectDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewSubmitDTO;
import sasu.platform.mhm.pojo.vo.ContentReviewResultVO;
import sasu.platform.mhm.pojo.vo.ContentReviewTaskVO;
import sasu.platform.mhm.service.ContentReviewService;

import java.util.Arrays;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/center/content-review")
public class ContentReviewController {

    @Autowired
    private ContentReviewService contentReviewService;

    @PostMapping("/submit")
    public R<ContentReviewResultVO> submit(@RequestBody ContentReviewSubmitDTO dto) {
        log.info("提交内容审核任务: sourceType={}", dto == null ? null : dto.getSourceType());
        return R.success(contentReviewService.submit(dto));
    }

    @GetMapping("/pending")
    public R<PageResult> pending(ContentReviewPendingQueryDTO query) {
        log.info("查询审核任务列表: {}", query);
        return R.success(contentReviewService.pendingList(query));
    }

    @PostMapping("/approve")
    public R<ContentReviewResultVO> approve(@RequestBody ContentReviewApproveDTO dto) {
        log.info("通过审核: id={}", dto == null ? null : dto.getId());
        return R.success(contentReviewService.approve(dto));
    }

    @PostMapping("/reject")
    public R<String> reject(@RequestBody ContentReviewRejectDTO dto) {
        log.info("拒绝审核: id={}", dto == null ? null : dto.getId());
        contentReviewService.reject(dto);
        return R.success("已拒绝");
    }

    @GetMapping("/{id}")
    public R<ContentReviewTaskVO> detail(@PathVariable("id") String id) {
        log.info("审核详情: id={}", id);
        return R.success(contentReviewService.detail(id));
    }

    @GetMapping("/result")
    public R<?> result(@RequestParam(required = false) String id,
                       @RequestParam(required = false) String ids) {
        if (id != null && !id.isBlank()) {
            return R.success(contentReviewService.getResult(id));
        }
        if (ids != null && !ids.isBlank()) {
            List<String> idList = Arrays.stream(ids.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            return R.success(contentReviewService.getResultBatch(idList));
        }
        return R.error("id 或 ids 至少传一个", 400);
    }
}
