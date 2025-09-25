export interface Reference {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  category: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferenceRequest {
  title: string;
  slug: string;
  location: string;
  description: string;
  category: string;
  image?: string;
  published?: boolean;
}

export interface UpdateReferenceRequest {
  title?: string;
  slug?: string;
  location?: string;
  description?: string;
  category?: string;
  image?: string;
  published?: boolean;
}