export const API_BASE_URL = "https://api.petti.vet/v1";

export const API_ENDPOINTS = {
  guardianSummary: (petId: string) =>
    `${API_BASE_URL}/guardian/summary?pet_id=${petId}`,
  videoUpload: `${API_BASE_URL}/guardian/videos/upload`,
  latestAnalysis: (petId: string) =>
    `${API_BASE_URL}/guardian/analyses/latest?pet_id=${petId}`,
  trend: (petId: string) =>
    `${API_BASE_URL}/guardian/trend?pet_id=${petId}`,
};
