import { SEARCH_NAME,LOGIN,LOGIN_STATE ,GET_USERS} from "../action/index";
import React,{ useReducer,createContext } from "react";

export const StoreContext = createContext();

const initialState = {
    searching:{
        busName:"",
    },
    loginInfo:{
        email:"",
        password:""
    },
    loginState:false,
    userData:{
        email:"",
        password:"",
        name:"",
        age:0,
    }
}

function reducer(state,action){
    switch (action.type){
        case SEARCH_NAME:
            return{
                ...state,
                searching:{busName:action.payload}
            }
        case LOGIN:
            return{
                ...state,
                loginInfo:{
                    email:action.payload.username,
                    password:action.payload.password
                }
            }
        case LOGIN_STATE:
            return{
                ...state,
                loginState:action.payload
            }
        case GET_USERS:
            return{
                ...state,
                userData:{
                    email:action.payload.email,
                    password:action.payload.password,
                    name:action.payload.name,
                    age:action.payload.age
                }
            }
        default:
            return state;
    }
}

export function StoreProvider(props){
    const [state,dispatch] = useReducer(reducer,initialState);
    const value = {state,dispatch};

    return(
        <StoreContext.Provider value={value}>
            {props.children}
        </StoreContext.Provider>
    )
}