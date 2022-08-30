import {
  Box,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {useStore} from "../lib/zustand";
import { ArrowRightIcon, RepeatIcon } from "@chakra-ui/icons";

import { saveWorkBook, exportData } from "../lib/excelJS";
import ChooseList from "./ChooseList";
import { useEffect } from "react";


var stringSimilarity = require("string-similarity");

function Matcher({ matchIndex, finalList, matchList }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addMatch = useStore((state) => state.addMatch);
  const increaseIndex = useStore((state) => state.increaseIndex);
  const goNext = useStore((state) => state.goNext);

  const toMatch = finalList[matchIndex].param.toString();

  const result = stringSimilarity.findBestMatch(toMatch, matchList.map(item => item.toString()));
  const sortedResult = result.ratings
    .sort((a, b) => b.rating - a.rating)
    .filter((item, i) => i <= 2);

  const commitMatch = (item) => {
    addMatch(item, matchIndex);
    goNext();
  };

  const skipMatch = ()=> {
    addMatch("-", matchIndex);
    goNext();
  }

  const handleKeyPress = event => {
    if (event.altKey  === true) {

      if (event.key === "1") {
        console.log(matchIndex)
        console.log(sortedResult[0].target)
        commitMatch(sortedResult[0].target)
      } 
      if (event.key === "2") {
        commitMatch(sortedResult[1].target)
      } 
      if (event.key === "3") {
        commitMatch(sortedResult[2].target)
      } 
      if (event.key === "4") {
        goNext()
      } 
      if (event.key === "5") {
        skipMatch()
      } 

    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [matchIndex]);



  return (
    <>
    <ChooseList matchIndex={matchIndex} onClose={onClose} isOpen={isOpen} matchList={matchList}/>


      <Box my={10} h={"2px"} w={"100%"} bg={"blackAlpha.200"} />
      <Center>
        <VStack>
          <Heading mb={5} size={"md"}>
            Looking for
          </Heading>
          <Box p={2} bg={"gray.100"}>
            {toMatch}
          </Box>
        </VStack>
      </Center>
      <Box my={10} h={"2px"} w={"100%"} bg={"blackAlpha.200"} />
      <Center mt={5}>
        <VStack>
          <Heading mb={5} size={"md"}>
            Choose from TOP-3
          </Heading>
          <HStack spacing={20} justifyContent={"space-evenly"}>
            {sortedResult.map((item, i) => (
              <VStack key={i}>
                <span>
                  <Kbd>ALT</Kbd> + <Kbd>{i + 1}</Kbd>
                </span>
                <Box>
                  <Button onClick={() => commitMatch(item.target)} >
                    {item.target}
                  </Button>
                  <CircularProgress
                    ml={5}
                    value={item.rating * 100}
                    color="blue.400"
                  >
                    <CircularProgressLabel>
                      {Math.round(item.rating * 100)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </Box>
              </VStack>
            ))}
          </HStack>
          <HStack mt={"10!important"} spacing={20} justifyContent={"space-between"}>
            <VStack>
              <span>
                <Kbd>ALT</Kbd> + <Kbd>{4}</Kbd>
              </span>
              <Box>
                <Button onClick={()=>goNext()} leftIcon={<RepeatIcon />}>Ask me later</Button>
              </Box>
            </VStack>
            <VStack>
              <span>
                <Kbd>ALT</Kbd> + <Kbd>{5}</Kbd>
              </span>
              <Box>
              <Button onClick={()=>skipMatch()} leftIcon={<ArrowRightIcon />}>Skip</Button>
              </Box>
            </VStack>
          </HStack>
        </VStack>
      </Center>

      <Center mt={10}>
        <VStack>
          <Heading mb={5} size={"md"}>
            Choose from whole list
          </Heading>
          <Button onClick={onOpen}>List</Button>
        </VStack>
      </Center>


    </>
  );
}

export default Matcher;
