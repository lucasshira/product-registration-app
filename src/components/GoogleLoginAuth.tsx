// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button"

import { useGoogleLogin, googleLogout } from '@react-oauth/google';

interface UserInfo {
  given_name: string;
  family_name: string;
  picture: string;
}

const GoogleLoginAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        console.log(res);

        const { given_name, family_name, picture } = res.data;

        setUserInfo({ given_name, family_name, picture });
        setIsLoggedIn(true);

      } catch (err) {
        console.log(err);
      }
    },
  });

  const logout = () => {
    googleLogout();
    setIsLoggedIn(false);
    setUserInfo(null);
  }

  return (
    <>
      {isLoggedIn && userInfo ? (
        <div className="flex items-center">
          <img src={userInfo.picture} alt="Profile" className="rounded-full size-8" />
          <p className="font-medium mx-2">{userInfo.given_name} {userInfo.family_name}</p>
          <Button variant="secondary" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      ) : (
        <div className="py-2">
          <Button variant="outline" onClick={() => login()}>
            Sign in with Google 🚀
          </Button>
        </div>
      )}
    </>
  );
}

export default GoogleLoginAuth;