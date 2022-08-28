import create from "zustand";

const useStore = create((set) => ({
  matchList: null,
  setMatchList: (list) => set((state) => ({...state, matchList: list })),

  compareList: null,
  setCompareList: (list) => set((state) => ({...state, compareList: list })),

  finalList: null,
  init: (match) => set((state) => ({...state, finalList: match.map(item=>({param:item,base:null})) })),
  addMatch: (match, index) => set((state) => ({...state, finalList: state.finalList.map((item,i)=>{
    if (index===i) {
      return ({
        ...item, base:match
      })
    } else {
      return item
    }
  }) })),

  matchIndex: 0,
  setmatchIndex: (index) => set((state) => ({...state, matchIndex:index})),
  increaseIndex: () => set((state) => ({...state, matchIndex:state.matchIndex+1})),
  goNext: () => set((state) => {
    
      const toMatchindizes = state.finalList.map((item,i) => item.base ? null : i).filter(item=>item != null).map(item => ({index:item, diff: item-state.matchIndex}))

      const posDiffs = toMatchindizes.filter(item => item.diff > 0)
      const negDiffs = toMatchindizes.filter(item => item.diff < 0)

      if (posDiffs.length > 0) {

        const min = Math.min(...posDiffs.map(item => item.diff))


        return ({...state, matchIndex:state.matchIndex+min})
      } else if (negDiffs.length > 0) {



        const min = Math.min(...negDiffs.map(item => item.diff))


        return ({...state, matchIndex:state.matchIndex+min})
      } else {
        return state
      }


    
  })


}));

export default useStore;
