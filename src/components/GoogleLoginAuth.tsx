// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button"
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState } from "react";

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

  return (
    <>
      {isLoggedIn && userInfo && (
        <div>
          <p>{userInfo.given_name} {userInfo.family_name}</p>
          <img src={userInfo.picture} alt="Profile" />
        </div>
      )}
      <Button variant="outline" onClick={() => login()}>
        Sign in with Google 🚀
      </Button>
    </>
  );
}

export default GoogleLoginAuth;