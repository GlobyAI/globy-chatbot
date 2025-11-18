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
  role: SENDER;
  content: string;
  created_at: Date;
}

export interface MessageData {
  text: string;
  image_urls?: string[];
  research?: boolean;
  expect_json?: boolean;
}

export interface MessageRequest extends MessageBase {}

export interface IUploadFile {
  id: string;
  url: string;
  file: File;
}

export interface CreateSignedUrlPayload {
  bucket: string;
  key: string;
  content_type: string;
  expires: number;
}
