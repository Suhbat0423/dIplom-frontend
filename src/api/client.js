import { API_BASE_URLS } from "@/api/config";

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
  service,
  path,
  { method = "GET", body, token, headers = {} } = {},
) => {
  const baseUrl = API_BASE_URLS[service];

  if (!baseUrl) {
    throw new Error(`Unknown API service: ${service}`);
  }

  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
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
      message: `Cannot connect to ${service} service at ${baseUrl}.`,
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
