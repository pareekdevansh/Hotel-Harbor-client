import React from 'react'
import { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};


function Loader() {

    return (
        <div className='m-3 sweet-loading'>
            <FadeLoader
                color={"#000222"}
                loading={true}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default Loader
