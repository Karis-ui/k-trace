import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLoginButton from "../facebook/FLogin"; // your custom Facebook button
import axios from "axios";

export default function SocialLogin({ onSuccess }) {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
        access_token: credentialResponse.credential,
      });
      localStorage.setItem("authToken", res.data.key);
      onSuccess();
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-center text-gray-600">Or continue with</p>
      <div className="flex justify-center space-x-4 mt-3">
        {/* Google */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
        />

        {/* Facebook - your custom button */}
        <FacebookLoginButton onSuccess={onSuccess} />
      </div>
    </div>
  );
}
