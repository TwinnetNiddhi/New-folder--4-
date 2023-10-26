import { Button, Input } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';
import { loginHandler } from '../../Redux/auth/action';
import { Helmet } from 'react-helmet';

const LoginFormOTP = ({ emailAllData }) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate(false)
  const cookies = new Cookies();
  const dispatch = useDispatch();

  const handleVerifyOTP = async (otp) => {
    setLoading(true);

    try {
      const response = await dispatch(loginHandler(otp, emailAllData, navigation));

      if (response?.success) {
        // navigation('/dashboard');
      } else {
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login Form OTP</title>
      </Helmet>
      <div className="otp d-flex">
        <div className="form-group">
          <label htmlFor="otp">OTP<span className="required">*</span></label>
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

export default LoginFormOTP
