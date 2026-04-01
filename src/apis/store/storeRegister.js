export const register = async (name, email, password) => {
  try {
    const res = await fetch("http://localhost:3003/stores/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const response = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: response?.message || "Registration failed",
      };
    }

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Registration failed",
    };
  }
};
