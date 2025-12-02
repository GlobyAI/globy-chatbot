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
import { useNavigate } from "react-router";
import { APP_ROUTES } from "~/utils/vars";
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Globy.ai | Chatbot", },
    { name: "description", content: "Globy.ai transforms your identity into a powerful brand through color, motion, shape, imagery, and copy - fused into one living website" },
  ];
}

function Chat() {
  const { messages } = useWebSocket()
  const { user, isAuthenticated, isLoading } = useAuth0()
  const { containerRef } = useLoadMoreHistory()
  const navigate = useNavigate()
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
  const hasPaid = (user: User | undefined) => {
    if (
      user &&
      user["https://globy.ai/has_paid"] === true
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const currentPlan = user["https://globy.ai/plan"];
      // No plan selected  → invalid
      if (!currentPlan) {
        navigate(APP_ROUTES.PRICE);
        return
      }

      // Non-free plan but not paid → invalid
      if (currentPlan !== "FREE" && !hasPaid(user)) {
        navigate(APP_ROUTES.PRICE);
        return
      }
    }

  }, [user, isAuthenticated, isLoading])

  return <main className={`chat-bot ${show ? '' : 'hide'}`} ref={containerRef}>
    <Sidebar handleCloseSidebar={handleCloseSidebar} handleToggle={handleToggle} />
    <div className="chat-window" >
      <div className="heading">
        <span className={`menu-icon ${hasNews ? 'news' : ''}`}>
          <img src={MenuIcon} onClick={handleOpenSidebar} />
        </span>
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