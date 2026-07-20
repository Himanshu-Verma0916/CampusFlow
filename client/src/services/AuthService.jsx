// fetch the login form from the backend and display it in the frontend

const registerUser = async (name, email, password, role) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role }),
      credentials: "include"
    })

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    
    return data;


  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    })

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

const getProfile = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })
    const user = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
const logoutUser = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
      method: 'POST',
      credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    
    return data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export { registerUser, loginUser, getProfile, logoutUser }
