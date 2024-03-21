import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button"

import { useGoogleLogin, googleLogout } from '@react-oauth/google';

interface UserInfo {
  given_name: string;
  family_name?: string;
  email: string,
  picture?: string;
  sub: string;
}

const GoogleLoginAuth = ({ setUserSub }: { setUserSub: (sub: string) => void }) => {
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

        const { given_name, family_name, picture, email, sub } = res.data;

        setUserInfo({ given_name, family_name, picture, email, sub });
        setIsLoggedIn(true);

        await createUser({ given_name, family_name, picture, email, sub });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const createUser = async (userInfo: any) => {
    try {
      const emailExistsResponse = await axios.get("https://product-registration-app-api.onrender.com/api/users");
      const existingUsers = emailExistsResponse.data;
  
      const existingUser = existingUsers.find((user: any) => user.sub === userInfo.sub);
  
      if (existingUser) {
        setUserInfo(existingUser);
        setIsLoggedIn(true);
        setUserSub(existingUser.sub); 
        return existingUser;
      } else {
        const response = await axios.post("https://product-registration-app-api.onrender.com/api/users", userInfo);
        setUserSub(response.data.sub); 
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao criar/verificar usuário:', error);
      throw error;
    }
  };

  const logout = () => {
    googleLogout();
    setIsLoggedIn(false);
    setUserInfo(null);
    window.location.reload();
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