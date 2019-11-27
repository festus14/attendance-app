package com.stransact.attendance.controllers;

import com.stransact.attendance.exceptions.AlreadyExistsException;
import com.stransact.attendance.exceptions.ResourceNotFoundException;
import com.stransact.attendance.exceptions.UnauthorizedException;
import com.stransact.attendance.exceptions.ValidationException;
import com.stransact.attendance.models.Barcode;
import com.stransact.attendance.models.SuccessResponse;
import com.stransact.attendance.models.TimeLog;
import com.stransact.attendance.models.User;
import com.stransact.attendance.repository.BarcodeRepository;
import com.stransact.attendance.repository.TimeLogRepository;
import com.stransact.attendance.repository.UserRepository;
import com.stransact.attendance.security.AuthorizationMiddleware;
import com.stransact.attendance.services.Utils;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
 * The type User controller.
 *
 * @author Dagogo Hart Moore
 */
@RestController
@RequestMapping("/api/v1/logs")
public class LogController {
    public LogController(UserRepository userRepository, TimeLogRepository timeLogRepository, BarcodeRepository barcodeRepository, AuthorizationMiddleware authorizationMiddleware) {
        this.userRepository = userRepository;
        this.authorizationMiddleware = authorizationMiddleware;
        this.barcodeRepository = barcodeRepository;
        this.timeLogRepository = timeLogRepository;

    }


    private final UserRepository userRepository;
    private final BarcodeRepository barcodeRepository;
    private final AuthorizationMiddleware authorizationMiddleware;
    private final TimeLogRepository timeLogRepository;

    private final String endPoint = "logs";
    private final String noAccessError = "NO_ACCESS";

    @PostMapping("/users")
    public ResponseEntity<SuccessResponse> getUsersScannedTimestamp(@RequestBody Map<String, Long> timestamps) throws UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Date from = new Date(timestamps.get("from"));
        Date to = new Date(timestamps.get("to"));

        List<TimeLog> timeLogs = timeLogRepository.findTimeLogByCreatedAtAfterAndCreatedAtBefore(from, to);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("timeLogs", timeLogs);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    @GetMapping("/user_logs")
    public ResponseEntity<SuccessResponse> getAbsentAndPresentTimestamp(@RequestParam("from") String from, @RequestParam("to") String to, @RequestParam("user_id") String userId) throws ResourceNotFoundException, UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Date fromDate = new Date(Long.valueOf(from));
        Date toDate = new Date(Long.valueOf(to));
        if (new Date().before(toDate)) toDate = new Date();

        User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND"));
        if (user.getCreatedAt().after(fromDate)) fromDate = user.getCreatedAt();

        List<TimeLog> timeLogs = timeLogRepository.findTimeLogByCreatedAtAfterAndCreatedAtBeforeAndUserId(fromDate, toDate, Long.valueOf(userId), Sort.by(Sort.Direction.ASC, "createdAt"));
        Map<String, Boolean> presentDays = new HashMap<>();
        long hours = 0;

        for (TimeLog timeLog : timeLogs) {
            Calendar startCal = Calendar.getInstance();
            startCal.setTime(timeLog.getCreatedAt());
            String key = "" + startCal.get(Calendar.YEAR) + startCal.get(Calendar.MONTH) + startCal.get(Calendar.DAY_OF_MONTH);
            if (timeLogs.get(0) == timeLog && !timeLog.isInside()) {
                presentDays.put(key, true);
            }
            else if (timeLogs.get(timeLogs.size() - 1) == timeLog && timeLog.isInside()) {

            }
            else if (timeLog.isInside()) {
                presentDays.put(key, true);
                hours -= timeLog.getCreatedAt().getTime();
            } else {
                presentDays.put(key, true);
                hours += timeLog.getCreatedAt().getTime();
            }
        }

        hours /= 1000 * 60 * 60;

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("daysSinceResumption", Utils.getWorkingDaysBetweenTwoDates(fromDate, toDate));
        responseData.put("absentDays", Utils.getWorkingDaysBetweenTwoDates(fromDate, toDate) - presentDays.size());
        responseData.put("presentDays", presentDays.size());
        responseData.put("hours", hours);
        responseData.put("user", user);
        responseData.put("lastLog", timeLogs.size() > 0 ? timeLogs.get(timeLogs.size()-1) : null);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }
}
