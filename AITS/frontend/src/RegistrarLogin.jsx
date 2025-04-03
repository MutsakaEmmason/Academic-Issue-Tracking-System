import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Stack, 
  Text, 
  useToast 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrarLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        email: email,
        password: password,
      });
      
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/registrar-dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" margin="0 auto">
      <Stack spacing={4} p={8} backgroundColor="white" boxShadow="md" borderRadius="md">
        <Heading size="lg" textAlign="center">Registrar Login</Heading>
        
        {error && (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        )}
        
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={loading}
              loadingText="Logging in"
            >
              Sign in
            </Button>
          </Stack>
        </form>
        
        <Text textAlign="center" pt={4}>
          Don't have an account?{' '}
          <Button
            variant="link"
            colorScheme="teal"
            onClick={() => navigate('/registrar-signup')}
          >
            Sign up
          </Button>
        </Text>
      </Stack>
    </Box>
  );
};

export default RegistrarLogin;