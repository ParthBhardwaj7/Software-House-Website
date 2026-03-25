export type TeamMemberPublic = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
  linkedinUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
