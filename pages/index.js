import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Lorem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

import DropFile from "../components/DropFile";
import {useStore} from "../lib/zustand";

export default function Home() {
  const matchList = useStore((state) => state.matchList);
  const compareList = useStore((state) => state.compareList);

  const setMatchList = useStore((state) => state.setMatchList);
  const setCompareList = useStore((state) => state.setCompareList);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  useEffect(() => {
    localStorage.setItem("matchList", matchList);
  }, [matchList]);

  useEffect(() => {
    localStorage.setItem("compareList", compareList);
  }, [compareList]);

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {matchList && matchList.map((item, i) => <Box key={i}>{item}</Box>)}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal onClose={onClose2} isOpen={isOpen2} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {compareList &&
              compareList.map((item, i) => <Box key={i}>{item}</Box>)}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose2}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container maxW='4xl' pt={10}>
        {matchList ? (
          <Center my={2} p={4} bg={"gray.100"} borderRadius={"2xl"}>
            <VStack>
              <Heading>Base List</Heading>
              <Button onClick={onOpen} variant={"solid"} bg={"blue.400"}>
                View List
              </Button>
              <Button
                onClick={() => setMatchList(null)}
                variant={"solid"}
                bg={"red.400"}
              >
                Reset List
              </Button>
            </VStack>
          </Center>
        ) : (
          <DropFile title={"Base List"} isMatchList={true} />
        )}

        {compareList ? (
          <Center my={2} p={4} bg={"gray.100"} borderRadius={"2xl"}>
            <VStack>
              <Heading>Match List</Heading>
              <Button onClick={onOpen2} variant={"solid"} bg={"blue.400"}>
                View List
              </Button>
              <Button
                onClick={() => setCompareList(null)}
                variant={"solid"}
                bg={"red.400"}
              >
                Reset List
              </Button>
            </VStack>
          </Center>
        ) : (
          <DropFile title={"Match List"} isMatchList={false} />
        )}
        <Link href={"/match"}>
          <Button
            disabled={!matchList || !compareList}
            bg={"blackAlpha.500"}
            mt={5}
            w={"100%"}
          >
            Start Matching
          </Button>
        </Link>
      </Container>
    </>
  );
}
