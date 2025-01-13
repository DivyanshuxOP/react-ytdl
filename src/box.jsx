import { useNavigate } from "react-router-dom"
import {useState} from 'react'

function Box(){
    const navigate = useNavigate();
    const [link, setLink] = useState('');

    const handleInputChange = (event) => {
        setLink(event.target.value); // Update state with input value
    };

    const handleButtonClick = () => {
        if (!link.trim()) { // Validate input
            return;
        }

        console.log('Entered Link:', link);
        navigate('/download', { state: { link } });

    };

    
    return (
        <>
       <div className="flex md:items-center justify-center h-screen overflow-hidden"> 
       <div className="md:bg-p3 md:w-3/4 md:h-3/4 md:rounded md:shadow-md overflow-hidden w-3/4">
       <p className="text-white font-semibold text-center text-2xl p-[100px] md:mt-10" id="url-name">Enter Url:</p>

       <div className="flex items-center justify-center">
       <div className="bg-p1 w-[500px] h-[60px] md:w-3/4 md:h-[80px] rounded shadow-md align-middle md:m-[-30px] ">
        <input type="text" className="w-full h-full p-2 text-2xl text-gray bg-p1 " id="ytlink"  placeholder="Paste YouTube URL here" value={link} onChange={handleInputChange}/>
        
       </div>
       </div>

       <div className="flex items-center justify-center">
       <div className="bg-p1 md:w-[150px] md:h-[80px] rounded shadow-md align-middle md:m-[100px]  m-[70px] w-[70px] h-[70px]">
       <button className="bg-p1 w-full h-full rounded "   onClick={handleButtonClick}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-full h-full"  fill="#100E09"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
       </svg></button>
       
       </div>
       </div>

   </div>
 </div>


        </>
    )
}

export default Box