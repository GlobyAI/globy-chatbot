import type { Route } from "../../+types/root";
import ChatBox from "./components/chat-box";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import History from "./components/history";
import SpinnerLoading from "~/components/ui/SpinnerLoading/SpinnerLoading";
import Sidebar from "./components/sidebar";
import { useWebSocket } from "~/providers/WSProdivder";
import { SENDER } from "~/types/enums";
import { useMemo } from "react";
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
    return messages.some(m => m.role === SENDER.USER) && messages[messages.length - 1].role === SENDER.ASSISTANT
  }, [messages])

  return <main className="chat-bot">
    <Sidebar />
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