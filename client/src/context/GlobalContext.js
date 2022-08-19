import React, { useContext, useReducer, useEffect, createContext } from 'react'
import axios from 'axios'

// initial state
const initialState = {
  user: null,
  fetchingUser: true,
  completeToDos: [],
  incompleteToDos: [],
}

//reducer
const globalReducer =  (state, action) => {
  switch (action.type) {
    case "SET_USER":
       return {
        ...state,
        user: action.payload,
        fetchingUser: false
       }
    case "SET_COMPLETE_TODOS":
      return {
      ...state,
      completeToDos: action.payload,
        }
    case "SET_INCOMPLETE_TODOS":
        return {
        ...state,
        incompleteToDos: action.payload,
        }
    case "RESET_USER":
        return {
        ...state,
        user: null,
        completeToDos: [],
        incompleteToDos: [],
        fetchingUser: false, 
        }    
    default:
      return state
  }
}

//create the context
export const GlobalContext = createContext(initialState)

//provider
export const GlobalProvider = (props)=> {
    const [state, dispatch] = useReducer(globalReducer, initialState)

    //use Effect as a hook
    useEffect(() => {
      getCurrentUser();
    },[])

    //action: get current user
    const getCurrentUser = async () => {
        try {
            const res = await axios.get("api/auth/current")
            if (res.data) {
                const toDoRes = await axios.get("api/todos/current");
                if (toDoRes.data) {
                    dispatch({ type: "SET_USER", payload: res.data });
                    dispatch({ type: "SET_COMPLETE_TODOS", payload: toDoRes.data.completeToDos });
                    dispatch({ type: "SET_INCOMPLETE_TODOS", payload: toDoRes.data.incompleteToDos });
                }
            } else {
                dispatch({ type: "RESET_USER" });
            }
        } catch (err) {
            console.log(err);
            dispatch({ type: "RESET_USER" });
        }
    }

    const logout = async () => {
      try {
        await axios.get("api/auth/logout");
        dispatch({ type: "RESET_USER" });
      } catch (err) {
        console.log(err);
        dispatch({ type: "RESET_USER" });
      }
    }

    const addToDo = async (toDo) => {
      dispatch({ type: "SET_INCOMPLETE_TODOS", payload: [toDo, ...state.incompleteToDos] });
    }

    const toDoComplete = async (toDo) => {
      dispatch({ type: "SET_INCOMPLETE_TODOS", payload: state.incompleteToDos.filter((incompleteToDo) => incompleteToDo._id !== toDo._id) });
      
      dispatch({ type: "SET_COMPLETE_TODOS", payload: [toDo, ...state.completeToDos] });
    }

    const toDoIncomplete = async (toDo) => {
      dispatch({ type: "SET_COMPLETE_TODOS", payload: state.completeToDos.filter((completeToDo) => completeToDo._id   !== toDo._id) });
      
      const newIncompleteToDos = [toDo, ...state.incompleteToDos]
      dispatch({ type: "SET_INCOMPLETE_TODOS", payload: newIncompleteToDos.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt))
     });
    }

    const removeToDo = async (toDo) => {
      if(toDo.complete) {
        dispatch({ type: "SET_COMPLETE_TODOS", payload: state.completeToDos.filter((completeToDo) => completeToDo._id   !== toDo._id) });
      }
      else {
        dispatch({ type: "SET_INCOMPLETE_TODOS", payload: state.incompleteToDos.filter((incompleteToDo) => incompleteToDo._id   !== toDo._id) });
      }
    }

    const updateToDo = async (toDo) => { 
      if(toDo.complete) {
        const newCompleteToDos = state.completeToDos.map(
          (completeToDo) => completeToDo._id !== toDo._id ? completeToDo : toDo)
        dispatch({ type: "SET_COMPLETE_TODOS", payload: newCompleteToDos });
      }
      else {
        const newIncompleteToDos = state.incompleteToDos.map(
          (incompleteToDo) => incompleteToDo._id !== toDo._id ? incompleteToDo : toDo)
        dispatch({ type: "SET_INCOMPLETE_TODOS", payload: newIncompleteToDos });
      }
    }

    const value = {
        ...state,
        getCurrentUser,
        logout,
        addToDo,
        toDoComplete,
        toDoIncomplete,
        removeToDo,
        updateToDo
    }

    return(
        <GlobalContext.Provider value= { value } >
          {props.children}    
        </GlobalContext.Provider>
    )
}
export function useGlobalContext() {
    return useContext(GlobalContext)
}