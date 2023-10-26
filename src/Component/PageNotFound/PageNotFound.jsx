import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.css';
import $ from 'jquery';
import { Helmet } from 'react-helmet';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate('/dashboard');
    };

    const buttonStyle = {
        color: 'white',
    };

    return (
        <>
            <Helmet>
                <title>Page Not Found</title>
            </Helmet>
            <div className="center-container">
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={handleBackHome} style={buttonStyle}>Back To Dashboard</Button>}
                />
            </div>
        </>
    );
};

export default PageNotFound
