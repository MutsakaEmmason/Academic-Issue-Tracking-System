import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, HStack, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const LecturerDashboard = () => {
  const [lecturer, setLecturer] = useState();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Ensure the token is being retrieved from localStorage correctly
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    const fetchLecturerDetails = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/lecturer/details/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLecturer(data);
          fetchAssignedIssues(data.id);  // Fetch issues after lecturer details are loaded
        } else {
          console.error('Failed to fetch lecturer details', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching lecturer details', error);
      }
    };

    const fetchAssignedIssues = async (lecturerId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/issues?assigned_to=${lecturerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIssues(data);
        } else {
          console.error('Failed to fetch assigned issues', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching assigned issues', error);
      }
    };

    fetchLecturerDetails();
  }, []);

  const markIssueResolved = async (issueId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/issues/${issueId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIssues(issues.map(issue => issue.id === issueId ? { ...issue, status: 'Resolved' } : issue));
        alert('Issue marked as resolved');
      } else {
        console.error('Failed to resolve issue', response.statusText);
      }
    } catch (error) {
      console.error('Error resolving issue', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!lecturer) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading lecturer details... (line 94)</Text>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" p={4} borderRadius="md" boxShadow="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Heading size="lg" textAlign="center">Lecturer Dashboard</Heading>
        <Box>
          <Text fontSize="xl"><strong>Full Name:</strong> {lecturer.fullName}</Text>
          <Text fontSize="xl"><strong>Email:</strong> {lecturer.email}</Text>
          <Text fontSize="xl"><strong>Courses Taught:</strong> {lecturer.courses.join(', ')}</Text>
        </Box>
        
        <Heading size="md">Assigned Issues</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Issue ID</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {issues.map(issue => (
              <Tr key={issue.id}>
                <Td>{issue.id}</Td>
                <Td>{issue.type}</Td>
                <Td>{issue.status}</Td>
                <Td>
                  {issue.status !== 'Resolved' && (
                    <Button colorScheme="green" size="sm" onClick={() => markIssueResolved(issue.id)}>
                      Mark Resolved
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        
        <HStack spacing={4} justify="center">
          <Button colorScheme="blue" onClick={handleLogout}>Logout</Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LecturerDashboard;
