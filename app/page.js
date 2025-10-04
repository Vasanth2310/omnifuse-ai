import dynamic from 'next/dynamic'

const ChatInputBox = dynamic(() => import('./_components/ChatInputBox'), { ssr: false });

export default function Home() {
  return (
    <div>
      <ChatInputBox />
    </div>
  );
}
