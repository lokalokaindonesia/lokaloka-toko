import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const tempRequestedOrder = createSlice({
    name: 'tempRequestedOrder',
    initialState,
    reducers: {
        setTempRequestedOrder: (state, action) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setTempRequestedOrder } = tempRequestedOrder.actions

export default tempRequestedOrder.reducer