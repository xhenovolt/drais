"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const cookieConsent = localStorage.getItem("drais_cookies_accepted");
    if (cookieConsent === null) {
      // Show banner after 2 seconds if no preference is set
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("drais_cookies_accepted", "true");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("drais_cookies_accepted", "false");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={handleReject}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>

            {/* Cookie Details */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Essential:</strong> Required for basic site functionality
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Analytics:</strong> Help us improve DRAIS experience
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Preferences:</strong> Remember your settings and choices
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept All
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reject Non-Essential
              </Button>
            </div>

            {/* Privacy Link */}
            <div className="mt-4 text-center">
              <a
                href="/settings"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage cookie preferences in Settings
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
