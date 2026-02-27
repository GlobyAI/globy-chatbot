import React, { createContext, useContext, useState } from "react";


interface ChatBoxType {
  isAnalyzing: boolean,
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>,
  vectorId: string,
  setVectorId: React.Dispatch<React.SetStateAction<string>>,
}

export const ChatBoxContext = createContext<ChatBoxType>({
  isAnalyzing: false,
  setIsAnalyzing: () => { },
  vectorId: '',
  setVectorId: () => { },
});

export default function ChatBoxProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [vectorId, setVectorId] = useState<string>('')
  


  return (
    <ChatBoxContext.Provider
      value={{
        setIsAnalyzing,
        isAnalyzing,
        vectorId,
        setVectorId
      }}
    >
      {children}
    </ChatBoxContext.Provider>
  );
}

export function useChatBoxContext() {
  const context = useContext(ChatBoxContext);
  if (!context)
    throw new Error("useChatBoxContext must be used within ChatBoxProvider");
  return context;
}
