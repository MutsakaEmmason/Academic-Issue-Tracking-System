// Function to fetch CSRF token
export const fetchCSRFToken = async () => {
    try {
        const apiUrl = process.env.NODE_ENV === 'production' 
            ? 'https://academic-issue-tracking-system-1-8cyq.onrender.com/api/csrf-token/'
            : '/api/csrf-token/';
            
        await fetch(apiUrl, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};
