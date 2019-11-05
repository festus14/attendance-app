package com.stransact.attendance;

import com.stransact.attendance.repository.AccessTokenRepository;
import com.stransact.attendance.repository.RefreshIdRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ScheduledTasks {
    public ScheduledTasks(AccessTokenRepository accessTokenRepository, RefreshIdRepository refreshIdRepository) {
        this.accessTokenRepository = accessTokenRepository;
        this.refreshIdRepository = refreshIdRepository;
    }

    private final AccessTokenRepository accessTokenRepository;
    private final RefreshIdRepository refreshIdRepository;

    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void deleteAccessToken() {
        accessTokenRepository.deleteAllByExpiryIsBefore(new Date(System.currentTimeMillis()));
    }

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    public void deleteRefreshToken() {
        refreshIdRepository.deleteAllByExpiryIsBefore(new Date(System.currentTimeMillis()));
    }

    public void scheduleTaskWithFixedDelay() {
    }

    public void scheduleTaskWithInitialDelay() {
    }

    public void scheduleTaskWithCronExpression() {
    }
}
