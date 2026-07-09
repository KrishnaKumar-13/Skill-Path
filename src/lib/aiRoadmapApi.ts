import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = "http://localhost:8080/api/ai-roadmap";

export interface AIRoadmapRequest {
  careerGoal: string;
  skillLevel: string;
  currentSkills: string;
  studyHours: string;
  duration: string;
}

export interface AIRoadmapResponse {
  id: string;
  userId: string;
  careerGoal: string;
  skillLevel: string;
  currentSkills: string;
  studyHours: string;
  duration: string;
  roadmapJson: RoadmapJson;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapJson {
  title: string;
  duration: string;
  months: RoadmapMonth[];
}

export interface RoadmapMonth {
  month: number;
  title: string;
  topics: string[];
  resources: string[];
  practice: string[];
  project: string;
  milestone: string;
}

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
  };
};

export const generateAIRoadmap = async (userId: string, request: AIRoadmapRequest): Promise<AIRoadmapResponse> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/generate?userId=${userId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getUserRoadmaps = async (userId: string): Promise<AIRoadmapResponse[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const deleteAIRoadmap = async (id: string, userId: string): Promise<void> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/${id}?userId=${userId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Request failed with status ${response.status}`);
  }
};
