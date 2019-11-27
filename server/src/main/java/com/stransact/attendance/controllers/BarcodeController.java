package com.stransact.attendance.controllers;

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
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
 * The type User controller.
 *
 * @author Dagogo Hart Moore
 */
@RestController
@RequestMapping("/api/v1/barcode")
public class BarcodeController {
    public BarcodeController(UserRepository userRepository, SimpMessagingTemplate simpMessagingTemplate, TimeLogRepository timeLogRepository, BarcodeRepository barcodeRepository, AuthorizationMiddleware authorizationMiddleware) {
        this.userRepository = userRepository;
        this.authorizationMiddleware = authorizationMiddleware;
        this.barcodeRepository = barcodeRepository;
        this.timeLogRepository = timeLogRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }


    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final BarcodeRepository barcodeRepository;
    private final AuthorizationMiddleware authorizationMiddleware;
    private final TimeLogRepository timeLogRepository;

    private final String endPoint = "barcodes";
    private final String noAccessError = "NO_ACCESS";

    private Barcode createBarcode() throws NoSuchAlgorithmException {
        String barString = Utils.hashString(String.valueOf((new Date()).getTime()));

        Barcode barcode = new Barcode();
        barcode.setBarString(barString);
        return barcodeRepository.save(barcode);
    }

    @GetMapping("/")
    public ResponseEntity<SuccessResponse> getAllBarcode() throws UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("barcodes", barcodeRepository.findAll());
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    @GetMapping("/current")
    public ResponseEntity<SuccessResponse> getCurrentBarcode() throws UnauthorizedException {
        if (!authorizationMiddleware.isAuthorized(endPoint, "READ_ANY_PRIVILEGE"))
            throw new UnauthorizedException(noAccessError);

        List<Barcode> barcodes = barcodeRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("barcode", barcodes.size() > 0 ? barcodes.get(0) : "");
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }

    @PostMapping("/scan")
    public ResponseEntity<SuccessResponse> scan(@RequestBody Map<String, Object> body) throws ValidationException, NoSuchAlgorithmException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();
        String barString = (String) body.get("barString");
        List<TimeLog> timeLogs = timeLogRepository.findTimeLogsByUserId(authUser.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));
        timeLogs.sort(Comparator.comparing(TimeLog::getCreatedAt));

        List<Barcode> barcodes = barcodeRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        System.out.println(barString);
        System.out.println(barcodes.get(0).getBarString());
        if (!barString.equals(barcodes.get(0).getBarString())) {
            throw new ValidationException("BARCODE_NOT_LATEST");
        }

        TimeLog timeLog = new TimeLog();
        timeLog.setBarcode(barcodes.get(0));
        timeLog.setUser(authUser);
        timeLog.setInside(timeLogs.size() <= 0 || !timeLogs.get(timeLogs.size() - 1).isInside());

        timeLogRepository.save(timeLog);

        Barcode barcode = createBarcode();

        simpMessagingTemplate.convertAndSend("/topics/latest-barcode", barcode);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("log", timeLog);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.toString(), responseData));
    }
}
