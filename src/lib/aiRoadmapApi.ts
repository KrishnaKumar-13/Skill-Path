import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") +
  "/api/ai-roadmap";

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
  console.log("getAuthHeaders START");

  const result = await supabase.auth.getSession();

  console.log("Session result:", result);

  const session = result.data.session;

  console.log("Session:", session);

  const headers = {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
  };

  console.log("Headers ready");

  return headers;
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

export const getUserRoadmaps = async (
  userId: string
): Promise<AIRoadmapResponse[]> => {

  console.log("========== getUserRoadmaps ==========");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("User ID:", userId);

  const headers = await getAuthHeaders();

  console.log("Sending request to:");
  console.log(`${API_BASE_URL}?userId=${userId}`);

  const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
    headers,
  });

  console.log("Response Status:", response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.error || `Request failed with status ${response.status}`
    );
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
