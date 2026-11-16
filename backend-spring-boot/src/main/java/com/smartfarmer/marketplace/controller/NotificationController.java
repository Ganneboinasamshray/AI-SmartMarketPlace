package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.entity.Notification;
import com.smartfarmer.marketplace.repository.NotificationRepository;
import com.smartfarmer.marketplace.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for user notifications.
 * Provides endpoints to list and mark notifications as read.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    /**
     * GET /api/notifications
     * Returns all notifications for the currently logged-in user,
     * most recent first.
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<Notification> notifications =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(principal.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /api/notifications/unread-count
     * Returns the count of unread notifications for the current user.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(principal.getId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Marks a specific notification as read (only if it belongs to the current user).
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return notificationRepository.findById(id)
                .filter(n -> n.getUser().getId().equals(principal.getId()))
                .map(n -> {
                    n.setRead(true);
                    notificationRepository.save(n);
                    return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /api/notifications/mark-all-read
     * Marks all notifications for the current user as read.
     */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<Notification> unread =
                notificationRepository.findByUserIdAndIsReadFalse(principal.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok(Map.of(
                "message", "All notifications marked as read",
                "count", unread.size()
        ));
    }

    /**
     * DELETE /api/notifications/{id}
     * Deletes a notification (only if it belongs to the current user).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return notificationRepository.findById(id)
                .filter(n -> n.getUser().getId().equals(principal.getId()))
                .map(n -> {
                    notificationRepository.delete(n);
                    return ResponseEntity.<Void>noContent().build();
                })
                .orElse(ResponseEntity.<Void>notFound().build());
    }
}
