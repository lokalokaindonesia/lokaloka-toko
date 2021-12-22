import { configureStore } from '@reduxjs/toolkit'
import requestedOrderSlice from './requestOrder/requestedOrderSlice'
import tempRequestedOrderSlice from './tempRequestOrder/tempRequestedOrderSlice'

export const store = configureStore({
    reducer: {
        requestedOrder: requestedOrderSlice,
        tempRequestedOrder: tempRequestedOrderSlice,
    },
})