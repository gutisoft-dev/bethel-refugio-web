export interface UserResponse {
  id: string;
  username: string;
  is_following?: boolean;
  follows_me?: boolean;
  is_friend?: boolean;
  email?: string;
  is_email_verified?: boolean;
  created_at?: string;
}


