import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";

const GoogleLoginAuth = () => {
  const { user, login, logout } = useAuth();
  const { toast } = useToast();

  const googleLogin = useGoogleLogin({
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

        const userInfo = { given_name, family_name, picture, email, sub };
        login(userInfo);

        await createUser(userInfo);
        toast({
          description: "Login bem-sucedido! Carregando seus produtos...",
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const createUser = async (userInfo: any) => {
    try {
      const response = await axios.get(`https://product-registration-app-api.onrender.com/api/users/${userInfo.sub}`);
      if (!response.data) {
        await axios.post("https://product-registration-app-api.onrender.com/api/users", userInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return user ? (
    <div className="flex items-center">
      <img src={user.picture} alt="Profile" className="rounded-full size-8" />
      <p className="font-medium mx-2">{user.given_name} {user.family_name}</p>
      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </div>
  ) : (
    <Button variant="outline" onClick={() => googleLogin}>
      Sign in with Google 🚀
    </Button>
  );
};

export default GoogleLoginAuth;