"use client"
import React, { useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/AppSidebar"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { DefaultModel } from '@/shared/AiModelsShared'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { updateDoc } from 'firebase/firestore';

function Provider({
  children,
  ...props
}) {

  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetail, setUserDetail] = useState();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user])

  useEffect(() => {
    if (user && aiSelectedModels) {
      updateAiModelSelectionPref();
    }
  }, [aiSelectedModels, user]);

  const updateAiModelSelectionPref = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, {
      selectedModelPref: aiSelectedModels
    });
  };

  const CreateNewUser = async () => {
    //If user exist?
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('Existing User');
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelPref ?? DefaultModel);
      setUserDetail(userInfo);
      return;
    }

    else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5,
        plan: 'Free',
        credits: 1000
      }
      await setDoc(userRef, userData);
      console.log('New User Data Saved');
      setUserDetail(userData);
    }

  }

  return (
    <NextThemesProvider {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels, messages, setMessages }}>
          <SidebarProvider>
            <AppSidebar />

            <div className='w-full'>
              <AppHeader />{children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider