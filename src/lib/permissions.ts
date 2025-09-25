// Client-side permission utilities (safe for browser)
export function canAccessBlogs(userRole: string): boolean {
  return userRole === 'ADMIN' || userRole === 'EDITOR';
}

export function canAccessReferences(userRole: string): boolean {
  return userRole === 'ADMIN' || userRole === 'EDITOR';
}

export function canAccessAnalytics(userRole: string): boolean {
  return userRole === 'ADMIN'; // Pouze admin má přístup k analytics
}

export function canAccessUsers(userRole: string): boolean {
  return userRole === 'ADMIN'; // Pouze admin má přístup ke správě uživatelů
}

export function canAccessSettings(userRole: string): boolean {
  return userRole === 'ADMIN' || userRole === 'EDITOR'; // Oba mají přístup, ale omezený pro editora
}

export function canAccessFullSettings(userRole: string): boolean {
  return userRole === 'ADMIN'; // Pouze admin má plný přístup k nastavením
}

export function canAccessJobs(userRole: string): boolean {
  return userRole === 'ADMIN'; // Pouze admin má přístup ke správě pozic
}

export function canAccessJobApplications(userRole: string): boolean {
  return userRole === 'ADMIN'; // Pouze admin má přístup k žádostem o práci
}