package sasu.platform.mhm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import sasu.platform.mhm.pojo.dto.PageQueryDTO;
import sasu.platform.mhm.pojo.entity.User;

import java.util.List;

@Mapper
public interface UserMapper {

    User selectById(String userid);

    User selectByUsername(String username);

    User selectByPhone(String phone);

    String selectRoleIdByCode(String roleCode);

    void insertUser(User user);

    void insertUserRoleMapping(@Param("mappingId") String mappingId,
                               @Param("userId") String userId,
                               @Param("roleId") String roleId);

    void updateById(User userInfo);

    /**
     * 管理端用户分页列表查询
     */
    List<User> selectAdminUserList(PageQueryDTO query);
}
