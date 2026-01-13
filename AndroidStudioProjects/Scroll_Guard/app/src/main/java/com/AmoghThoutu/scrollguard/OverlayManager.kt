package com.amoghthoutu.scrollguard

import android.content.Context
import android.graphics.PixelFormat
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button

/**
 * OverlayManager
 * ----------------
 * Responsible for creating, displaying, and removing the system overlay safely.
 * Each instance is tied to a context and avoids memory leaks.
 */
class OverlayManager(private val context: Context) {

    private var overlayView: View? = null
    private var windowManager: WindowManager? = null
    private var isShowing = false

    fun showOverlay() {
        if (isShowing) return

        val appContext = context.applicationContext
        windowManager = appContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        @Suppress("InflateParams")
        val inflater = LayoutInflater.from(appContext)
        overlayView = inflater.inflate(R.layout.overlay_layout, null, false)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP

        overlayView?.findViewById<Button>(R.id.closeBtn)?.setOnClickListener {
            hideOverlay()
        }

        windowManager?.addView(overlayView, params)
        isShowing = true
    }

    fun hideOverlay() {
        overlayView?.let {
            try {
                windowManager?.removeView(it)
            } catch (_: Exception) {
                // Already removed or not attached
            }
        }
        overlayView = null
        windowManager = null
        isShowing = false
    }
}
