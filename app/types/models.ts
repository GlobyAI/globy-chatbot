import type { MessageType, SENDER } from "./enums";

export interface MessageBase {
  message_id: string;
  type: MessageType;
}
export interface MessageResponse extends MessageBase {
  delta: string;
}

export interface ChatMessage {
  message_id: string;
  sender: SENDER;
  content: string;
}

export interface MessageData {
  text: string;
  image_urls?: string[];
  research: boolean;
  expect_json?: boolean;
}

export interface MessageRequest extends MessageBase {}

export interface IUploadFile {
  id:string
  url: string;
  file: File
  pct:number;
  bucket:string,
  key:string
}
