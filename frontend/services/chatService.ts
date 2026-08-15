import api from './api';

export interface ChatMessage {
  id: number;
  trip_id: number;
  sender: 'user' | 'ai' | 'system';
  message: string;
  resulted_version?: number | null;
  created_at: string;
}

export interface ChatResponse {
  user_message: ChatMessage;
  ai_message: ChatMessage;
  is_revision: boolean;
  change_summary?: string;
  new_version?: number;
  updated_days?: any[];
}

export interface TripVersion {
  id: number;
  trip_id: number;
  version_number: number;
  change_summary: string;
  snapshot_json: any;
  created_by: string;
  created_at: string;
}

export const chatService = {
  async getChatHistory(tripId: number | string): Promise<ChatMessage[]> {
    const res = await api.get<{ messages: ChatMessage[]; count: number }>(`/trips/${tripId}/chat`);
    return res.data.messages || [];
  },

  async sendMessage(tripId: number | string, message: string): Promise<ChatResponse> {
    const res = await api.post<ChatResponse>(`/trips/${tripId}/chat`, { message });
    return res.data;
  },

  async getVersions(tripId: number | string): Promise<TripVersion[]> {
    const res = await api.get<{ versions: TripVersion[]; count: number }>(`/trips/${tripId}/versions`);
    return res.data.versions || [];
  },

  async rollbackVersion(tripId: number | string, version: number): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(`/trips/${tripId}/versions/rollback`, { version });
    return res.data;
  },
};
