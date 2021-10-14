import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const requestedOrder = createSlice({
    name: 'requestedOrder',
    initialState,
    reducers: {
        setRequestedOrder: (state, action) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setRequestedOrder } = requestedOrder.actions

export default requestedOrder.reducer