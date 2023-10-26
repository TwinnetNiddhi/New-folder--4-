import { Button, Input } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import socket from '../../socket.io/service';
import CustomMessage from '../../CustomMessage/CustomMessage';
import { Helmet } from 'react-helmet';

const SignUpFormOTP = ({ emailAllData }) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate()

  const handleVerifyOTP = (otp) => {
    setLoading(true);
    socket.emit('otp|verify|registration', {
      email: emailAllData,
      otp: otp,
    });
    socket.once('otp|verify|registration', (response) => {
      setLoading(false);
      if (response?.success) {
        CustomMessage('success', response?.message);
        navigation('/');
      } else {
        CustomMessage('error', response?.message);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>SignUp Form OTP</title>
      </Helmet>
      <div className="otp d-flex">
        <div className="form-group">
          <label htmlFor="otp">OTP</label>
          <Input type="text" id="otp" name="otp" className="form-control" placeholder="Enter OTP" />
        </div>
        <div className="form-group d-flex align-items-end">
          <Button
            type="primary"
            htmlType="submit"
            className="btn"
            onClick={() => {
              const otp = document.getElementById('otp').value;
              handleVerifyOTP(otp);
            }}
            loading={loading}
          >
            Verify
          </Button>
        </div>
      </div>
    </>
  )
}

export default SignUpFormOTP