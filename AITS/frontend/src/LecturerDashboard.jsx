import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, HStack, Heading } from '@chakra-ui/react';

const LecturerDashboard = () => {
  const [lecturer, setLecturer] = useState(null);

  useEffect(() => {
    // Fetch lecturer details (this is just a mockup)
    // In a real-world scenario, you would fetch this data from your backend
    const fetchLecturerDetails = async () => {
      try {
        const response = await fetch('/api/lecturer/details', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'), // Use the token for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLecturer(data);
        } else {
          // Handle error (e.g., redirect to login if not authenticated)
          console.error('Failed to fetch lecturer details');
        }
      } catch (error) {
        console.error('Error fetching lecturer details', error);
      }
    };

    fetchLecturerDetails();
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear the token (this is just an example, you should also handle session expiration)
    localStorage.removeItem('token');
    // Redirect to login page after logout (you can use a routing library like React Router)
    window.location.href = '/login';
  };

  if (!lecturer) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading lecturer details...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" p={4} borderRadius="md" boxShadow="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Heading size="lg" textAlign="center">
          Lecturer Dashboard
        </Heading>

        <Box>
          <Text fontSize="xl">
            <strong>Full Name:</strong> {lecturer.fullName}
          </Text>
          <Text fontSize="xl">
            <strong>Email:</strong> {lecturer.email}
          </Text>
          <Text fontSize="xl">
            <strong>Courses Taught:</strong> {lecturer.courses.join(', ')}
          </Text>
        </Box>

        <HStack spacing={4} justify="center">
          <Button colorScheme="blue" onClick={handleLogout}>
            Logout
          </Button>
          {/* You can add more buttons here (e.g., for course management, profile update, etc.) */}
        </HStack>
      </VStack>
    </Box>
  );
};

export default LecturerDashboard;
