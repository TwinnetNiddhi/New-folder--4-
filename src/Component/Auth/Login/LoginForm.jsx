import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Input, Form } from 'antd';
import socket from '../../socket.io/service';
import '../../../Component/App_Details_theme/css/login.css';
import '../../../Component/Auth/Login/LoginForm.css'
import LoginFormOTP from '../../../Component/Auth/Login/LoginFormOTP'
import { useForm } from 'antd/lib/form/Form';
import  CustomMessage  from '../../CustomMessage/CustomMessage';
import { Helmet } from 'react-helmet';

const LoginForm = () => {
	const [loginFormAll, setLoginFormAll] = useState({
		email: '',
		password: '',
		rememberMe: false,
	})
	const [loading, setLoading] = useState(false);
	const [formErrors, setFormErrors] = useState({})
	const [otpVerificationStep, setOtpVerificationStep] = useState(false);
	const [emailAllData, setEmailAllData] = useState()
	const [form] = useForm();

	const onFinish = (value) => {
		const emailAllDataPass = value?.email
		setEmailAllData(emailAllDataPass)
		setLoading(true)
		if (!otpVerificationStep) {
			socket.emit('login|post', value);
			socket.once('login|post', (response) => {
				setLoading(true)
				try {
					if (response?.success) {
						setLoading(false)
						form.resetFields();
						CustomMessage('success', response?.message);
						setOtpVerificationStep(true)
					} else {
						CustomMessage('error', response?.message);
					}
				} catch (error) {
					console.log(error, "error");
					CustomMessage('error', error?.message);
				} finally {
					setLoading(false)
				}

			});
		}
	};

	const handleChnages = (e) => {
		setLoginFormAll({
			...loginFormAll,
			[e.target.name]: e.target.value
		})

		setFormErrors({
			...formErrors,
			[e.target.name]: '',
		});
	}

	const handleCheckboxChange = (e) => {
		setLoginFormAll({
			...loginFormAll,
			rememberMe: e.target.checked, 
		});
	};
	
	useEffect(() => {
		const loginButton = document.getElementById('login-button');
		if (loginButton) {
			if (loginFormAll.rememberMe) {
				loginButton.disabled = false;
			} else {
				loginButton.disabled = true;
			}
		}
	}, [loginFormAll.rememberMe]);

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<div id="login-page">
			 <Helmet>
                <title>Login Form</title>
            </Helmet>
			<main>
				<div className="row gx-0">
					<div className="col-lg-6 col-md-6 d-flex align-items-center">
						<div className="container">
							<div className="content w-100">
								<div className="logo d-flex justify-content-center">
									<img src={require('../../../Component/App_Details_theme/images/logo.png')} alt="Logo" className="img-fluid" />
								</div>
								<h2>Welcome to Twinnet Analytics 👋</h2>
								<p>Please Enter the login details</p>
								<Form
									name="basic"
									// form={form}
									initialValues={{
										remember: true,
									}}
									onFinish={onFinish}
									onFinishFailed={onFinishFailed}
									autoComplete="off"
								>
									<label htmlFor="email" className='height-set-Description'>Email<span className="required">*</span></label>

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
											size="large"
											placeholder="Enter Your Email"
											value={loginFormAll?.email}
											onChange={handleChnages}
											disabled={otpVerificationStep}
										/>
									</Form.Item>
									{!otpVerificationStep && (
										<>
											<label htmlFor="password" className='height-set-Description'>Password<span className="required">*</span></label>
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
													type='password'
													size="large"
													value={loginFormAll?.password}
													onChange={handleChnages}
												/>
											</Form.Item>
										</>
									)}

									{!otpVerificationStep && <div className="rpassword">
										<Link to="forget-password" className="forgot">Forgot your password?</Link>
									</div>}

									{!otpVerificationStep && <div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value={loginFormAll.rememberMe}
											id="flexCheckDefault"
											onChange={handleCheckboxChange}
										/>
										<label className="form-check-label" htmlFor="flexCheckDefault">
											Remember Information
										</label>
									</div>}

									{otpVerificationStep ? (
										<LoginFormOTP emailAllData={emailAllData} />
									) :
										<Button type="primary" htmlType="submit" loading={loading} className="btn login-btn "
										>
											Log in
										</Button>
									}

									<div className="or">
										<p>Or Sign Up with</p>
									</div>
									<a href="" className="google">
										<img src={require('../../../Component/App_Details_theme/images/google.png')} alt="google" />
										Sign in with Google
									</a>
									<div className="not text-center">
										<p>Not a member? <Link to="/signup">Signup Now</Link></p>
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
	)
}

export default LoginForm
