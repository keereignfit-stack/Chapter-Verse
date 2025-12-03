export enum AppSection {
  HOME = 'HOME',
  DATES = 'DATES',
  WEDDING = 'WEDDING',
  TRAVEL = 'TRAVEL',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface AIResponse {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
