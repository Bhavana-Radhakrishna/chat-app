import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    setMessages: (state, action) => {
      return action.payload;
    }
  }
});

export const { addMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
