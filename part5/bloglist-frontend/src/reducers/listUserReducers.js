import { createSlice } from '@reduxjs/toolkit'

const usersListSlice = createSlice({
  name: 'userList',
  initialState: [],
  reducers: {
    setListUsers(state, action) {
      return action.payload
    },
  },
})

export const { setListUsers } = usersListSlice.actions
export default usersListSlice.reducer
