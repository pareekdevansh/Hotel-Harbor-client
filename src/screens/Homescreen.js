import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Homescreen() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState('');
    useEffect(() => {
        async function getallrooms() {
            try {
                setloading(true)
                const data = (await axios.get('/api/rooms/getallrooms')).data;
                setrooms(data)
                setloading(false)
                seterror(false)
                // console.log(rooms);
            } catch (error) {
                seterror(true)
                console.log(error);
                setloading(false)
            }
        }
        getallrooms()
    }, []);

    return (
        <div className='container'>

            <div className='col horizontal-center'>
                {loading ? (<Loader />)
                    : (
                        error ?
                            (<Error />)
                            : (
                                rooms.map(room => {
                                    return <div className='col m-4'>
                                        <Room room={room} />
                                    </div>
                                })
                            )
                    )}
            </div >
        </div>

    )
}

export default Homescreen;
