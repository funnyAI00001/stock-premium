import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import user from './user'
import rootReducer from '../reducers'

const store = configureStore({
  reducer: rootReducer
})

export default store;