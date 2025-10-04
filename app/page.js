import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
const ChatInputBox = dynamic(() => import('./_components/ChatInputBox'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div />}>
        <ChatInputBox />
      </Suspense>
    </div>
  );
}


