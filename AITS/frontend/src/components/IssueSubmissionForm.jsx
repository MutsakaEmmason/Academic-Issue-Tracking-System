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
} from "@chakra-ui/react";

const IssueSubmissionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [attachments, setAttachments] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ title, description, category, courseCode, attachments });
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
                        <Input 
                            as="textarea" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Category/Type of Issue:</FormLabel>
                        <Select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            required
                        >
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
                        <FormLabel>Attachments:</FormLabel>
                        <Input 
                            type="file" 
                            onChange={(e) => setAttachments(e.target.files[0])} 
                        />
                    </FormControl>
                    <Button 
                        type="submit" 
                        colorScheme="green" 
                        mt={6} 
                        w="100%"
                    >
                        Submit
                    </Button>
                </Box>
            </VStack>
        </form>
    );
};

export default IssueSubmissionForm;
