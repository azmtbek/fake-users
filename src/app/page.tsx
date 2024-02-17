'use client';

import UsersTable from "./users-table";
import InputHeader from "./input-header";
import { useReducer, useState } from "react";
import { INPUT_MAX_VALUE, SLIDER_MAX_VALUE } from "./consts";


export interface FormState {
  region: string;
  errorSlider: number,
  errorInput: string,
  error: number,
  seed: number,
}
export interface Action {
  type: string;
  payload: string | number;
}

const initialState: FormState = {
  region: 'us',
  errorSlider: 0,
  errorInput: '',
  error: 0,
  seed: 0,
};

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'SET_REGION':
      return { ...state, region: action.payload as string };
    case 'SET_ERROR': {
      const error = action.payload as number;
      const errorSlider = Math.min(SLIDER_MAX_VALUE, error);
      const errorInput = "" + error;
      return { ...state, errorSlider, error, errorInput };
    }
    case 'SET_SEED': {
      const seed = action.payload as number;
      // const errorInput = error;
      return { ...state, seed };
    }
    case 'SET_SEED': {
      const seed = action.payload as number;
      // const errorInput = error;
      return { ...state, seed };
    }
    default:
      return state;
  }
};


export default function Home() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <main className="flex flex-col items-center justify-between pt-5 px-5">
      <InputHeader
        dispatch={dispatch}
        state={state}
      />
      <UsersTable
        formState={state}
      />
    </main>
  );
}
