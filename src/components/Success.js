import React from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function Success() {
    return (
        <div style={{ float: 'bottom' }}>
            <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                This is a success alert — <strong>check it out!</strong>
            </Alert>
        </div>
    )
}

export default Success
