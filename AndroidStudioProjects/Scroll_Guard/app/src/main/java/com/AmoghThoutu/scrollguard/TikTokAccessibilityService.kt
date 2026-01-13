package com.amoghthoutu.scrollguard

import android.accessibilityservice.AccessibilityService
import android.annotation.SuppressLint
import android.view.accessibility.AccessibilityEvent
import android.util.Log

/**
 * TikTokAccessibilityService
 * ---------------------------
 * Detects when TikTok is in the foreground and shows a persistent overlay.
 */
@SuppressLint("AccessibilityPolicy")
class TikTokAccessibilityService : AccessibilityService() {

    private lateinit var overlayManager: OverlayManager

    override fun onServiceConnected() {
        super.onServiceConnected()
        overlayManager = OverlayManager(this)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
        val packageName = event.packageName?.toString() ?: return

        if (packageName == "com.zhiliaoapp.musically") {
            Log.d("ScrollGuard", "TikTok detected")
            overlayManager.showOverlay()
        }
        // No hiding here — overlay stays until Close is tapped
    }

    override fun onInterrupt() {
        // Required override
    }
}
