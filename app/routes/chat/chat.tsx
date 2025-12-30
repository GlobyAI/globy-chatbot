import type { Route } from "../../+types/root";
import ChatBox from "./components/chatbox/chat-box";
import { useAuth0, User, withAuthenticationRequired } from "@auth0/auth0-react";
import History from "./components/history";
import SpinnerLoading from "~/components/ui/SpinnerLoading/SpinnerLoading";
import Sidebar from "./components/sidebar/sidebar";
import { useWebSocket } from "~/providers/WSProdivder";
import { SENDER } from "~/types/enums";
import { useEffect, useMemo, useState } from "react";
import Complete from "./components/complete";
import useLoadMoreHistory from "~/hooks/useLoadMoreHistory";
import MenuIcon from "/icons/menu.svg";
import useAppStore from "~/stores/appStore";
import ChatBoxProvider from "~/providers/ChatboxProvider";
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "globy.ai  | Chatbot", },
    { name: "description", content: "globy.ai  transforms your identity into a powerful brand through color, motion, shape, imagery, and copy - fused into one living website" },
  ];
}

function Chat() {
  const { messages } = useWebSocket()
  const { containerRef } = useLoadMoreHistory()
  const canContinue = useMemo(() => {
    return messages.some(m => m.role === SENDER.USER) && messages[messages.length - 1].role === SENDER.ASSISTANT
  }, [messages])
  const setHasNews = useAppStore(s => s.setHasNews)
  const hasNews = useAppStore(s => s.hasNews)

  const [show, setShow] = useState(true)
  const handleCloseSidebar = () => {
    setShow(false)
  }
  const handleOpenSidebar = () => {
    setShow(true)
    setHasNews(false)
  }
  const handleToggle = () => {
    setShow(prev => !prev)
  }


  return <main className={`chat-bot ${show ? '' : 'hide'}`} ref={containerRef}>
    <Sidebar handleCloseSidebar={handleCloseSidebar} handleToggle={handleToggle} />
    <div className="chat-window" >
      <div className="heading">
        <span className={`menu-icon ${hasNews ? 'news' : ''}`}>
          <img src={MenuIcon} onClick={handleOpenSidebar} />
        </span>
        <div className="heading__brand">
          <strong>globy.ai </strong>
          <small>Onboarding</small>
        </div>
        {
          canContinue &&
          <Complete />
        }
      </div>
      <ChatBoxProvider>
        <History />
        <div className="prompt-box">
          {/* <Suggestions /> */}
          {/* <Continue/> */}
          <ChatBox />
        </div>
      </ChatBoxProvider>
      <p></p>
    </div>
  </main>;
}


const ChatPage = withAuthenticationRequired(Chat, {
  returnTo: window.location.pathname + window.location.search,
  onRedirecting: () => <SpinnerLoading />,
});
export default ChatPage