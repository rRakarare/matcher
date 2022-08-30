import {
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Matcher from "../components/Matcher";
import { exportData, saveWorkBook } from "../lib/excelJS";
import {useStore} from "../lib/zustand";

function match() {

  const matchList = useStore((state) => state.matchList);
  const compareList = useStore((state) => state.compareList);
  const finalList = useStore((state) => state.finalList);
  const init = useStore((state) => state.init);
  const matchIndex = useStore((state) => state.matchIndex);

  const [countParamsToMatch, setCountParamsToMatch] = useState(0);
  const [countMatches, setCountMatches] = useState(0);

  const exportExcel = () => {
    const wb = exportData(
      [
        {
          header: "Parameter",
          key: "param",
        },
        {
          header: "Match",
          key: "base",
        },
      ],
      finalList
    );

    saveWorkBook(wb, "go.xlsx");
  };

  useEffect(() => {
    if (compareList) {
      init(compareList);
      setCountParamsToMatch(compareList.length);
    }
  }, [compareList]);

  useEffect(() => {
    if (finalList) {

      setCountMatches(finalList.filter(item => item.base).length);
    }
  }, [finalList]);

  return (
    <Container maxW='4xl' pt={10}>
      <HStack justifyContent={"space-between"}>
        <Heading>Progress</Heading>
        <CircularProgress value={countMatches/countParamsToMatch*100} color="green.400">
          <CircularProgressLabel>
            {countMatches} / {countParamsToMatch}
          </CircularProgressLabel>
        </CircularProgress>
      </HStack>
      {finalList && matchList && countMatches < countParamsToMatch ? <Matcher matchIndex={matchIndex} finalList={finalList} matchList={matchList} />: null}
      <Center mt={10}>
        <VStack>
          <Button onClick={() => exportExcel()}>Export XLSX</Button>
        </VStack>
      </Center>
    </Container>
  );
}

export default match;
