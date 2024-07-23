import React from 'react'
import Settings from './Settings' 
import { useSelector } from 'react-redux'

const Account = () => {

  const user = useSelector((state) => state.account.account)
  console.log(user)
  
  const content = <Settings user={user} /> 

  return content
}

export default Account