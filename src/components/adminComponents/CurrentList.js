import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import '../../styles/adminStyles.scss'

const CurrentList = () => {

  const screenRoute = useSelector(state => state.screenRoute)

  const [selected, setSelected] = useState([])

  let currentTitle = screenRoute === 'editUsers' ? 'Users' : screenRoute === 'editDepartments' ? 'Departments' : screenRoute === 'editReferrers' ? 'Referrers' : 'Tech Categories'

  const fieldData = useSelector(state => state.fieldData)
  const { users, departments, referrers, techTypes } = fieldData

  const handleChange = (id, index) => {
    // Create a new array from the array in state, then add the true/false value to the relevant array index and set state to this new array
    const newArr = [...selected]
    if (newArr[index] !== true) {
      newArr[index] = true
    } else {
      newArr[index] = false
    }

    // setSelected(newArr)

    // setToDelete()
  }

  const deleteUser = () => {
    
  }

  return (
    <div className="editLists">
      <h3>Current {currentTitle}</h3>
      <ul>
        {
        screenRoute === 'editUsers' ?
        users.map((user, index) => {
          return (
          <div key={user.id}>
            <li>{user.name}<br/>({user.usertype})</li>
            <input type='checkbox' id={user.name} name={index} checked={selected[index] || false} onChange={(e) => handleChange(e.target.id, index)}/>
          </div>
          )
        })
        :
        screenRoute === 'editDepartments' ?
        departments.map((dept, index) => {
          return (
            <div className="editDepartments" key={dept.id}>
              <li>{dept.departmentname}</li>
              <li></li>
              <input className="adminCheckbox" id={dept.departmentname} name={index} checked={selected[index] || false} type="checkbox" onChange={() => handleChange(index)}/>
            </div>
          )
        })
        :
        screenRoute === 'editReferrers' ?
        referrers.map((referrer, index) => {
          return (
            <div key={referrer.id}>
              <li>{referrer.name}</li>
              <li></li>
              <input className="adminCheckbox" id={referrer.name} name={index} checked={selected[index] || false} type="checkbox" onChange={() =>handleChange(index)}/>
            </div>
          )
        })
        :
        techTypes.map((category, index) => {
          return (
            <div key={category.id}>
              <li>{category.type}</li>
              <li></li>
              <input className="adminCheckbox" id={category.type} name={index} checked={selected[index] || false} type="checkbox" onChange={() => handleChange(index)}/>
            </div>
          )
        })
        }
    </ul>
    {/* <div className="adminButtons"> */}
      <button className='record-button' onClick={() => {deleteUser(screenRoute)}}>Delete Selected</button>
    {/* </div> */}
  </div>
  )
}

export default CurrentList