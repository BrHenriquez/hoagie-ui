export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Hoagie {
  _id: string;
  name: string;
  ingredients: string[];
  picture?: string;
  creator: User;
  collaborators: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  user: User;
  hoagie: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface HoagieFormData {
  name: string;
  ingredients: string[];
  picture?: string;
}

export interface CommentFormData {
  text: string;
} 