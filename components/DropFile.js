import {
  Box,
  Center,
  VStack,
  Heading,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import * as xlsx from "xlsx/xlsx.mjs";
import { useRef, useState, useCallback, useEffect } from "react";
import useStore from "../lib/zustand";
import {useDropzone} from 'react-dropzone'

function DropFile( {title, isMatchList,} ) {
  const inputRef = useRef(null);

  const [matchObject, setMatchObject] = useState(null);

  const setMatchList = useStore((state) => state.setMatchList);
  const setCompareList = useStore((state) => state.setCompareList);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [matchColumn, setMatchColumn] = useState(null)


  useEffect(() => {
    if (matchObject) {
      if (isMatchList){
      setMatchList(matchObject.map(item => item[matchColumn]).filter(item=>item!=null))
    } else {
      setCompareList(matchObject.map(item => item[matchColumn]).filter(item=>item!=null))
    }
    }
  }, [matchColumn])
  

  const onDrop = useCallback(acceptedFiles => {

    if (acceptedFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setMatchObject(json);
        onOpen();
      };
      reader.readAsArrayBuffer(acceptedFiles[0]);
    }

  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const readUploadFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setMatchObject(json);
        onOpen();
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };


  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Column Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack>
            {matchObject
              ? Object.keys(matchObject[0]).map((item,i) => (
                  <Button onClick={()=>{
                    setMatchColumn(item);
                    onClose();
                  }} w={"100%"} key={i}>{item}</Button>
                ))
              : null}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        my={5}
        {...getRootProps()}
        p={5}
        border={"dashed 1px grey"}
        borderRadius={"2xl"}
        cursor={"pointer"}
        onClick={() => inputRef.current.click()}
      >
        <Input
          {...getInputProps()}
          ref={inputRef}
          display={"none"}
          w={0}
          h={0}
          type="file"
          name="upload"
          id="upload"
          aria-hidden="true"
          onChange={readUploadFile}
          cursor={"pointer"}
        />
        <Center>
          <VStack>
            <Heading size={"lg"}>{title}</Heading>
            <Text>
              <strong>Drop File</strong> or <strong>Click</strong> to choose
              from directory
            </Text>
          </VStack>
        </Center>
      </Box>
    </>
  );
}

export default DropFile;
