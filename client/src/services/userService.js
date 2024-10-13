import * as CONSTANTS from "../common/constants"

export const fetchUserDetails = async () => {
    
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    const response = await fetch(CONSTANTS.GET_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
    });
    const { userDetails = {} } = await response.json();
    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};