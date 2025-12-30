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
  message_id?: string;
  id?: string;
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

export interface UploadedImageBase {
  bucket: string;
  key: string;
  url: string;
  content_type: string;
}
export interface UploadedImage extends UploadedImageBase {
  size?: number;
  last_modified?: string;
  etag?: string;
  thumbnail_key?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  orientation?: string;
  aspect_ratio?: number;
}
export interface KpisResponse {
  data: {
    user_id: string;
    kpis: {
      confidence: number;
    };
  };
}

export interface HistoryResponse {
  user_id: string;
  messages: ChatMessage[];
  pagination: {
    total_count: number;
    limit: number;
    offset: number;
    returned_count: number;
    has_more: boolean;
    next_offset: number | null;
  };
}

export interface ImageLibraryResponse {
  items: UploadedImage[];
}
