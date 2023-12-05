import { createSlice } from "@reduxjs/toolkit"


export interface CounterState {
    data: number
    title: string
}

const initialState: CounterState = {
    data: 42,
    title: 'Redux Counter Test with redux toolkit'
}
//Automatically creates action creators and action types
//actually doesnt mutate state event though it looks like.
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

export const { increment, decrement } = counterSlice.actions