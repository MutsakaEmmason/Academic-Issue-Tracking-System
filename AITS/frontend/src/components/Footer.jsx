import React from 'react';
import { Box, Text, Link, Flex, VStack, HStack, Icon, Button, Divider } from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      as="footer"
      bg="gray.800" 
      color="white" 
      mt={8}
      width="100%"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-around"
        px={{ base: 4, md: 8 }}
      >
        {/* Contact Us Section */}
        <VStack align="start">
          <Text fontWeight="bold" color="red">Contact Us</Text>
          <Text>Email: info@aits.com</Text>
          <Text>Phone: +(414) 531343437</Text>
          <Text>Address: Makerere, Kampala, Uganda</Text>
        </VStack>

        {/* Follow Us Section */}
        <VStack align="start">
          <Text fontWeight="bold" color="red">Follow Us</Text>
          <HStack spacing={4}>
            <Link href="https://twitter.com" isExternal><Icon as={FaTwitter} /></Link>
            <Link href="https://facebook.com" isExternal><Icon as={FaFacebook} /></Link>
            <Link href="https://whatsapp.com" isExternal><Icon as={FaWhatsapp} /></Link>
            <Link href="https://instagram.com" isExternal><Icon as={FaInstagram} /></Link>
            <Link href="https://tiktok.com" isExternal><Icon as={FaTiktok} /></Link>
          </HStack>
        </VStack>

        {/* Info Section */}
        <VStack align="start">
          <Text fontWeight="bold" color="red">Info</Text>
          <Text>AITS System</Text>
          <Text>Academic Issue Tracking</Text>
          <Text>Makerere University</Text>
        </VStack>

        {/* Links Section */}
        <VStack align="start">
          <Text fontWeight="bold" color="red">Links</Text>
          <Link href="/">Home</Link>
          <Button
            onClick={() => navigate('/about')}
            colorScheme="green"
            mr={2}
          >
            About Us
          </Button>
        </VStack>
      </Flex>

      {/* Copyright Section */}
      <Divider mt={8} mb={4} borderColor="gray.700" /> {/* Adjust divider color */}
      <Text textAlign="center" fontSize="sm">
        Copyright &copy; {new Date().getFullYear()} - Makerere University | AITS (Academic Issue Tracking System)
      </Text>
    </Box>
  );
};

export default Footer;