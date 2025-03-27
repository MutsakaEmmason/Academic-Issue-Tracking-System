import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    VStack,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    Select,
    Textarea,
} from "@chakra-ui/react";
import Footer from '../components/Footer';

const IssueSubmissionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [studentId, setStudentId] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [lecturer, setLecturer] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [attachments, setAttachments] = useState(null);
    const issueDate = new Date().toISOString().split('T')[0];
    const [studentName, setStudentName] = useState(''); // Add studentName state

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !category || !courseCode || !studentId || !studentName) {
            alert("Please fill in all the required fields.");
            return;
        }

        const formData = {
            title,
            description,
            category,
            courseCode,
            studentId,
            priority,
            lecturer,
            department,
            semester,
            academicYear,
            issueDate,
            studentName: studentName, // Use studentName from state
        };

        if (attachments) {
            formData.attachments = attachments;
        }

        console.log("Form Data Submitted:", formData);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/issues/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/student-dashboard');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Issue submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting issue:', error);
            alert('Error submitting issue. Please check your connection and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6} p={8} align="center">
                <Text fontSize="2xl" fontWeight="bold">Submit an Issue</Text>
                <Box w="100%" maxW="400px">
                    <FormControl>
                        <FormLabel>Title/Issue Subject:</FormLabel>
                        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Description/Details:</FormLabel>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Category/Type of Issue:</FormLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select...</option>
                            <option value="missing_marks">Missing Marks</option>
                            <option value="appeals">Appeals</option>
                            <option value="corrections">Corrections</option>
                            <option value="technical">Technical</option>
                            <option value="administrative">Administrative</option>
                            <option value="course_registration">Course Registration</option>
                        </Select>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Course Code:</FormLabel>
                        <Input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Student ID/StudentNumber:</FormLabel>
                        <Input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Student Full Name:</FormLabel>
                        <Input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Priority/Urgency:</FormLabel>
                        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </Select>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Specific Lecturer:</FormLabel>
                        <Input type="text" value={lecturer} onChange={(e) => setLecturer(e.target.value)} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Department:</FormLabel>
                        <Input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Semester:</FormLabel>
                        <Input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Academic Year:</FormLabel>
                        <Input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Attachments:</FormLabel>
                        <Input type="file" onChange={(e) => setAttachments(e.target.files[0])} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Date of Issue:</FormLabel>
                        <Input type="text" value={issueDate} isReadOnly />
                    </FormControl>

                    <Button type="submit" colorScheme="green" mr={2}>Submit an Issue</Button>
                </Box>
                <Footer userRole="student" />
            </VStack>
            
        </form>
    );
};
export default IssueSubmissionForm;