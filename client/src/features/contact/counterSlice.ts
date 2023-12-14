import { createSlice } from "@reduxjs/toolkit"


export interface CounterState {
    data: number
    title: string
}

const initialState: CounterState = {
    data: 42,
    title: 'Redux Counter Test with redux toolkit'
}
// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes.
// Also, no return statement is required from these functions.
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload
        },
        decrement: (state, action) => {
            state.data -= action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { increment, decrement } = counterSlice.actions