"use client"
import React, { useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/AppSidebar"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'

function Provider({
  children,
  ...props
}) {

  const {user} = useUser();

  useEffect(() => {
    if(user)
    {
      CreateNewUser();
    }
  }, [user])

  const CreateNewUser = async() => {
    //If user exist?
    const userRef = doc(db,"users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists())
    {
      console.log('Existing User');
      return ;
    }
    else{
      const userData = {
        name:user?.fullName,
        email:user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5,
        plan:'Free',
        credits:1000 
      }
      await setDoc(userRef, userData);
      console.log('New User Data Saved');
    } 
    
  }

  return (
    <NextThemesProvider {...props}
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <SidebarProvider>
            <AppSidebar />
            
            <div className='w-full'>
              <AppHeader/>{children}
            </div>
        </SidebarProvider>
    </NextThemesProvider>
  )
}

export default Provider