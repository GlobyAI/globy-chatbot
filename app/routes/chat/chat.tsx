import { useHorizontalScroll } from "~/hooks/useHorizontalScroll";
import type { Route } from "../../+types/root";
import Suggestions from "./components/suggestions";
import Textfield from "./components/textfield";
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Chat() {

  return <main className="chat-bot">
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src="/images/globy_symbol.png" alt="Globy Chat" className="logo" />
      </div>
      <div className="sidebar__process">

      </div>
      <div className="sidebar__settings">
        <img src="/images/user.jpg" alt="User" className="user-avatar" />
        <div className="user-info">
          <strong>User name</strong>
          <p>email@gmail.com</p>
        </div>
      </div>
    </div>
    <div className="chat-window">
      <div className="heading">
        <strong>Globy.ai </strong>
        <small>Onboarding</small>
      </div>
      <div className="chat">
        <ul className="chat__history">
          <li className="message">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content ">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message  message--user">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content ">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message  message--user">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content ">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message  message--user">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content ">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
          <li className="message  message--user">
            <div className="message__logo">
              <img src="/images/globy_symbol.png" alt="Globy avatar" />
              Globy.ai
            </div>
            <p className="message__content">
              Welcome to Globy — let’s bring your brand to life online. I’ll ask you a few quick questions to get a feel for your business. Ready?
            </p>
          </li>
        </ul>
      </div>
      <div className="prompt-box">
        <Suggestions />
        <Textfield />
      </div>
    </div>
  </main>;
}
