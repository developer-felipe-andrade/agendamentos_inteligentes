import { TextField } from '@mui/material'
import React from 'react'

export const Login = () => {
  return (
    <div className="w-1/2 mx-auto  p-4">
        <div className='bg-gray-200'>Login</div>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>
  )
}
