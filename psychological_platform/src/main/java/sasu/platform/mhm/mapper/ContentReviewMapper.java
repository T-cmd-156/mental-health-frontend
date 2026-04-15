package sasu.platform.mhm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import sasu.platform.mhm.pojo.dto.ContentReviewPendingQueryDTO;
import sasu.platform.mhm.pojo.vo.ContentReviewFileVO;
import sasu.platform.mhm.pojo.vo.ContentReviewTaskVO;

import java.util.List;

@Mapper
public interface ContentReviewMapper {
    int insertTask(@Param("id") String id,
                   @Param("sourceType") String sourceType,
                   @Param("title") String title,
                   @Param("description") String description,
                   @Param("status") String status,
                   @Param("submitterId") String submitterId,
                   @Param("clientBatchId") String clientBatchId);

    int insertFile(@Param("fileId") String fileId,
                   @Param("reviewId") String reviewId,
                   @Param("objectKey") String objectKey,
                   @Param("fileName") String fileName,
                   @Param("fileSize") Long fileSize,
                   @Param("mimeType") String mimeType,
                   @Param("previewUrl") String previewUrl,
                   @Param("sortIndex") Integer sortIndex);

    ContentReviewTaskVO selectTaskById(@Param("id") String id);

    List<ContentReviewFileVO> selectFilesByReviewId(@Param("reviewId") String reviewId);

    List<ContentReviewTaskVO> selectTaskList(@Param("query") ContentReviewPendingQueryDTO query);

    int updateApproved(@Param("id") String id,
                       @Param("reviewerId") String reviewerId);

    int updateRejected(@Param("id") String id,
                       @Param("reason") String reason,
                       @Param("reviewerId") String reviewerId);

    int updateFileFinalUrl(@Param("reviewId") String reviewId,
                           @Param("fileId") String fileId,
                           @Param("finalUrl") String finalUrl);
}
