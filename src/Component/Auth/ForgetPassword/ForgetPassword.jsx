import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Button, Input, Form } from 'antd';
import socket from '../../socket.io/service';
import '../../../Component/App_Details_theme/css/login.css';
import '../../../Component/Auth/Login/LoginForm.css'
import { useForm } from 'antd/lib/form/Form';
import { Helmet } from 'react-helmet';

const ForgetPassword = () => {
	const navigation = useNavigate()
	const [loading, setLoading] = useState(false);
	const [isForgetPasswordClicked, setIsForgetPasswordClicked] = useState(false);
	const [forgetPasswordForm, setForgetPasswordForm] = useState({
		email: '',
	})
	const [form] = useForm();
	const [otpVerificationStepForget, setOtpVerificationStepForget] = useState(false);
	const [forgetPasswordFormOtpForm, setForgetPasswordFormOtpForm] = useState({
		otp: '',
		newPassword: '',
	})

	const handleForgetPassword = (value) => {
		setLoading(true)
		if (!otpVerificationStepForget) {
			socket.emit('forgetPassword', value);
			socket.once('forgetPassword', (response) => {
				setLoading(true)
				try {
					if (response?.success) {
						setLoading(false)
						form.resetFields();
						toast.success(response?.message)
						setOtpVerificationStepForget(true)
					} else {
						toast.error(response?.message)
					}
				} catch (error) {
					console.log(error, "error");
					toast.error(error?.message)
				} finally {
					setLoading(false)
				}
			});
		} else {
			socket.emit('otp|verify|forgetPassword', value);
			socket.once('otp|verify|forgetPassword', (response) => {
				setLoading(true)
				try {
					if (response?.success) {
						setLoading(false)
						form.resetFields();
						toast.success(response?.message)
						setOtpVerificationStepForget(false)
						navigation('/');
					} else {
						toast.error(response?.message)
					}
				} catch (error) {
					console.log(error, "error");
					toast.error(error?.message)
				} finally {
					setLoading(false)
				}
			});
		}
	};

	const handleChnagesForgetPassword = (e) => {
		setForgetPasswordForm({
			...forgetPasswordForm,
			[e.target.name]: e.target.value
		})
	}

	const handleChnagesForgetPasswordOTP = (e) => {
		setForgetPasswordFormOtpForm({
			...forgetPasswordFormOtpForm,
			[e.target.name]: e.target.value
		})
	}

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const forgetPassword = () => {
		setIsForgetPasswordClicked(true);
	}

	return (
		<div id="login-page">
			<Helmet>
				<title>Forget Password</title>
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
									initialValues={{
										remember: true,
									}}
									onFinish={
										handleForgetPassword
									}
									onFinishFailed={onFinishFailed}
									autoComplete="off"
								>
									{
										<>
											<label htmlFor="email" className='height-set'>Email<span className="required">*</span></label>
											<Form.Item
												name="email"
												rules={[
													{
														required: true,
														message: 'Please Enter Your Email!',
													},
												]}
												className='height-set'
											>
												<Input
													type="email"
													id="email"
													size="large"
													placeholder="Enter Your Email"
													value={forgetPasswordForm?.email}
													onChange={handleChnagesForgetPassword}
													disabled={otpVerificationStepForget}
												/>
											</Form.Item>
										</>
									}

									{otpVerificationStepForget && (
										<>
											<div className="form-group">
												<label htmlFor="otp">OTP<span className="required">*</span></label>
												<Form.Item
													name="otp"
													rules={[
														{
															required: true,
															message: 'Please Enter Your OTP!',
														},
													]}
													className='height-set'
												>
													<Input
														type="text"
														id="otp"
														name="otp"
														className="form-control"
														placeholder="Enter OTP"
														value={forgetPasswordFormOtpForm?.otp}
														onChange={handleChnagesForgetPasswordOTP}
													/>
												</Form.Item>
											</div>
											<label htmlFor="newPassword" className='height-set'>New Password<span className="required">*</span></label>
											<Form.Item
												name="newPassword"
												rules={[
													{
														required: true,
														message: 'Please Enter Your newPassword!',
													},
												]}
												className='height-set'
											>
												<Input.Password
													placeholder="Enter Your New Password"
													id="password"
													type='password'
													name='newPassword'
													size="large"
													value={forgetPasswordFormOtpForm?.newPassword}
													onChange={handleChnagesForgetPasswordOTP}
												/>
											</Form.Item>
										</>
									)}

									{isForgetPasswordClicked && !otpVerificationStepForget && <div className="rpassword">
										<Link to="" className="forgot" onClick={forgetPassword}>Forgot your password?</Link>
									</div>}

									&nbsp;&nbsp;
									<Button
										type="primary"
										htmlType="submit"
										loading={loading}
										className="btn login-btn"
									>
										{otpVerificationStepForget ? `Submit` : `Forgot Password`}
									</Button>

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

export default ForgetPassword
