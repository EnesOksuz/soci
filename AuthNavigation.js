import React, { useState, useEffect } from "react";
import { SignedInStack, SignedOutStack } from "./Navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const AuthNavigation = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, []);

  return isSignedIn ? <SignedInStack /> : <SignedOutStack />;
};
