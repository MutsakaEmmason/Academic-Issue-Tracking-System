import React, { useState } from 'react';
import {
    VStack,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    Select,
    Flex,
    Textarea,
} from "@chakra-ui/react";

const IssueSubmissionForm = ({ studentName }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [attachments, setAttachments] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [lecturer, setLecturer] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const issueDate = new Date().toISOString().split('T')[0]; // Get current date

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            title,
            description,
            category,
            courseCode,
            attachments,
            studentName,
            studentId,
            issueDate,
            priority,
            lecturer,
            department,
            semester,
            academicYear,
        });
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6} p={8} align="center">
                <Text fontSize="2xl" fontWeight="bold">Submit an Issue</Text>
                <Box w="100%" maxW="400px">
                    <FormControl>
                        <FormLabel>Title/Issue Subject:</FormLabel>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Description/Details:</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Category/Type of Issue:</FormLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select...</option>
                            <option value="missing_marks">Missing Marks</option>
                            <option value="appeals">Appeals</option>
                            <option value="corrections">Corrections</option>
                        </Select>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Course Code:</FormLabel>
                        <Input
                            type="text"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Student ID/Registration Number:</FormLabel>
                        <Input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Priority/Urgency:</FormLabel>
                        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </Select>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Specific Lecturer:</FormLabel>
                        <Input
                            type="text"
                            value={lecturer}
                            onChange={(e) => setLecturer(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Department:</FormLabel>
                        <Input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Semester:</FormLabel>
                        <Input
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Academic Year:</FormLabel>
                        <Input
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Attachments:</FormLabel>
                        <Input
                            type="file"
                            onChange={(e) => setAttachments(e.target.files[0])}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Date of Issue:</FormLabel>
                        <Input type="text" value={issueDate} isReadOnly />
                    </FormControl>

                    <Button type="submit" colorScheme="green" mt={6} w="100%">
                        Submit
                    </Button>
                </Box>
            </VStack>
        </form>
    );
};

export default IssueSubmissionForm;