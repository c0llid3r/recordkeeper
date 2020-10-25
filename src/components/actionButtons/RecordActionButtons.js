import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/buttonStyles.scss'
import { fetchRecord, enableRecordEdit, newRecord, previousRecord } from '../../actions/recordActions'

const RecordActionButtons = () => {
  
  const currentRec = useSelector(state => state.currentRec)
  const { loading, recordCount, recordType, sequenceNumber, creationdate, readOnly, jobNumber, record } = currentRec
  const lastRec = recordCount - 1

  // Component state
  const [currentRecordNumber, setCurrentRecordNumber] = useState(lastRec)

  const [buttonBoard, setButtonBoard] = useState('main')

  const [temporaryRecordState, setTemporaryRecordState] = useState([currentRec])

  ////////////////////////////////////////

  useEffect(() => {
  // set currentRecordNumber value to the last record only on first load
  // (when finished loading and it's NaN and not 0)

  if (!loading && !currentRecordNumber && currentRecordNumber !== 0 ) {
    setCurrentRecordNumber(lastRec)
    setTemporaryRecordState(currentRec)
  }
},[loading, currentRecordNumber, lastRec, record])
  
  const dispatch = useDispatch()

  const nextRecord = (direction) => {
    let next = 0

    if (recordCount > 0) {
      if (direction === 'forward') {
        if (currentRecordNumber < lastRec) {
          next = currentRecordNumber + 1
          setCurrentRecordNumber(currentRecordNumber + 1)
        } else if (currentRecordNumber === lastRec) {
          next = lastRec
          setCurrentRecordNumber(lastRec)
        }
      }

      if (direction === 'back') {
        if (currentRecordNumber > 0) {
          next = currentRecordNumber - 1
          setCurrentRecordNumber(currentRecordNumber - 1)
        } else if ( currentRecordNumber === 0) {
          next = 0
          setCurrentRecordNumber(0)
        }
      }

      dispatch(fetchRecord('nextrec', next)) // pass in the record index number here
    }
  }

  const createNewRecord = async (recordType) => {

    const { data } = await axios.get(`http://localhost:3004/lastrec/0`)

    let sequenceNumber = 1

    if (data[5] > 0) {
      const today = new Date().getDate()
      sequenceNumber = data[6] === today ? data[6] + 1 : 1
    }

    let year = new Date().getFullYear().toString().substr(-2);
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    let count = (data[6] < 10 ? `0${data[6]}` : data[6]) + 1

    let newJob = `${year}${month}${day}${count}`;

    dispatch(newRecord(newJob, recordType, sequenceNumber))

    // this.setState({
    //     jobNumReadOnly: true,
    //     job: newJob
    // })
  }

  const deleteRecord = async () => {
    const job = record.jobnumber
    await axios({
      method: 'delete',
      url: 'http://localhost:3004/deleterecord',
      headers: {'Content-Type': 'application/json'},
      data: {
        job, recordType
      }
    })

    if (recordCount > 1) {
      // setCurrentRecordNumber(currentRecordNumber - 1)
      nextRecord('back')
    }

    setButtonBoard('main')
  }

  const handleClick = ({name}) => {

    switch (name) {
      case 'firstRecord':
        setCurrentRecordNumber(0)
        dispatch(fetchRecord('firstrec'))
        break
      case 'lastRecord':
        setCurrentRecordNumber(lastRec)
        dispatch(fetchRecord('lastrec'))
        break
      case 'previousRecord':
        nextRecord('back')
        break
      case 'nextRecord':
        nextRecord('forward')
        break
      case 'newRecord':
        setTemporaryRecordState(currentRec)
        setButtonBoard('newRecordChoice')
        dispatch(enableRecordEdit(false))
        break
      case 'editRecord':
        setTemporaryRecordState(currentRec)
        setButtonBoard('editRecord')
        dispatch(enableRecordEdit(false))
        break
      case 'deleteRecord':
        setTemporaryRecordState(currentRec)
        setButtonBoard('deleteRecord')
        break
      case 'save':
        switch (buttonBoard) {
          case 'newRecord':
            setButtonBoard('newRecordChoice')
            break
          case 'deleteRecord':
            deleteRecord()
            break
          default:
            setButtonBoard('main')
            dispatch(enableRecordEdit(true))
        }
        break
      case 'createPatientRecord':
        createNewRecord('p')
        setButtonBoard('newPatientRecord')
        dispatch(enableRecordEdit(false))
        break
      case 'createTechRecord':
        createNewRecord('t')
        setButtonBoard('newTechRecord')
        dispatch(enableRecordEdit(false))
        break
      case 'cancel':
        setButtonBoard('main')
        dispatch(enableRecordEdit(true))
        dispatch(previousRecord(temporaryRecordState))
        break
      default:
        alert('error: record action button dispatch not triggered')
    }
  }

  return (
    <div className='record-buttons'>
    {buttonBoard === 'main' ?
      <>
        <button className='record-button' name='firstRecord' onClick={(e) => handleClick(e.target)}>{`|<`}</button>
        <button className='record-button' name='previousRecord' onClick={(e) => handleClick(e.target)}>{`<`}</button>
        <button className='record-button' name='newRecord' onClick={(e) => handleClick(e.target)}>New</button>
        <button className='record-button' name='editRecord' onClick={(e) => handleClick(e.target)}>Edit</button>
        <button className='record-button' name='deleteRecord' onClick={(e) => handleClick(e.target)}>Delete</button>
        <button className='record-button' name='search' onClick={(e) => handleClick(e.target)}>Search</button>
        <button className='record-button' name='nextRecord' onClick={(e) => handleClick(e.target)}>{`>`}</button>
        <button className='record-button' name='lastRecord' onClick={(e) => handleClick(e.target)}>{`>|`}</button>
      </>
    : buttonBoard === 'newRecordChoice' ?
      <>
        <button className='record-button' name='createPatientRecord' onClick={(e) => handleClick(e.target)}>Patient</button>
        <button className='record-button' name='createTechRecord' onClick={(e) => handleClick(e.target)}>Tech</button>
        <button className='record-button' name='cancel' onClick={(e) => handleClick(e.target)}>Cancel</button>
      </>
    :
      <>
        <button className='record-button' name='save' onClick={(e) => handleClick(e.target)}>{buttonBoard === 'deleteRecord' ? 'Delete' : 'Save'}</button>
        <button className='record-button' name='cancel' onClick={(e) => handleClick(e.target)}>Cancel</button>
      </>
    }
    </div>
  )
}

export default RecordActionButtons