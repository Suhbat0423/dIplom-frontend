// src/apis/store/login.js   (or wherever it is)

export const login = async (email, password) => {
  try {
    const res = await fetch("http://localhost:3003/stores/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const response = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: response?.message || "Login failed",
      };
    }

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Login failed",
    };
  }
};
