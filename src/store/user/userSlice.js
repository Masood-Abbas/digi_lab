import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    userById: {},
    deletedAssignSection: [],
    deletedAssignRoles: [],
    deletedAssignPermissions: [],
    updateUserData: {
      firstName: '',
      lastName: '',
      email: '',
      newSectionIds: '',
      deletedUserSectionIds: '',
      newRoleIds: '',
      deletedUserRoleIds: '',
      status: '',
      category: '',
      permissions: '',
      userTitleIds: '',
      isAssignAllSections: false
    },
    filterUser: {
      name: '',
      employeeNo: null,
      status: null,
      unit: null
    },
    userTitles: [],
    uploadSign: '',
    userSignAndStamp: null,
    showUserSign: '',
    uploadStamp: '',
    showUserStamp: '',
    userPage:1
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setUserById: (state, action) => {
      state.userById = action.payload
    },
  }
})

export const {
  setUserById,
  setUsers,
} = userSlice.actions

export default userSlice.reducer
