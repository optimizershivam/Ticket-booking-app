import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Card, CardBody, Center, Flex, Grid, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { MdOutlineAirlineSeatReclineNormal, MdEventSeat } from "react-icons/md";
import { FallingLines } from 'react-loader-spinner'


function App() {
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [count, setCount] = useState(0);
  const [booked, setBooked] = useState([]);
  const toast = useToast();

  const loader = <FallingLines
    color="#4fa94d"
    width="500"
    visible={true}
    ariaLabel='falling-lines-loading'
  />

  useEffect(() => {
    getSeats();
  });

  const getSeats = () => {
    axios.get(`http://localhost:8080/seats`)
      .then((res) => {
        setSeats(res.data)
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleBooking = () => {
    if (count > 7) {
      toast({
        title: "You cannot book more than 7 seats at once.",
        status: "error",
        position: "top",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    if (count <= 0) {
      toast({
        title: "Enter valid number for book a seat.",
        status: "error",
        position: "top",
        duration: 1000,
        isClosable: true
      });
      return;

    }
    setLoading(true)
    axios.patch(`http://localhost:8080/seats/book`, { "seats": Number(count) })
      .then((res) => {
        setBooked(res.data);
        toast({
          title: "Booking Successful",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true
        });
        getSeats();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: "error",
          position: "top",
          isClosable: true
        })
      });
  };


  const handleReset = () => {
    setBooked([])
    axios.patch(`http://localhost:8080/seats/reset`)
      .then((res) => console.log(res),
      toast({
        title: "All seats are available for booking",
        status: "info",
        position: "top",
        isClosable: true
      })
      )
      .catch((error) => console.log(error));
   
  }

  if (loading) {
    return (
      <Flex h={"100vh"} w={"100vw"} justifyContent={"center"} alignItems={"center"} >
        {loader}
      </Flex>
    )
  }

  return (
    <>
 <Flex as="header" position="fixed" backgroundColor="orange" 
  w="100%" height={50} justifyContent={"center"} >
  <Heading color={'white'}>VIRTUAL TICKET COUNTER</Heading>
 </Flex>
    <div style={{ display: "flex", justifyContent: "center", backgroundImage: "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)"}}>
  <Flex w={"100%"} justifyContent={"space-around"} alignItems={"center"} gap={"30px"} flexDir={{ base: "column", md: "column", lg: "row" }} h={{ base: "auto", md: "100vh", lg: "100vh" }} mt={{ base:20, md:5, lg:5}}>
    <Grid w={{ base: "80%", md: "50%", lg: "30%" }} templateColumns={"repeat(7,1fr)"} bgColor={"white"} p={"10px"} borderRadius={"20px"} boxShadow={"rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px;"}>
      {seats.length > 0 && seats?.map((e) =>
        <Box key={e._id} align="center">
          {e.isBooked ? <MdOutlineAirlineSeatReclineNormal color='red' size={"35px"} /> : <MdEventSeat color="green" size={"35px"} />}
          <Text fontSize={"20"}>{e.seatNumber}</Text>
        </Box>
      )}
    </Grid>
    {booked.length > 0 ?  (<Flex flexDir={{ base: "column", md: "row", lg: "row" }} justifyContent={"center"} align={"center"} gap={"10px"} p={"10px"} minH={{ base: "100vh", md:"auto" }}>
  <Alert
    status='success'
    variant='subtle'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    minH='250px'
  >
    <AlertIcon boxSize='50px' mr={0} />
    <AlertTitle mt={4} mb={1} fontSize='lg'>
      Booking Successful.
      Your Tickets History
    </AlertTitle>
    <Flex flexDir={{ base: "column", md: "row", lg: "row" }} justifyContent={"center"} align={"center"} gap={"10px"} p={"10px"} flexWrap="wrap">
      {booked?.map((e, i) => (
        <AlertDescription key={i} maxWidth='sm' textAlign="center" w={{ base: "100%", md: "auto" }}>
          <Card>
            <CardBody>
              <MdOutlineAirlineSeatReclineNormal color='red' size={"35px"} />
              <Text fontSize={"20px"}>{e}</Text>
            </CardBody>
          </Card>
        </AlertDescription>
      ))}
    </Flex>
  </Alert>
    </Flex>) :( null) }
   



    <Flex w={{ base: "80%", md: "50%", lg: "30%" }} flexDir={"column"} justifyContent={"center"} align={"center"} gap={"10px"} bgColor={"white"} p={"10px"} boxShadow={"0px 10px 15px -3px rgba(0,0,0,0.1);"}>
      <Flex alignItems={"center"} gap={"10px"}>
        <MdOutlineAirlineSeatReclineNormal color='red' size={"35px"} />
        <Text>Booked</Text>
        <MdEventSeat color="green" size={"35px"} />
        <Text>Available</Text>
      </Flex>
      <Heading>Start Booking Your Seat</Heading>
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Text w={"50%"} fontWeight={"bold"}> Select Seats : </Text>
        <Input type={"number"} value={count} onChange={(e) => setCount(e.target.value)} />
      </Flex>
      <Flex justifyContent={"space-around"} alignItems={"center"} gap={"10px"}>
        <Button onClick={handleBooking} colorScheme='teal'>Book Tickets</Button>
        <Button onClick={handleReset} colorScheme='red'>Reset Booking</Button>
      </Flex>
      {booked.length > 0 ? <Heading as='h4' size='md'>Booked Seats : <span style={{ color: 'teal' }}>{booked.join(", ")}</span> </Heading> : null}
    </Flex>
  </Flex>
</div>
</>
  );
}

export default App;
