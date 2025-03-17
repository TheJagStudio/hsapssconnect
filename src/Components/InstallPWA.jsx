import { useState, useEffect } from "react";

function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const wasPopupShownRecently = () => {
        const lastShown = localStorage.getItem('pwa-prompt-last-shown');
        if (!lastShown) return false;
        
        const lastShownDate = new Date(parseInt(lastShown));
        const now = new Date();
        const hoursSinceLastShown = (now - lastShownDate) / (1000 * 60 * 60);
        return hoursSinceLastShown < 24;
    };

    const markPopupAsShown = () => {
        localStorage.setItem('pwa-prompt-last-shown', Date.now().toString());
    };

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
            if (!wasPopupShownRecently()) {
                setShowPopup(true);
            }
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
        const { outcome } = await promptInstall.userChoice;
        if (outcome === "accepted") {
            setSupportsPWA(false);
        }
        markPopupAsShown();
        setShowPopup(false);
    };

    const handleClose = () => {
        markPopupAsShown();
        setShowPopup(false);
    };

    const handleMaybeLater = () => {
        setShowPopup(false);
    };

    if (!supportsPWA || !showPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
            <div className="w-full h-full absolute" onClick={handleClose}></div>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <img 
                        src="/static/images/manifest-icon-192.maskable.png" 
                        alt="HSAPSS Logo" 
                        className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-md"
                    />
                    <h2 className="text-2xl font-bold text-gray-900">Install HSAPSS Connect</h2>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Access Bhajans offline</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Quick access from your home screen</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Native app-like experience</p>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleInstallClick}
                        className="w-full py-3 px-4 bg-primary bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                    >
                        Install Now
                    </button>
                    <button
                        onClick={handleMaybeLater}
                        className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InstallPWA;
