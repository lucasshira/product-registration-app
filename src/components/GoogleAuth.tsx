import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useState } from 'react';

interface GoogleUserData {
  name: string;
  email: string;
  imageUrl: string;
}

const GoogleAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<GoogleUserData | null>(null);

  const responseGoogle = (response: any) => {
    console.log(response)
    setIsLoggedIn(true);
    setUserData({
      name: response.name,
      email: response.email,
      imageUrl: response.imageUrl
    });
    localStorage.setItem('user', JSON.stringify(response));
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    googleLogout();
    setUserData(null); // Limpa os dados do usuário ao fazer logout
  }

  return (
    <div>
      <GoogleOAuthProvider clientId="305531398488-tanqn5os6nurkrst828gpeh2poio1jl4.apps.googleusercontent.com">
        {isLoggedIn ? (
          <div>
            <button onClick={handleLogout}>Logout</button>
            {userData && (
              <div>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <img src={userData.imageUrl} alt="Profile" />
              </div>
            )}
          </div>
        ) : (
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {}}
          />
        )}
      </GoogleOAuthProvider>
    </div>
  );
};
 
export default GoogleAuth;