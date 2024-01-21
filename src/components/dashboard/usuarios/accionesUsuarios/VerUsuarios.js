import React from 'react'

export default function VerUsuarios({optionRender}) {
  return (
    <div>
           <h1>Ver usuario</h1>
        <button className='btn btn-primary' onClick={() => optionRender(0)}>regresar</button>
    </div>
  )
}
