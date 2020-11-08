import React from 'react'
import { useSelector } from 'react-redux'
import '../styles/reportStyles.scss'

const Report = () => {

  const reportCriteria = useSelector(state => state.reportCriteria)

  return (
    <div className='report-screen'>
      <div className='report-results'>
        <div className='report-results-titles'>
          <div className='report-sequence-col'>Sequence</div>
          <div>Job Number</div>
          <div>Referrer</div>
          <div>Date</div>
          <div>Cost</div>
        </div>
      {
        reportCriteria.map((returned, index) => {
          return (
            
            <div key={returned.id}>
              <div className='report-sequence-col'>{index + 1}</div>
              <div>{returned.jobnumber}</div>
              <div>{returned.requestedby}</div>
              <div>{returned.to_char}</div>
              <div>£{returned.cost}</div>
            </div>
          )
        })
      }
      </div>
      <div className='report-figures'>
    <div>Total Jobs: {reportCriteria.length}</div>
        <div>Total Cost: £{
          (reportCriteria.reduce((tot, a) => tot + Number(a.cost), 0)).toFixed(2)
          }</div>
      </div>
    </div>
  )
}

export default Report