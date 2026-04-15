package sasu.platform.mhm.service.impl;

import cn.hutool.core.util.IdUtil;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import sasu.platform.mhm.mapper.ContentReviewMapper;
import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.dto.ContentReviewApproveDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewFileItemDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewPendingQueryDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewRejectDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewSubmitDTO;
import sasu.platform.mhm.pojo.entity.UserDetailsImpl;
import sasu.platform.mhm.pojo.vo.ContentReviewFileVO;
import sasu.platform.mhm.pojo.vo.ContentReviewResultVO;
import sasu.platform.mhm.pojo.vo.ContentReviewTaskVO;
import sasu.platform.mhm.service.ContentReviewService;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContentReviewServiceImpl implements ContentReviewService {

    @Autowired
    private ContentReviewMapper contentReviewMapper;

    @Override
    public ContentReviewResultVO submit(ContentReviewSubmitDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("请求参数不能为空");
        }
        if (!StringUtils.hasText(dto.getSourceType())) {
            throw new IllegalArgumentException("sourceType不能为空");
        }
        if (dto.getFiles() == null || dto.getFiles().isEmpty()) {
            throw new IllegalArgumentException("files不能为空");
        }
        String submitterId = currentUserId();
        if (!StringUtils.hasText(submitterId)) {
            throw new IllegalArgumentException("未登录");
        }

        String reviewId = IdUtil.randomUUID();
        contentReviewMapper.insertTask(
                reviewId,
                dto.getSourceType(),
                dto.getTitle(),
                dto.getDescription(),
                "pending",
                submitterId,
                dto.getClientBatchId()
        );

        int index = 0;
        for (ContentReviewFileItemDTO file : dto.getFiles()) {
            String objectKey = firstNonBlank(file.getObjectKey(), file.getFileId());
            if (!StringUtils.hasText(objectKey)) {
                throw new IllegalArgumentException("files[" + index + "] 的 objectKey/fileId 不能为空");
            }
            String fileId = IdUtil.randomUUID();
            String previewUrl = buildPreviewUrl(objectKey);
            contentReviewMapper.insertFile(
                    fileId,
                    reviewId,
                    objectKey,
                    file.getFileName(),
                    file.getFileSize(),
                    file.getMimeType(),
                    previewUrl,
                    index
            );
            index++;
        }

        ContentReviewResultVO vo = new ContentReviewResultVO();
        vo.setId(reviewId);
        vo.setStatus("pending");
        return vo;
    }

    @Override
    public PageResult pendingList(ContentReviewPendingQueryDTO query) {
        requireAdminRole();
        if (query == null) {
            query = new ContentReviewPendingQueryDTO();
        }
        if (query.getPage() == null || query.getPage() <= 0) {
            query.setPage(1);
        }
        if (query.getPageSize() == null || query.getPageSize() <= 0) {
            query.setPageSize(10);
        }

        PageHelper.startPage(query.getPage(), query.getPageSize());
        Page<ContentReviewTaskVO> page = (Page<ContentReviewTaskVO>) contentReviewMapper.selectTaskList(query);
        List<ContentReviewTaskVO> list = page.getResult();
        for (ContentReviewTaskVO item : list) {
            item.setFiles(contentReviewMapper.selectFilesByReviewId(item.getId()));
        }
        return new PageResult(page.getTotal(), list);
    }

    @Override
    public ContentReviewResultVO approve(ContentReviewApproveDTO dto) {
        requireAdminRole();
        if (dto == null || !StringUtils.hasText(dto.getId())) {
            throw new IllegalArgumentException("id不能为空");
        }
        ContentReviewTaskVO task = contentReviewMapper.selectTaskById(dto.getId());
        if (task == null) {
            throw new IllegalArgumentException("审核任务不存在");
        }
        if (!"pending".equals(task.getStatus())) {
            throw new IllegalArgumentException("当前状态不允许通过");
        }

        String reviewerId = currentUserId();
        int updated = contentReviewMapper.updateApproved(dto.getId(), reviewerId);
        if (updated <= 0) {
            throw new IllegalArgumentException("审核状态更新失败");
        }

        List<ContentReviewFileVO> files = contentReviewMapper.selectFilesByReviewId(dto.getId());
        List<String> finalUrls = new ArrayList<>();
        for (ContentReviewFileVO file : files) {
            String finalUrl = buildFinalUrl(file.getObjectKey());
            contentReviewMapper.updateFileFinalUrl(dto.getId(), file.getFileId(), finalUrl);
            finalUrls.add(finalUrl);
        }

        ContentReviewResultVO vo = new ContentReviewResultVO();
        vo.setId(dto.getId());
        vo.setStatus("approved");
        vo.setFinalUrls(finalUrls);
        return vo;
    }

    @Override
    public void reject(ContentReviewRejectDTO dto) {
        requireAdminRole();
        if (dto == null || !StringUtils.hasText(dto.getId())) {
            throw new IllegalArgumentException("id不能为空");
        }
        if (!StringUtils.hasText(dto.getReason())) {
            throw new IllegalArgumentException("reason不能为空");
        }
        ContentReviewTaskVO task = contentReviewMapper.selectTaskById(dto.getId());
        if (task == null) {
            throw new IllegalArgumentException("审核任务不存在");
        }
        if (!"pending".equals(task.getStatus())) {
            throw new IllegalArgumentException("当前状态不允许拒绝");
        }

        String reviewerId = currentUserId();
        int updated = contentReviewMapper.updateRejected(dto.getId(), dto.getReason(), reviewerId);
        if (updated <= 0) {
            throw new IllegalArgumentException("审核状态更新失败");
        }
    }

    @Override
    public ContentReviewResultVO getResult(String id) {
        if (!StringUtils.hasText(id)) {
            throw new IllegalArgumentException("id不能为空");
        }
        ContentReviewTaskVO task = contentReviewMapper.selectTaskById(id);
        if (task == null) {
            throw new IllegalArgumentException("审核任务不存在");
        }
        // 提交人或管理员可查看结果
        String userId = currentUserId();
        if (!isAdminRole() && !idEquals(userId, task.getSubmitterId())) {
            throw new IllegalArgumentException("无权限查看该审核结果");
        }
        return buildResultVO(task);
    }

    @Override
    public List<ContentReviewResultVO> getResultBatch(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("ids不能为空");
        }
        List<ContentReviewResultVO> results = new ArrayList<>();
        for (String id : ids) {
            if (StringUtils.hasText(id)) {
                results.add(getResult(id));
            }
        }
        return results;
    }

    @Override
    public ContentReviewTaskVO detail(String id) {
        requireAdminRole();
        ContentReviewTaskVO task = contentReviewMapper.selectTaskById(id);
        if (task == null) {
            throw new IllegalArgumentException("审核任务不存在");
        }
        task.setFiles(contentReviewMapper.selectFilesByReviewId(id));
        return task;
    }

    private ContentReviewResultVO buildResultVO(ContentReviewTaskVO task) {
        List<ContentReviewFileVO> files = contentReviewMapper.selectFilesByReviewId(task.getId());
        List<String> finalUrls = files.stream()
                .map(ContentReviewFileVO::getFinalUrl)
                .filter(StringUtils::hasText)
                .toList();

        ContentReviewResultVO result = new ContentReviewResultVO();
        result.setId(task.getId());
        result.setStatus(task.getStatus());
        result.setReason(task.getReason());
        result.setFinalUrls(finalUrls);
        return result;
    }

    private String buildPreviewUrl(String objectKey) {
        if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
            return objectKey;
        }
        return "https://preview.example.com/" + objectKey;
    }

    private String buildFinalUrl(String objectKey) {
        if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
            return objectKey;
        }
        return "https://cdn.example.com/" + objectKey;
    }

    private String currentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl userDetails) {
            return userDetails.getUser().getUserId();
        }
        return null;
    }

    private boolean isAdminRole() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetailsImpl userDetails)) {
            return false;
        }
        String roleCode = userDetails.getUser().getRoleCode();
        if (!StringUtils.hasText(roleCode)) {
            return false;
        }
        roleCode = roleCode.replace("ROLE_", "").trim().toLowerCase();
        return "center_admin".equals(roleCode) || "system_admin".equals(roleCode);
    }

    private void requireAdminRole() {
        if (!isAdminRole()) {
            throw new IllegalArgumentException("无权限访问该接口");
        }
    }

    private boolean idEquals(String a, String b) {
        if (!StringUtils.hasText(a) || !StringUtils.hasText(b)) {
            return false;
        }
        return a.equals(b);
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
