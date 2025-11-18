import type { Route } from "../../+types/root";
import ChatBox from "./components/chat-box";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import History from "./components/history";
import SpinnerLoading from "~/components/ui/SpinnerLoading/SpinnerLoading";
import Sidebar from "./components/sidebar";
import { useWebSocket } from "~/providers/WSProdivder";
import { SENDER } from "~/types/enums";
import { useEffect, useMemo, useRef, useState } from "react";
import Complete from "./components/complete";
import useLoadMoreHistory from "~/hooks/useLoadMoreHistory";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function Chat() {
  const { messages } = useWebSocket()
  const { containerRef } = useLoadMoreHistory()
  const canContinue = useMemo(() => {
    return messages.some(m => m.role === SENDER.USER) && messages[messages.length - 1].role === SENDER.ASSISTANT
  }, [messages])
  const [show, setShow] = useState(true)
  const toggleSidebar = () => {
    setShow(prev => !prev)
  }

  return <main className={`chat-bot ${show ? '' : 'hide'}`} ref={containerRef}>
    <Sidebar toggleSidebar={toggleSidebar} />
    <div className="chat-window" >
      <div className="heading">
        <div className="heading__brand">
          <strong>Globy.ai </strong>
          <small>Onboarding</small>

        </div>
        {
          canContinue &&
          <Complete />
        }
      </div>
      <History />
      <div className="prompt-box">
        {/* <Suggestions /> */}
        {/* <Continue/> */}
        <ChatBox />

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