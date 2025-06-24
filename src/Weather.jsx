import { useEffect, useState } from 'react';
import sunlogo from './assets/sun.png';
import sunBG from './assets/sunBG.jpg';
import axios from 'axios';
export const Weather = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [dateTime, setDatetime] = useState(new Date());
     
    // getData
    const getData = async(defaultCity = city) => {
        if(!defaultCity) return;
        setLoading(true);
        setError("")
        setWeatherData(null);
        try {
            const ApiKey = 'a7269d6d493d3531065a0480e789324f'
            const url = `https://api.openweathermap.org/data/2.5/weather`;
            const res = await axios.get(url,{
                params: {
                    appid: ApiKey,
                    q: defaultCity,
                    units: "metric" 
                }
            })
            if(res.status === 200) {
                console.log(res.data)
                setWeatherData(res.data);
                if(defaultCity !== "Kolkata") 
                    setCity("");
            }
        } catch (error) {
            console.log(error)  
            setError("Faild to Fetch Weather data")
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getData("Kolkata");
        //update time every second
        const timer = setInterval(()=> {
            setDatetime(new Date())
        },1000)
        return () => clearInterval(timer); // clear time on unmount
    },[])

    //format date and time
    const formattedTime = dateTime.toLocaleTimeString();
    const formattedDate = dateTime.toLocaleDateString();
    const formattedDay = dateTime.toLocaleDateString(undefined, {weekday: "long"});
    return (
         <div className='relative'>
             <div className='absolute bottom-[-20px] right-[10px] text-center'>
                 <h2 className=' text-white font-bold'>{formattedTime}</h2>
                 <h3 className=' text-white font-bold'>{formattedDate}</h3>
             </div>
            <img src={sunlogo} alt="" className='flex justify-center w-[100px] shadow-2xl animate h-[100px] mt-5 object-contain mx-auto' style={{alignItems: "center"}}/>
            <div className='mt-4 flex justify-center bg-[rgba(0,0,0,0.3)] shadow-2xl w-[650px] mx-auto' style={{alignItems: "start"}}>
                <div className='shrink-0 w-[50%] relative'>
                    <img src={sunBG} alt="" className='w-[450px] h-[370px] object-cover'/>
                    <div className='absolute bottom-[2%] left-[2%] text-center'>
                    <h2 className=' text-white font-bold text-[20px]'>{formattedDay}</h2>                
                    <h3 className=' text-white font-bold text-[20px]'>{formattedTime}</h3>
             </div>
                </div>
                <div className='grow-0 pl-3 w-[50%]'>
                    <div className='w-full'>
                        <input type="text" placeholder='Enter Your City' value={city} onChange={(e)=>setCity(e.target.value)} className='outline-0 border-0 border-b-[1px] border-white w-[85%] py-[10px] text-white'/>
                        <button onClick={()=> getData(city)} className='outline-0'><i className='bi bi-search text-white text-[20px] cursor-pointer'></i></button>
                    </div>
                    {loading && <p className='text-white text-center'>Loading...</p>}
                    {error && <p className='text-red-600 shadow-2xl text-center'>{error}</p>}
                    {/* get data */}
                    {weatherData && (
                        <div className='flex flex-col mt-3 text-center text-white capitalize'>
                               <h2 className='text-white'>Name: {weatherData.name}, {weatherData.sys.country}</h2>
                               <h3>Temperature: {weatherData.main.temp} °C</h3>
                               <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} className='w-[100px] h-[100px] object-contain flex justify-center mx-auto transform invert-25' alt="" />
                               <p className='mb-2'>Condition: {weatherData.weather[0].description}</p>
                               <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                               <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                        </div>

                    )}
                </div>
            </div>
         </div>
    )
}