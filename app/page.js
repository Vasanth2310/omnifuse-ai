"use client"
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
const ChatInputBox = dynamic(() => import('./_components/ChatInputBox'), { ssr: false });

export default function Home() {
  const {setTheme} = useTheme();
  return (
    <div>
      <Suspense fallback={<div />}> 
        <ChatInputBox />
      </Suspense>
    </div>
  );
}


