import auth0 from "auth0-js";
import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps,
  // @ts-ignore
  __RouterContext
} from "react-router-dom";

const auth0client = new auth0.WebAuth({
  domain: "",
  clientID: "",
  redirectUri: `${location.protocol}//${location.host}/__auth_callback`,
  responseType: "token id_token",
  scope: "openid"
});

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsLoggedIn(auth != null);
    if (auth != null) {
      console.log("auth", JSON.parse(auth));
    }
  }, []);
  if (isLoggedIn == null) {
    return <div>Loading...</div>;
  }
  return isLoggedIn ? (
    <>
      <div>Logged in</div>
      <button
        onClick={() => {
          localStorage.removeItem("auth");
          // auth0client.logout({
          //   returnTo: location.origin
          // });
          setIsLoggedIn(false);
        }}
      >
        logout
      </button>
    </>
  ) : (
    <button
      onClick={() => {
        auth0client.authorize();
      }}
    >
      login
    </button>
  );
}

function AuthCallback(props: RouteComponentProps) {
  const router: any = useContext(__RouterContext);
  useEffect(() => {
    if (/access_token|id_token|error/.test(props.location.hash)) {
      auth0client.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localStorage.setItem("auth", JSON.stringify(authResult));
          router.history.replace("/");
        } else if (err) {
          console.error(err);
          alert(`auth0 error`);
        }
      });
    }
  }, []);
  return <div>loading...</div>;
}

const root = document.querySelector(".root") as HTMLDivElement;
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/__auth_callback" component={AuthCallback} />
    </Switch>
  </BrowserRouter>,
  root
);
