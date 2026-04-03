package sasu.platform.mhm.service;

public interface TwoBindingService {
    int getStatus(String studentId);


    void confirmBind(String studentId);

    void RejectBind(String studentId);
}
