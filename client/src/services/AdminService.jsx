// fetching all services of admin

// fetching pending content 
const getPendingContent = async() => {
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/pending`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
    const data = await response.json();
    return data;
  }catch(error){
    console.error("Error fetching pending content:", error);
  }
}

// approving content

const approveContent =async(id)=>{
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/approve/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
    const data = await response.json();
    return data;

  }catch(error){
    console.error("Error approving content:", error);
  }
}

// rejecting content

const rejectContent =async(id, reason)=>{
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reject/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ reason })
    })
    const data = await response.json();
    return data;

  }catch(error){
    console.error("Error rejecting content:", error);
  }
}


// fetching all content
const getAllContent = async() => {
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/all`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
    const data = await response.json();
    return data;

  }catch(error){
    console.error("Error fetching all content:", error);
  }
}

// getting content by status
const getContentByStatus = async(status) => {
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/status/${status}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json();
    return data;
  }catch(error){
    console.error("Error fetching content by status:", error);
  }
}

export { getPendingContent, approveContent, rejectContent, getAllContent, getContentByStatus };
