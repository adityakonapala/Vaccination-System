// this api intigration is not belongs to this project i just did this for an interview preparation 


import React, { useEffect, useState } from "react";
import axios from "axios";
export default function ApiInti() {

    const [data, setdata] = useState([]);

    useEffect(() => {

        axios.get('https://jsonplaceholder.typicode.com/photos')
            .then(response => {
                setdata(response.data);
            })
            .catch(error => {
                console.log(error);
            })

    }, []);
    return (
       <>
       <div className="header bg-danger" style={{height:'70px'}}>
                <h1 className=" text-center text-light">
                   
                   Google Images <span className="bi bi-emoji-heart-eyes" ></span>

                </h1>
            </div>
        <div className="container-fluid d-flex flex-wrap "> 

            {
                data.map(item => (
                    <div className="card m-4" style={{ width: "300px", height: "400px" }}>
                        <div className="card-header text-secondary text-center">
                            {item.title}
                        </div>
                        <div className="card-body text-center">
                            <img height={'250px'} width={'100%'}
                                src={item.url}
                                alt={item.title} 
                            />
                        </div>
                        <div className="card-footer ">
                            <div className="btn btn-danger w-100">
                                <span className="bi bi-emoji-heart-eyes-fill"> </span>
                            </div>
                        </div>
                    </div>
                ))
            }


        </div>
       </>
    );
}