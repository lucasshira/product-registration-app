import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { toast } from "./ui/use-toast";
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

interface UserInfo {
  given_name: string;
  family_name?: string;
  email: string,
  picture?: string;
  sub: string;
}

interface GoogleLoginAuthProps {
  setUserSub: (sub: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const GoogleLoginAuth = ({ setUserSub, setLoading }: GoogleLoginAuthProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      const parsedUserInfo = JSON.parse(savedUserInfo);
      setUserInfo(parsedUserInfo);
      setIsLoggedIn(true);
      setUserSub(parsedUserInfo.sub);
    }
  }, [setUserSub]);

  useEffect(() => {
    if (isLoggedIn && userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [isLoggedIn, userInfo]);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(true);
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
        setUserSub(sub);

        await createUser({ given_name, family_name, picture, email, sub });
        setLoading(false);
      } catch (err) {
        toast({
          description: "Erro ao criar/verificar usuário"
        });
        setLoading(false);
      }
    },
  });

  const createUser = async (userInfo: UserInfo) => {
    try {
      setLoading(true);
      const emailExistsResponse = await axios.get("http://localhost:3000/api/users");
      const existingUsers = emailExistsResponse.data;
  
      const existingUser = existingUsers.find((user: any) => user.sub === userInfo.sub);
  
      if (existingUser) {
        setUserInfo(existingUser);
        setIsLoggedIn(true);
        setUserSub(existingUser.sub); 
        setLoading(false);
        return existingUser;
      } else {
        const response = await axios.post("http://localhost:3000/api/users", userInfo);
        setUserSub(response.data.sub);
        setLoading(false);
        return response.data;
      }
    } catch (error) {
      toast({
        description: "Erro ao criar/verificar usuário"
      });
      setLoading(false);
    }
  };

  const logout = () => {
    googleLogout();
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    setUserSub(null);
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
        <div>
          <Button variant="outline" onClick={() => login()}>
            Sign in with Google 🚀
          </Button>
        </div>
      )}
    </>
  );
}

export default GoogleLoginAuth;