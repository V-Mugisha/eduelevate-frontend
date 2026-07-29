export interface StudentStats {
  enrolledCourses: number;
  certificatesEarned: number;
  activeMentorships: number;
  recentEnrollments: {
    courseId: string;
    courseTitle: string;
    courseSubtitle: string | null;
    enrolledAt: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
  }[];
}

export interface EducatorStats {
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  pendingMentorshipApplications: number;
  recentCourses: {
    id: string;
    title: string;
    isPublished: boolean;
    category: string;
    enrolledCount: number;
    createdAt: string;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;
  recentAuditLogs: {
    id: string;
    action: string;
    entityType: string;
    status: string;
    createdAt: string;
    performer: { id: string; firstName: string; lastName: string } | null;
  }[];
}

export type DashboardStats = StudentStats | EducatorStats | AdminStats;
