export interface User {
    id: number;
    email: string;
    role: 'customer' | 'agent';
    verified: boolean;
  }
  
  export interface Listing {
    id: number;
    title: string;
    price: number;
    location: string;
    description: string;
    agent_id: number;
    created_at: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface CommunicationResponse {
    virtualNumber?: string;
    virtualEmail?: string;
    communicationId: number;
  }