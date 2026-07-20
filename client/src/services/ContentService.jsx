import React from 'react'

// fetch the content from the backend and display it in the frontend

const uploadContent =async(formData)=>{  //title, description, subject, startTime, endTime, rotationDuration, rotationOrder
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/content/upload`, {
            method: 'POST',
            body: formData,
            credentials: "include"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading content:', error);
        throw error;
    }
}

//  Teacher views own content
const getMyContent =async()=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/content/my-content`, {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my content:', error);
        throw error;
    }
}

// Student views live content
const getLiveContent = async (teacherId, subject = "") => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/content/live/${teacherId}?subject=${encodeURIComponent(subject)}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching live content:", error);
        throw error;
    }
};

// get content by subject
const getContentBySubject =async(subject)=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/content/subject/${subject}`, {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching content by subject:', error);
        throw error;
    }
}

// get all approved content for students to view
const getAllApprovedContent = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/content/approved`, {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all approved content:', error);
        throw error;
    }
}

// get all content for analytics
const getAllContent = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/content/all`, {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all content:', error);
        throw error;
    }
};

export {uploadContent, getMyContent, getLiveContent, getContentBySubject, getAllApprovedContent, getAllContent};