import { configureStore } from '@reduxjs/toolkit'
import requestedOrderSlice from './requestOrder/requestedOrderSlice'

export const store = configureStore({
    reducer: {
        requestedOrder: requestedOrderSlice,
    },
})