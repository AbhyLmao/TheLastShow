import React, {useEffect, useState} from "react";
import OPopup from "./OPopup";
import OContainer from "./OContainer";
// lambda_url_create = "https://2pyrchmo7loqmdf56wz4eyzvim0kisyw.lambda-url.ca-central-1.on.aws/"
// lambda_url_get = "https://apy7pu6ficujxd65wzex4azp3i0hmjfe.lambda-url.ca-central-1.on.aws/"
function App() {
  const [popup,setPopup] = useState(false);
  const [obit, setObit] = useState([]);
  
  const [obody,setObody] = useState('');
  const [oaudio,setOaudio] = useState('');
  const localStorageKey = "the-last-show";
  useEffect(()=>{console.log({obit})},[obit])

  useEffect(() => {
    fetch('https://apy7pu6ficujxd65wzex4azp3i0hmjfe.lambda-url.ca-central-1.on.aws/')
      .then(response => response.json())
      .then(data => {
        setObit(data.Items);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
 
  useEffect(() => {

    const existing = localStorage.getItem(localStorageKey);
    if (existing) {
      try {
        setObit(JSON.parse(existing));
      } catch {
        setObit([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(obit));
  }, [obit]);

  const addObit = (imagelol, titlelol, whenlol, diedlol,idlol) => {
    

    setObit([
      {
        title:titlelol,
        when:whenlol,
        died:diedlol,
        id:idlol+1,
        image:imagelol,
        body: obody,
        audio_url: oaudio
        
      },
      ...obit,
    ]);
    
  };


  
  return (
  <div>

    <div className="headlol">
      <div></div>
      <h1>The Last Show</h1>
      <label onClick={() => setPopup(true)}  ><div id="pluslol">+</div></label>
      <OPopup open = {popup} onClose={() => setPopup(false)}  addfun={addObit}/>
    </div>
    <OContainer obit={obit} />

   
  </div>
  );
  
}

export default App;
