import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Form } from 'antd';
import socket from '../../socket.io/service';
import SignUpFormOTP from './SignUpFormOTP';
import '../../../Component/App_Details_theme/css/register.css';
import '../../../Component/Auth/SignUpForm/SignUpForm.css'
import CustomMessage from '../../CustomMessage/CustomMessage';
import { Helmet } from 'react-helmet';

const SignUpForm = () => {
    const [loading, setLoading] = useState(false);
    const [signUpform, setSignUpform] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    })
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpVerificationStep, setOtpVerificationStep] = useState(false);
    const [emailAllData, setEmailAllData] = useState()
    const [form] = Form.useForm()

    const onFinish = (value) => {
        setLoading(true);
        const emailAllDataPass = value?.email;
        setEmailAllData(emailAllDataPass);
        if (!otpVerificationStep) {
            socket.emit('registration|post', value);
            socket.once('registration|post', (response) => {
                setLoading(false);
                try {
                    if (response?.success) {
                        CustomMessage('success', response?.message);
                        setOtpVerificationStep(true);
                        form.resetFields(['email']);
                    } else {
                        CustomMessage('error', response?.message);
                    }
                } catch (error) {
                    console.log(error, 'error');
                    CustomMessage('error', error?.message);
                }
            });
        }
    };


    const handleChnages = (e) => {
        if (e.target.name === 'password') {
            setSignUpform({
                ...signUpform,
                [e.target.name]: e.target.value
            });
        } else if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Helmet>
                <title>SignUp Form</title>
            </Helmet>
            <div id="register-page">
                <main>
                    <div className="row gx-0">
                        <div className="col-lg-6 col-md-6 d-flex align-items-center">
                            <div className="container">
                                <div className="content w-100">
                                    <div className="logo d-flex justify-content-center">
                                        <img src={require('../../../Component/App_Details_theme/images/logo.png')} alt="Logo" className="img-fluid" />
                                    </div>
                                    <h2>Welcome to Twinnet Analytics 👋</h2>
                                    <p>Sign Up & Create your account</p>
                                    <Form
                                        name="basic"
                                        initialValues={{
                                            remember: true,
                                        }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                    // form={form}
                                    >
                                        {!otpVerificationStep && (
                                            <>
                                                <label htmlFor="name" className='height-set-Description'>Name</label>
                                                <Form.Item
                                                    name="name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please Enter Your Name!',
                                                        },
                                                    ]}
                                                    className='height-set-Description'
                                                >
                                                    <Input
                                                        type="name"
                                                        id="name"
                                                        placeholder="Enter Your Name"
                                                        value={signUpform?.name}
                                                        onChange={handleChnages}
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </>
                                        )}

                                        {(
                                            <>
                                                <label htmlFor="email" className='height-set-Description'>Email</label>
                                                <Form.Item
                                                    name="email"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please Enter Your Email!',
                                                        },
                                                    ]}
                                                    className='height-set-Description'
                                                >
                                                    <Input
                                                        type="email"
                                                        id="email"
                                                        placeholder="Enter Your Email"
                                                        value={signUpform?.email}
                                                        onChange={handleChnages}
                                                        disabled={otpVerificationStep}
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </>
                                        )}

                                        {!otpVerificationStep && (
                                            <>
                                                <label htmlFor="phone" className='height-set-Description'>Phone Number</label>
                                                <Form.Item
                                                    name="phone"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please Enter Your Phone Number!',
                                                        },
                                                        {
                                                            pattern: /^[0-9]{10}$/, // Match exactly 10 digits
                                                            message: 'Phone Number Must Be 10 Digits.',
                                                        },
                                                    ]}
                                                    className='height-set-Description'
                                                >
                                                    <Input
                                                        type="tel"
                                                        id="phone"
                                                        className='height-set-Description'
                                                        placeholder="Enter Your Phone"
                                                        value={signUpform?.phone}
                                                        size="large"
                                                        onChange={handleChnages}
                                                        onKeyPress={(e) => {
                                                            const pattern = /^[0-9\b]+$/;
                                                            if (!pattern.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        maxLength={10} // Set the maximum length to 10 characters
                                                    />
                                                </Form.Item>
                                            </>
                                        )}

                                        {!otpVerificationStep && (
                                            <>
                                                <label htmlFor="password" className='height-set-Description'>Password</label>
                                                <Form.Item
                                                    name="password"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please Enter Your Password!',
                                                        },
                                                    ]}
                                                    className='height-set-Description'
                                                >
                                                    <Input.Password
                                                        placeholder="Enter Your Password"
                                                        id="password"
                                                        className='height-set-Description'
                                                        type='password'
                                                        size="large"
                                                        value={signUpform?.password}
                                                        onChange={handleChnages}
                                                    />
                                                </Form.Item>
                                            </>
                                        )}

                                        {!otpVerificationStep && (
                                            <>
                                                <label htmlFor="password" className='height-set-Description'>Confirm password</label>
                                                <Form.Item
                                                    name="confirmPassword"
                                                    dependencies={['password']}
                                                    hasFeedback
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please Confirm Your Password!',
                                                        },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue('password') === value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('The Two Passwords Do Not Match!'));
                                                            },
                                                        }),
                                                    ]}
                                                    className='height-set-Description'
                                                >
                                                    <Input.Password
                                                        placeholder="Confirm Your Password"
                                                        id="confirmPassword"
                                                        className='height-set-Description'
                                                        type="password"
                                                        size="large"
                                                        value={confirmPassword}
                                                        onChange={handleChnages}
                                                    />
                                                </Form.Item>
                                            </>
                                        )}

                                        {otpVerificationStep ? (
                                            <SignUpFormOTP emailAllData={emailAllData} />
                                        ) : ''}

                                        {!otpVerificationStep && <div className="form-group">
                                            <Button type="primary" htmlType="submit" loading={loading} className="btn login-btn mt-4" disabled={otpVerificationStep}>
                                                Create account
                                            </Button>
                                        </div>}
                                        <div className="or">
                                            <p>Or Sign Up with</p>
                                        </div>
                                        <a href="" className="google">
                                            <img src={require('../../../Component/App_Details_theme/images/google.png')} alt="google" />
                                            Sign up with Google
                                        </a>
                                        <div className="not text-center">
                                            <p>already have an account ? <Link to="/">Sign In Now</Link></p>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <img src={require('../../../Component/App_Details_theme/images/login-img.png')} alt="Login-Image" className="img-fluid main-img" />
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default SignUpForm
