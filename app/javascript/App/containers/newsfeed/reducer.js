import { combineReducers } from 'redux'
import { createReducer } from '../../lib/redux'
import { namespace } from './constants'

export default combineReducers({
  coins: createReducer(namespace, 'coins', (state, action) => {
    return state
  }),
  articles: createReducer(namespace, 'articles', (state, action) => {
    return state
  })
})
