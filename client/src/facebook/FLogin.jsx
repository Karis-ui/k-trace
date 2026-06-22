import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebookF } from "react-icons/fa";

export default function FLogin({ onSuccess }) {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v17.0",
        });
        setSdkReady(true);
        console.log("✅ Facebook SDK initialized");
      };
    };
  }, []);

  const handleFacebookLogin = () => {
    if (!sdkReady || !window.FB) {
      alert("Facebook SDK is not ready yet. Try again.");
      return;
    }

    window.FB.login(
      (response) => {
        console.log("FB.login response:", response);
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          console.log("✅ Got Access Token:", accessToken);

          axios
            .post("http://127.0.0.1:8000/api/auth/facebook/", {
              access_token: accessToken,
            })
            .then((res) => {
              localStorage.setItem("authToken", res.data.key);
              if (typeof onSuccess === "function") onSuccess();
            })
            .catch((err) => {
              console.error("Facebook login failed:", err);
            });
        } else {
          alert("⚠️ Facebook login cancelled.");
        }
      },
      { scope: "public_profile" } // ✅ only request profile, omit email
    );
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={!sdkReady}
      className={`flex items-center justify-center w-full max-w-xs px-4 py-2 rounded-lg shadow transition duration-200 ${
        sdkReady
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-400 text-gray-200 cursor-not-allowed"
      }`}
    >
      <FaFacebookF size={20} className="mr-2" />
     Facebook
    </button>
  );
}
