import { lazy, ReactElement, Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import Menu from "./components/Menu";
import Flash from './components/Flash';
import axios from 'axios';
import { defaultUser, resetUserInfos, signInWtihToken, signOut } from './shared/helpers/user.helper';
import { FlashMessageContext, FlashMessageProvider, UserContext } from './shared/context';
import { getFlash } from './shared/helpers/flash.helper';

const Home = lazy((): Promise<any> => import('./pages/Home'));
const Register = lazy((): Promise<any> => import('./pages/Register'));
const Login = lazy((): Promise<any> => import('./pages/Login'));
const UserProfile = lazy((): Promise<any> => import('./pages/UserProfile'));
const EditProfile = lazy((): Promise<any> => import('./pages/EditProfile'));

function App(): ReactElement {
  const localToken = localStorage.getItem("auth_token");

  // Media queries sizes based on Milligram library 
  const mediaQueryTablet: MediaQueryList = window.matchMedia("(min-width: 400px)");
  const mediaQueryDesktop: MediaQueryList = window.matchMedia("(min-width: 800px)");

  // Context
  const { user, setUser } = useContext(UserContext);
  const setFlashMessage = useContext(FlashMessageContext).setFlashMessage;

  // State
  const [token, setToken] = useState("");
  const [isDesktop, setIsDesktop] = useState(mediaQueryDesktop.matches ? true : false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Used to automatilcally login or out the user depending on the token presence
  useEffect(() => {
    (!localToken || localToken === "undefined") &&
      resetUserInfos(defaultUser, setUser, setToken, axios.defaults.headers);

    localToken &&
      signInWtihToken(localToken, setUser, setToken)
        .then(resp => getFlash(setFlashMessage, resp));
  }, [localToken, setUser, setFlashMessage])

  // Handle the switch between desktop or mobile menu dependeing on the mediaquery
  useEffect(() => {
    mediaQueryDesktop.addEventListener('change', _ => {
      setIsDesktop(!isDesktop);
      isDesktop && setIsMobileMenuOpen(false);
    })
    return mediaQueryDesktop.removeEventListener('change', _ => {
      setIsDesktop(!isDesktop);
      isDesktop && setIsMobileMenuOpen(false);
    });
  })

  async function logOut() {
    const resp = await signOut(token, defaultUser, setUser, setToken);
    getFlash(setFlashMessage, resp);
  }

  return (
    <div className="text-center">
      <Router>
        <FlashMessageProvider>
          <header className="App-header">
            <Menu token={token} user_id={user ? user.id : defaultUser.id} logOut={logOut} isDesktop={isDesktop} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </header>


          <main className={`${isMobileMenuOpen && mediaQueryTablet.matches && "pt-4"}`} >
            <div className='mb-1'>
              <Flash />
            </div>
            <Suspense fallback="Loading app ...">
              <Routes>
                <Route element={<Home />} path='/' />
                <Route path='/register' element={<Register setToken={setToken} />} />
                <Route path='/login' element={<Login setToken={setToken} />} />
                <Route path="/user/:id" element={!localToken ? <Navigate to="/" /> : <UserProfile defaultUser={defaultUser} token={token} />} />
                <Route path="/profile-edit" element={!localToken ? <Navigate to="/" /> : <EditProfile token={token} setToken={setToken} />} />
              </Routes>
            </Suspense>
          </main>

          <footer></footer>
        </FlashMessageProvider>
      </Router>
    </div>
  );
}

export default App;
