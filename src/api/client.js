import { API_BASE_URL } from "@/api/config";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiRequest = async (
  path,
  { method = "GET", body, token, headers = {} } = {},
) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...JSON_HEADERS,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return {
      success: false,
      status: 0,
      message: `Cannot connect to API gateway at ${API_BASE_URL}.`,
      data: null,
    };
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      message: data?.message || response.statusText || "Request failed",
      data,
    };
  }

  return { success: true, status: response.status, data };
};
