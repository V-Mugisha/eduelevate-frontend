import apiClient from "@/lib/apiClient";

export interface AssessmentQuestion {
  id: string;
  title: string;
  answerOptions: string[];
  correctAnswers?: string[];
  grade: number;
  order: number;
  isSubmitted?: boolean;
}

export interface Assessment {
  id: string;
  lessonId: string;
  title: string | null;
  instructions: string | null;
  isGraded: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: AssessmentQuestion[];
}

export interface SubmitResult {
  results: {
    questionId: string;
    isCorrect: boolean;
    providedAnswers: string[];
    correctAnswers: string[];
    grade: number;
  }[];
  totalScore: number;
  totalPossible: number;
}

export async function getAssessment(lessonId: string): Promise<Assessment | null> {
  const res = await apiClient.get<{ data: Assessment | null }>(`/lessons/${lessonId}/assessment`);
  return res.data.data;
}

export async function createAssessment(
  lessonId: string,
  data: { title?: string; instructions?: string; isGraded?: boolean },
): Promise<Assessment> {
  const res = await apiClient.post<{ data: Assessment }>(`/lessons/${lessonId}/assessment`, data);
  return res.data.data;
}

export async function updateAssessment(
  id: string,
  data: { title?: string; instructions?: string; isGraded?: boolean },
): Promise<Assessment> {
  const res = await apiClient.put<{ data: Assessment }>(`/assessments/${id}`, data);
  return res.data.data;
}

export async function deleteAssessment(id: string): Promise<void> {
  await apiClient.delete(`/assessments/${id}`);
}

export async function getQuestionsOwner(assessmentId: string): Promise<AssessmentQuestion[]> {
  const res = await apiClient.get<{ data: AssessmentQuestion[] }>(
    `/assessments/${assessmentId}/questions/owner`,
  );
  return res.data.data;
}

export async function getQuestionsStudent(assessmentId: string): Promise<AssessmentQuestion[]> {
  const res = await apiClient.get<{ data: AssessmentQuestion[] }>(
    `/assessments/${assessmentId}/questions/student`,
  );
  return res.data.data;
}

export async function createQuestion(
  assessmentId: string,
  data: {
    title: string;
    answerOptions: string[];
    correctAnswers: string[];
    grade?: number;
  },
): Promise<AssessmentQuestion> {
  const res = await apiClient.post<{ data: AssessmentQuestion }>(
    `/assessments/${assessmentId}/questions`,
    data,
  );
  return res.data.data;
}

export async function updateQuestion(
  id: string,
  data: {
    title?: string;
    answerOptions?: string[];
    correctAnswers?: string[];
    grade?: number;
  },
): Promise<AssessmentQuestion> {
  const res = await apiClient.put<{ data: AssessmentQuestion }>(`/questions/${id}`, data);
  return res.data.data;
}

export async function deleteQuestion(id: string): Promise<void> {
  await apiClient.delete(`/questions/${id}`);
}

export async function submitAssessment(
  assessmentId: string,
  answers: { questionId: string; providedAnswers: string[] }[],
): Promise<SubmitResult> {
  const res = await apiClient.post<{ data: SubmitResult }>(`/assessments/${assessmentId}/submit`, {
    answers,
  });
  return res.data.data;
}
