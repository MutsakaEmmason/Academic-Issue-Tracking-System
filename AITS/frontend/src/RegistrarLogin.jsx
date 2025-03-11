// src/RegistrarLogin.jsx
import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const RegistrarLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // You can add your authentication logic here, like calling an API
    console.log({ username, password });
  };

  return (
    <VStack spacing={4} align="center" p={8}>
      <FormControl id="username" isRequired>
        <FormLabel>Username</FormLabel>
        <Input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
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
      <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
    </VStack>
  );
};

export default RegistrarLogin;
