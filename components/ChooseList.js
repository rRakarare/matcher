import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useStore from "../lib/zustand";

function ChooseList({isOpen, onClose, matchList, matchIndex}) {

    const addMatch = useStore((state) => state.addMatch);
    const goNext = useStore((state) => state.goNext);

    const [pickList, setPickList] = useState(matchList)

    const [key, setKey] = useState("")

    useEffect(() => {
        setKey("")
    }, [matchIndex])
    

    useEffect(() => {
        setPickList(matchList)
      setPickList(list => list.filter(item => {

        const itemstring = item.toString().toLowerCase()

        return (itemstring.includes(key.toLowerCase()))
        
      }))
    }, [key])

    const commitMatch = (item) => {
        addMatch(item, matchIndex);
        goNext();
        onClose();
      };
    
    

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt={10}>
          <Input onChange={e=>setKey(e.target.value)} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            <VStack mt={5} align={"flex-start"}>
            {pickList && pickList.map((item, i) => <Button onClick={()=>commitMatch(item)} key={i}>{item}</Button>)}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChooseList;
