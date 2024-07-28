import React, { useEffect, useState } from 'react'
import FormattedDate from './FormattedDate'

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};
function OItem({obit, index}) {
  const [showElement, setShowElement] = useState(false);


  const handleClick = () => {
    setShowElement(!showElement);
  };
  return (
    <div className="o-item" key={`o-item-${index}`} onClick={handleClick}>
        <img src={`${obit.image}`}className='o-img'></img>
        <h3 className="o-name">{obit.title}</h3>

      <div className='o-item-dates'>
        <div>
        <b>Born - </b>
        <FormattedDate date={obit.when} />
        </div>
        <div>
        <b>Died - </b>
        <FormattedDate date={obit.died} />
        </div>
        </div>
        <div className='o-body'>
        {showElement && <p
          className="o-content"
          dangerouslySetInnerHTML={{ __html:(obit.body) }}
        />}

        {showElement &&<div>
          
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
          </p>
          <button>Play</button>
          </div>}

        </div>
    </div>
  )
}

export default OItem