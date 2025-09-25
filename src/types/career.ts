export interface JobPosition {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  department: string;
  shortDescription: string;
  description: string;
  requirements: string;
  benefits: string;
  salary?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobPositionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'NEW' | 'REVIEWED' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  createdAt: string;
  updatedAt: string;
  jobPosition?: JobPosition;
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type ApplicationStatus = 'NEW' | 'REVIEWED' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';