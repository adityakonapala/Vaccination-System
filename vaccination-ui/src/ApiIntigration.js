// this api intigration is not belongs to this project i just did this for an interview preparation 

import axios from "axios";
import React, { useEffect, useState } from "react";
export default function ApiIntigration() {

    const [data, setdata] = useState([]);

    useEffect(() => {
        axios.get('https://fakestoreapi.noksha.dev/api/products')
            .then(response => {
                setdata(response.data.data)
            })
    }, []);
    return (
        <>
            <div className="container-fluid ">

                <div className="container d-flex flex-wrap ">
                    {
                        data.map((item) => (
                            <div className="card m-2 " style={{ width: "300px", height: "400px" }} >
                                <div className="card-header">
                                    <h4 className="text-primary text-center">{item.title}</h4>
                                </div>
                                <div className="card-body" >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={{ width: "100%", height: "250px" }}
                                    />
                                </div>
                                <div className="card-footer">
                                   <div className="btn btn-danger w-100 "><span className="bi bi-cart4 ">Add To Cart</span></div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}