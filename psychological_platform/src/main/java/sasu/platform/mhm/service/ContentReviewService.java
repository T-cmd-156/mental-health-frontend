package sasu.platform.mhm.service;

import sasu.platform.mhm.pojo.common.PageResult;
import sasu.platform.mhm.pojo.dto.ContentReviewApproveDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewPendingQueryDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewRejectDTO;
import sasu.platform.mhm.pojo.dto.ContentReviewSubmitDTO;
import sasu.platform.mhm.pojo.vo.ContentReviewResultVO;
import sasu.platform.mhm.pojo.vo.ContentReviewTaskVO;

import java.util.List;

public interface ContentReviewService {
    ContentReviewResultVO submit(ContentReviewSubmitDTO dto);

    PageResult pendingList(ContentReviewPendingQueryDTO query);

    ContentReviewResultVO approve(ContentReviewApproveDTO dto);

    void reject(ContentReviewRejectDTO dto);

    ContentReviewResultVO getResult(String id);

    List<ContentReviewResultVO> getResultBatch(List<String> ids);

    ContentReviewTaskVO detail(String id);
}
