import React from 'react'
import OItem from './OItem';


function OContainer({obit}) {
  return obit.length > 0 ?(
    <div className='wrapper'>
    
      {obit.map((obit, index) => (
        <OItem obit={obit} index={index} key={`node-item-${index}`} />
      ))}
    
    </div>
  ) : (
    <p id="no-note-yet">No Obiturary</p>
  );    
  
}

export default OContainer