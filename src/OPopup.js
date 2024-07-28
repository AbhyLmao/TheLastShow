import React, { useEffect, useState } from 'react';

const OPopup = ({open, onClose, addfun}) => {
  const [oimg,setOimg] = useState(null);
  const [otitle,setOtitle] = useState('');
  const [owhen,setOwhen] = useState('');
  const [odied,setOdied] = useState('');
  const [oid,setOid] = useState(0);
  const [data, setData] = useState([]);
  const [enabledlol, setEnabledlol] = useState(false);

  const imgchange = (event) => {
    console.log(event.target.files);
    setOimg(event.target.files[0])
  };
  const titlechange = (event) => {
    setOtitle(event.target.value);
  };
  const whenchange = (event) => {
    setOwhen(event.target.value);
  };

  const diedchange = (event) => {
    setOdied(event.target.value);
  };



  useEffect(() => {
    if (oimg === null){
      setOimg('https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png')
    }

    

    if (otitle === "" || owhen === "" || odied === "") {
      
      setEnabledlol(true);

    } else {
      

      setEnabledlol(false);
    }
  }, [otitle, owhen, odied]);


  const onSubmit = async (e) => {
    runfun();
    e.preventDefault()
    console.log(oimg,otitle,owhen,odied);

    const bodylol = new FormData()
    ;
    bodylol.append('image',Image);
    bodylol.append('title',otitle);
    bodylol.append('when',owhen);
    bodylol.append('died',odied);
    bodylol.append('id',oid);

    console.log(bodylol.values())

    const promise = await fetch('https://2pyrchmo7loqmdf56wz4eyzvim0kisyw.lambda-url.ca-central-1.on.aws/', {
      method: 'POST',
      body: bodylol,
      }
     );
    console.log("saved");
    setOtitle('');
    setOimg(null);
    setOwhen('');
    setOdied('');

  };
  
  const runfun = () => {
    addfun(oimg,otitle,owhen,odied,oid);
    onClose();
    setData({
      title: otitle,
      when: owhen,
      died: odied,
    })

    console.log(data)
  }

  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div className='popcontentlol'>
          <h1 id='poptitle'>Create an Obiturary</h1>
          <form>
            

          <label for="images" class="drop-container">
          <span className="drop-title">Drop files here</span>
            or
            <input 
          type ="file" 
          required accept="image/*"    
          id='images'     
          onChange = {(e) => imgchange(e)}/>
          </label>

          
          
          <input 
          placeholder='Enter Deceased Name' 
          id='deadnamebox'
          value={otitle}
          onChange={titlechange}/>
          <div className='dateslol'>

            <div>
              <h2>Born</h2>
              <input 
              type='datetime-local' 
              id='deadnamebox'
              value={owhen}
              onChange={whenchange}
              />
            </div>

            <div>
              <h2>Died</h2>
              <input 
              type='datetime-local' 
              id='deadnamebox' 
              value={odied}
              onChange={diedchange}
              />
            </div>

            
          </div>
        
          </form>
          <button id="savelol" onClick={onSubmit} disabled = {enabledlol} >Add Obiturary</button>
        </div>
          
      </div>
    </div>
  );
}

export default OPopup


  