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
            alert('Please enter a valid URL.');
            return;
        }

        console.log('Entered Link:', link);
        alert(`You entered: ${link}`);
        navigate('/download', { state: { link } });

    };

    
    return (
        <>
       <div className="flex items-center justify-center h-screen  ">
       <div className="bg-p3 w-3/4 h-3/4 rounded shadow-md overflow-hidden">
       <p className="text-white font-semibold text-center text-2xl p-[100px] mt-10">Enter Url:</p>

       <div className="flex items-center justify-center">
       <div className="bg-p1 w-[900px] h-[80px] rounded shadow-md align-middle m-[-30px]">
        <input type="text" className="w-full h-full p-2 text-2xl text-gray bg-p1" id="ytlink"  placeholder=" Paste YouTube URL here" value={link} onChange={handleInputChange}/>
        
       </div>
       </div>

       <div className="flex items-center justify-center">
       <div className="bg-p1 w-[150px] h-[80px] rounded shadow-md align-middle m-[100px] ">
       <button className="bg-p1 w-full h-full rounded"   onClick={handleButtonClick}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-full h-full"  fill="#100E09"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
       </svg></button>
       
       </div>
       </div>

   </div>
 </div>


        </>
    )
}

export default Box