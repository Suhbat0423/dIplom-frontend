// src/apis/user/getUsers.js   (or wherever it is)

export const getUsers = async () => {
  try {
    const res = await fetch("http://0.0.0.0:3001/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
