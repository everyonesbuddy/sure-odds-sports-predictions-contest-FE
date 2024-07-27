/* global kofiWidgetOverlay */
import { useEffect } from "react";

const KofiWidget = () => {
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.getElementById("kofi-widget-script")) {
      const script = document.createElement("script");
      script.id = "kofi-widget-script";
      script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
      script.async = true;

      script.onload = () => {
        try {
          if (typeof kofiWidgetOverlay !== "undefined") {
            kofiWidgetOverlay.draw("sureodds", {
              type: "floating-chat",
              "floating-chat.donateButton.text": "Donate",
              "floating-chat.donateButton.background-color": "#794bc4",
              "floating-chat.donateButton.text-color": "#fff",
            });
          } else {
            console.error("kofiWidgetOverlay is not defined");
          }
        } catch (error) {
          console.error("Error initializing kofiWidgetOverlay:", error);
        }
      };

      script.onerror = () => {
        console.error("Error loading the script");
      };

      document.body.appendChild(script);
    }

    return () => {
      const script = document.getElementById("kofi-widget-script");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default KofiWidget;
