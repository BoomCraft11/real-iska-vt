// CanteenButton.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { storage, ref, getDownloadURL } from '../firebase.js'; // Import the storage, ref, and getDownloadURL functions
import './building.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import gate from '../areaImage/gate.webp';
import admission from '../areaImage/Admin Building.webp';
import lab1 from '..//areaImage/Lab 1.webp';
import lab2 from '../areaImage/Lab 2.webp';
import canteen from '../areaImage/Canteen.webp';
import nantes from '../areaImage/Nantes.webp';
import gymnasium from '../areaImage/Gym.webp';
import grandstand from '../areaImage/Grandstand.webp';
import science from '../areaImage/Health and Sciences Building.webp';
import education from '../areaImage/Educ Bldg.webp';
import engineer from '../areaImage/Engineering Building.webp';
import hospitality from '../areaImage/HM _ Plant Lab.webp';
import ecopark from '../areaImage/eco park.webp';

import voiceYumul from '../speakText/yumul.mp3';

function AdmissionButton() {
  const [isActive, setIsActive] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [currentButton, setCurrentButton] = useState('');
  const [responses, setResponses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directCurrentButton, setDirectionCurrentButton] = useState('');
  const [currentAudio, setCurrentAudio] = useState(null);
  const yumulAudio = useMemo(() => new Audio(voiceYumul), []);  

  useEffect(() => {
    Promise.all([
      import('../goingTo/goYumul.json'),
      import('../fileJSON/directionsBuilding.json'),
    ])
      .then(([admission, additional]) => {
        setResponses({
          ...admission.default,
          ...additional.default,
        });
      })
      .catch((error) => console.error('Error loading responses:', error));
      yumulAudio.play();

    window.scrollTo(0, 0);
  }, [yumulAudio]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const playAudio = (audioURL) => {
    // Stop the current audio if it's playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create and play the new audio
    const audio = new Audio(audioURL);
    audio.play();
    setCurrentAudio(audio);
  };


  const handleDirectionButtonClick = (buttonName) => {
    setDirectionCurrentButton(responses[buttonName]);
    openModal();

     // Play audio if available
  if (responses[buttonName]?.speakDirections) {
    playAudio(responses[buttonName].speakDirections);
  }
    };
  

  const fetchImageURL = useCallback(async () => {
    if (currentButton && currentButton.clickedImage) {
      const imageRef = ref(storage, currentButton.clickedImage);
      const url = await getDownloadURL(imageRef);
      setImageURL(url);
    }
    window.scrollTo(0, 0);
  }, [currentButton]);

  useEffect(() => {
    fetchImageURL();
  }, [fetchImageURL]);

  const handleImageClick = (button) => {
    const buttonData = responses[button];
    setCurrentButton(responses[button]);
    setIsActive(true);

    if (yumulAudio) {
      yumulAudio.pause();
      yumulAudio.currentTime = 0;
    }

    if (buttonData.speakVoice) {
      playAudio(buttonData.speakVoice);
    }

    const hideReset = document.querySelectorAll('.reset-button');
    hideReset.forEach((element) => {
      element.style.display = 'none';
    });

    const hideAvatar = document.querySelectorAll('.avatar-container');
    hideAvatar.forEach((element) => {
      element.style.display = 'none';
    });
  
  };

  const handleBackButtonClick = () => {
    setCurrentButton('');
    setIsActive(false);

    const showReset = document.querySelectorAll('.reset-button');
    showReset.forEach((element) => {
      element.style.display = '';
    });
    
  };

  return (
    <div className="areaImage-container">
    {!isActive && (
    <div className="buttons-container">
                  <div className='title-area'>
        <p>Please select your nearest area in campus, so that I can assist you to show the way to Yumul Building</p>
      </div>
        <img onClick={() => handleImageClick('gate')} className="gate" alt="Main Gate" src={gate} />
        <p>MAIN GATE</p>
        <img onClick={() => handleImageClick('admission')} alt='Admission' className='admission-image' src={admission} />
        <p>ADMINISTRATION OFFICE</p>
        <img  onClick={() => handleImageClick('lab1')} alt='lab1' className='lab1-image' src={lab1}/>
        <p>COMPUTER LABORATORY 1</p>
        <img onClick={() => handleImageClick('lab2')}alt='lab2' className='lab2-image' src={lab2} />
        <p>COMPUTER LABORATORY 2</p>
        <img onClick={() => handleImageClick('canteen')} alt='canteen' className='canteen-image' src={canteen} />
        <p>CANTEEN</p>
        <img onClick={() => handleImageClick('nantes')}  alt='nantes' className='nantes-image' src={nantes} />
        <p>ACCOUNTACY and MARKETING BUILDING</p>
        <img onClick={() => handleImageClick('gymnasium')} alt='gymnasium' className='gymnasium-image' src={gymnasium} />
        <p>GYMNASIUM</p>
        <img onClick={() => handleImageClick('education')} alt='education' className='education-image' src={education} />
        <p>EDUCATION BUILDING</p>
        <img onClick={() => handleImageClick('science')}  alt='science' className='science-image' src={science} />
        <p>HEALTH and SCIENCE BUILDING</p>
        <img onClick={() => handleImageClick('grandstand')} alt='grandstand' className='grandstand-image' src={grandstand} />
        <p>GRANDSTAND</p>
        <img onClick={() => handleImageClick('engineer')}  alt='engineer' className='engineer-image' src={engineer} />
        <p>ENGINEERING and ARCHTECTURE BUILDING</p>
        <img onClick={() => handleImageClick('hospitality')}  alt='hospitality' className='jm-image' src={hospitality} />
        <p>HOSPITALITY MANAGEMENT BUILDING</p>
        <img onClick={() => handleImageClick('ecopark')}  alt='EcoPark' className='ecopark-image' src={ecopark} />
        <p>Eco Park</p>
      
    </div>
  )}
<div className='showImage'>

      {isActive && (
        <div className="image-container">
          <p className='text-gif'>{currentButton.responseText}</p>
          <FontAwesomeIcon className="back-button" onClick={handleBackButtonClick} icon={faArrowLeft} size="xl" style={{color: "#FFD43B",}} />
          <div className='gif'>
          <img  src={imageURL} alt={currentButton.title} />
          </div>
          <div className='direction-container'>
          <div className='direction-title'>OFFICES AND ROOMS</div>
<ul>
<li>
    <button onClick={() => handleDirectionButtonClick('y1')} className="showImage-button">
ICTO or ICT Office
</button>
  </li>
  <li>
    <button onClick={() => handleDirectionButtonClick('y6')} className="showImage-button">
        Property and Supply Management
    </button>
  </li>
  <li>
    <button onClick={() => handleDirectionButtonClick('y7')} className="showImage-button">
    Human Resources Management Office
    </button>
  </li>
  <li>
    <button onClick={() => handleDirectionButtonClick('y8')} className="showImage-button">
      NSTP/Triage
    </button>
  </li>
  <li>
    <button onClick={() => handleDirectionButtonClick('y2')} className="showImage-button">
      GS
    </button>
  </li>
<li>
    <button onClick={() => handleDirectionButtonClick('y5')} className="showImage-button">
      Room 200
    </button>
  </li>
  <li>
    <button onClick={() => handleDirectionButtonClick('y4')} className="showImage-button">
      Room 201
    </button>
  </li>
  <li>
    <button onClick={() => handleDirectionButtonClick('y3')} className="showImage-button">
        Room 202
    </button>
  </li>
</ul>
</div>

            {/* Modal for displaying text */}
            <div className='pop-up' >
            {isModalOpen && (
              <div className="direction-modal">
                <div className="modal-content">
                  <p>{directCurrentButton.directionsText}</p>
                  <button className='modal-close' onClick={closeModal}>Close</button>
                </div>
              </div>
            )}
            </div>
           
          </div>
        )}
          </div>
    </div>
  );
}

export default AdmissionButton;