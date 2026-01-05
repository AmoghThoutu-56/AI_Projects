ScrollGuard



An Android Digital Wellbeing Overlay for Short-Form Video Apps



---



Overview



ScrollGuard is an Android system overlay application desifned to reduce over consumption of short form videos by introducing conginitve interruptions.



The app automatically activates when a supported short-form video app (initally just Tik-Tok) is opened. After a configurable number of scrolls (default:20), ScrollGuard temporarily blocks interaction and presents a question challange. The user must answer correctly or wait out a rest timer to continue scrolling.



ScrollGuard operated independently of third-party apps and does not modify or access internal APIs.



---



Motivation



Short‑form video (SFV) platforms are engineered for continuous, low‑friction engagement. Research shows that even brief exposure (10–30 minutes) to SFV feeds can impair:

\- Cognitive reflection – the ability to pause, override autopilot responses, and think deliberately.

\- Prospective memory – remembering intentions and planned actions despite distractions.

\- Inhibitory control – resisting impulses such as endless swiping or tapping notifications.



These effects are driven less by video content and more by interface mechanics: rapid novelty, infinite scroll, and continuous micro‑decisions that keep cognition in a reactive state. Introducing deliberate pauses or limiting swipes has been shown to mitigate these effects.



ScrollGuard does not block content or restrict access. Instead, it reintroduces intentional friction to help users:

\- Interrupt automatic scrolling

\- Re‑engage reflective thinking

\- Maintain cognitive agency



This project explores how behavioral design, Android accessibility services, and digital wellbeing principles can counteract attention‑capturing interfaces without modifying third‑party apps or relying on willpower alone.



---



Core Features



Automatic App detection:

* Dects when TikTok is in the foreground
* Activates and deactivates automatically
* Zero impact on other apps



Scroll Detection and Counting

* Detects vertical scroll gestures
* Real time scroll counting
* Configurable scroll threshold



Full Screen Overlay Interruption

* Secure system overlay blocks touch input
* Cannot be dismissed without completing the challenge or waiting for the rest timer



Question CHallange System

* Short‑answer questions only (MCQs are intentionally excluded to prevent brute‑forcing)
* Local/offline validation
* Difficulty and category support



Unlock and Resume Logic:

* Correct answers or rest timer timeout restore scrolling
* Scroll timer resets



---



Architecture Overerview:



&nbsp;Accessibility Service      

&nbsp;|-- Foreground App Monitor  

&nbsp;|-- Scroll Event Listener   

&nbsp;|-- Trigger Controller    



&nbsp;Overlay Manager             

&nbsp;|-- Fullscreen Compose UI   

&nbsp;|-- Touch Interception      

&nbsp;|-- Fail-safe Escape Logic  



&nbsp;Question Engine             

&nbsp;|-- Question Repository    

&nbsp;|-- Answer Validator        

&nbsp;|-- Difficulty Controller  



---



Permissions Used



* Accessibility service -> Detect foreground app and scroll events
* Draw over other apps -> Display blocking overlay
* Foreground service -> Keeps app running even when the app is not in foreground
* Battery optimization exemption -> Prevent service termination



--- 



Security and Privacy Principles



* Full on device processing
* No network or analutics dependencies
* Explicit user opt-in for all sensitive permissions
* CLear visual distinction for overlays
* Emergency escape mechanisms to prevent lockout



Designed as a transparent digital wellbeing tool, not survelliance software.



--- 



Platform Expansion



The architecture supports future expansion of interruption logic to Instagram Reels, and Youtube Shorts through app specific configuration  modules.



--- 



Tech Stack



Core Platform

* Language: Koitlin
* Minimum android SDK: Android 8 (API 26)
* Target SDK: Latest stable Android release



UI and UX:

* Jetpack Compose: declarative UI for overlays, challenge screens, and rest-period countdowns 
* Material 3: consistent theming, accessibility contrast, and dark mode support
* Haptic Feedback APIs: tactile confirmation for correct/incorrect answers and timer completion
* Animated visibilty and Transitions: smooth overlay entry, afilure feedback, and timer progression



System Intehration:

* Accessibility Service: foreground app detection, scroll event monitoring, and interruption triggers
* WindowsManager: system-level overlay rendering and touvh interception
* Foreground Services: relaible background execution for scroll tracking and rest-timeer enforcement
* UseageStatsManager (fallback): secondary app state cerification, if accessibility events are delayed



Architecture \& State:

* MVVM Architecture: clear separation between UI, logic, and system services
* Kotlin Coroutines + Flow: asynchronous scroll counting, question handling, and rest-timer state updates
* DataStore: persistent user preferences, including scroll threshold, question difficulty, and configurable rest-period duration 



Timing \& Enforcement:

* CountDownTimer / Coroutine-based Timer: enforces rest periods after incorrect answers
* State-locked Overlay Mode: prevents scrolling or dismissal until the rest timer expires
* Lifecycle-aware Timer Handling: survives app backgrounding, screen rotation, and process recreation



Testing \& Tooling: 

* Android Studio + Gradle: development and build automation
* Espresso: UI and overlay interaction testing
* Accessibility Test Framework: compliance and permission behavior validation
* Proguard / R8: build optimization and code shrinking



--- 



Disclaimer



ScrollGUard is an experimental digital wellbeing application. It is not affliated with TikTok, Instagram, or Youtube.





