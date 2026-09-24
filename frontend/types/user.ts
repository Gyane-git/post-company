export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Marketing Lead' | 'Content Creator';
  avatar: string;
  bio: string;
  timezone: string;
  language: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  avatar: string;
  status: 'active' | 'invited';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  plan: string;
  members: WorkspaceMember[];
}
