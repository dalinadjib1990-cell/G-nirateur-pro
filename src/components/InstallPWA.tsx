import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share, PlusSquare, Sparkles, ExternalLink, Globe } from 'lucide-react';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showChromeGuide, setShowChromeGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Check if running as actual PWA in standalone window mode
    const checkStandalone = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.matchMedia('(display-mode: fullscreen)').matches ||
                         window.matchMedia('(display-mode: minimal-ui)').matches;
      const isIosStandalone = (window.navigator as any).standalone === true;
      const isAndroidAppWrapper = document.referrer.includes('android-app://');
      return isStandalone || isIosStandalone || isAndroidAppWrapper;
    };

    if (checkStandalone()) {
      setIsStandaloneApp(true);
      return;
    }

    // Restore any prompt captured before React mount
    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
    }

    // Detect iOS & In-App Browsers (FB, Messenger, Instagram, TikTok)
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    const inApp = /fbav|instagram|messenger|tiktok|wv|microMessenger/i.test(ua);
    setIsIOS(iosDevice);
    setIsInAppBrowser(inApp);

    // Auto-open modal on first visit if not standalone
    const hasSeenModal = sessionStorage.getItem('pwa_banner_seen');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
        sessionStorage.setItem('pwa_banner_seen', 'true');
      }, 800);
      return () => clearTimeout(timer);
    }

    // Listen for native Android/Chrome install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
      // Auto pop install dialog when ready
      if (!checkStandalone()) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA appinstalled event triggered successfully');
      setIsStandaloneApp(true);
      setShowInstallBanner(false);
      setShowIosGuide(false);
      setShowChromeGuide(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptObj = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptObj) {
      try {
        // Trigger Chrome/Android native prompt dialog directly
        promptObj.prompt();
        const { outcome } = await promptObj.userChoice;
        if (outcome === 'accepted') {
          setIsStandaloneApp(true);
          setShowInstallBanner(false);
        }
        setDeferredPrompt(null);
        (window as any).deferredPwaPrompt = null;
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    } else if (isIOS) {
      setShowInstallBanner(false);
      setShowIosGuide(true);
    } else if (isInAppBrowser) {
      window.open(window.location.href, '_system');
      setShowChromeGuide(true);
    } else {
      setShowInstallBanner(false);
      setShowChromeGuide(true);
    }
  };

  // If app is already launched as a standalone PWA shortcut, hide the install UI
  if (isStandaloneApp) {
    return null;
  }

  return (
    <>
      {/* Top Floating Quick Install Header Button */}
      {!showInstallBanner && !showIosGuide && !showChromeGuide && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[90] animate-bounce">
          <button
            onClick={() => {
              if (deferredPrompt) {
                handleInstallClick();
              } else {
                setShowInstallBanner(true);
              }
            }}
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-4 py-2 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-300/50 transition-all transform active:scale-95"
          >
            <Smartphone size={16} className="animate-pulse" />
            <span>تثبيت التطبيق على الهاتف 📲</span>
          </button>
        </div>
      )}

      {/* Main PWA Install Popup Modal */}
      {showInstallBanner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f0f11] border-2 border-amber-500/40 w-full max-w-sm rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden relative flex flex-col items-center p-6 sm:p-8 text-white">
            {/* Close Button */}
            <button
              onClick={() => setShowInstallBanner(false)}
              className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-colors z-10"
              title="إغلاق"
            >
              <X size={18} />
            </button>

            {/* App Icon Container */}
            <div className="relative w-28 h-28 mb-4 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center overflow-hidden">
                <img
                  src="/icon.svg"
                  alt="Pro Générateur Icon"
                  className="w-full h-full object-cover rounded-[22px]"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-950 flex items-center gap-1 shadow-lg">
                <Sparkles size={10} /> PWA
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent mb-1 text-center">
              PRO GÉNÉRATEUR AI
            </h2>
            <p className="text-xs text-amber-300/80 font-bold mb-3">مولد المذكرات والدروس الاحترافي</p>

            <div className="w-full bg-slate-900/90 rounded-2xl p-3.5 mb-5 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-amber-400 shrink-0" />
                <span>إضافة اختصار مباشر على شاشة الهاتف</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-amber-400 shrink-0" />
                <span>دخول سريع بأيقونة فاخرة بدون متصفح</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-amber-400 shrink-0" />
                <span>شاشة كاملة وتجربة سريعة كـ تطبيق أندرويد</span>
              </div>
            </div>

            {/* In-app Browser Alert Warning */}
            {isInAppBrowser && (
              <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 mb-3 text-[11px] text-amber-200 flex items-center gap-2">
                <Globe size={16} className="shrink-0 text-amber-400" />
                <span>أنت تتصفح داخل تطبيق آخر. يرجى فتح الرابط في متصفح Google Chrome للتثبيت المباشر.</span>
              </div>
            )}

            {/* Install Action Button */}
            <button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] active:scale-98 text-base mb-3"
            >
              <Download size={20} className="animate-bounce" />
              <span>
                {deferredPrompt
                  ? 'تثبيت التطبيق الآن 📱'
                  : isIOS
                  ? 'تثبيت على آيفون (iOS) 🍏'
                  : 'تثبيت التطبيق على الشاشة 📱'}
              </span>
            </button>

            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
            >
              متابعة التصفح عبر الويب
            </button>
          </div>
        </div>
      )}

      {/* iOS Instructions Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0f0f11] border border-amber-500/40 w-full max-w-sm rounded-3xl p-6 text-white text-right relative">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 left-4 p-1.5 bg-white/10 text-slate-300 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Share size={20} />
              </div>
              <h3 className="font-bold text-lg text-amber-300">تثبيت التطبيق على آيفون (iOS)</h3>
            </div>

            <ol className="text-xs text-slate-300 space-y-3 mb-6 list-decimal list-inside leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <li>اضغط على زر <strong className="text-amber-400">المشاركة (Share <Share size={12} className="inline mx-0.5" />)</strong> في أسفل متصفح Safari.</li>
              <li>انزل للأسفل واختر <strong className="text-amber-400">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen <PlusSquare size={12} className="inline mx-0.5" />)</strong>.</li>
              <li>اضغط على <strong className="text-amber-400">"إضافة" (Add)</strong> أعلى الشاشة.</li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
            >
              تم، حسناً
            </button>
          </div>
        </div>
      )}

      {/* Chrome / Android Helper Guide Modal */}
      {showChromeGuide && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0f0f11] border border-amber-500/40 w-full max-w-sm rounded-3xl p-6 text-white text-right relative">
            <button
              onClick={() => setShowChromeGuide(false)}
              className="absolute top-4 left-4 p-1.5 bg-white/10 text-slate-300 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Smartphone size={20} />
              </div>
              <h3 className="font-bold text-lg text-amber-300">إضافة اختصار إلى الشاشة الرئيسية</h3>
            </div>

            <div className="text-xs text-slate-300 space-y-3 mb-6 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <p>لإضافة اختصار التطبيق فوراً إلى شاشتك الرئيسية:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>اضغط على خيارات المتصفح <strong className="text-amber-400">(⋮)</strong> بالأعلى.</li>
                <li>اختر <strong className="text-amber-400">"تثبيت التطبيق"</strong> أو <strong className="text-amber-400">"الإضافة إلى الشاشة الرئيسية"</strong>.</li>
                <li>سيتم إضافة أيقونة التطبيق مباشرة على شاشتك.</li>
              </ol>
            </div>

            <button
              onClick={() => setShowChromeGuide(false)}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
            >
              تم، فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </>
  );
}
