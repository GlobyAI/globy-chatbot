import type { Route } from "../../+types/root";
// import Suggestions from "./components/suggestions";
import ChatBox from "./components/chat-box";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import History from "./components/history";
import SpinnerLoading from "~/components/ui/SpinnerLoading/SpinnerLoading";
import Sidebar from "./components/sidebar";
// import Continue from "./components/Continue";
import { useWebSocket } from "~/providers/WSProdivder";
import { SENDER } from "~/types/enums";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Complete from "./components/complete";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function Chat() {
  const { messages } = useWebSocket()

  const canContinue = useMemo(() => {
    return messages.some(m => m.sender === SENDER.USER) && messages[messages.length - 1].sender === SENDER.GLOBY
  }, [messages])

  return <main className="chat-bot">
    <Sidebar />
    <div className="chat-window" >
      <div className="heading">
        <strong>Globy.ai </strong>
        <small>Onboarding</small>
      </div>
      <History />
      <div className="prompt-box">
        {/* <Suggestions /> */}
        {/* <Continue/> */}
        <ChatBox />
        {
          canContinue &&
          <Complete />
        }
      </div>
      <p></p>
    </div>
  </main>;
}


const ChatPage = withAuthenticationRequired(Chat, {
  returnTo: "/",
  onRedirecting: () => <SpinnerLoading />,
});
export default ChatPage