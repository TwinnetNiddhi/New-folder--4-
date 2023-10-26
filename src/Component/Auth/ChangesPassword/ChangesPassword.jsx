import React, { useRef, useState } from 'react'
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import { Button, Form, Input } from 'antd';
import socket from '../../socket.io/service';
import { toast } from 'react-toastify';
import '../../../Component/Auth/ChangesPassword/ChangesPassword.css'
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

const ChangesPassword = () => {
    const data_id = useSelector(state => state?.authReducer?.userId)
    const [changesPassword, setChangesPassword] = useState({
        _id: data_id, 
        oldPassword: '',
        newPassword: '',
    });
    const formRef = useRef();
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true)
            socket.emit('user|changePassword', values);
            socket.on('user|changePassword', (response) => {
                if (response?.success) {
                    form.resetFields();
                    toast.success(response.message)
                } else {
                    toast.error(response.message)
                }
                setLoading(false)
            });
        } catch (error) {
            console.log(error, "error");
            toast.error(error.message)
        } finally {
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onInputChange = (e) => {
        setChangesPassword((prevValues) => ({
            ...changesPassword,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <>
              <Helmet>
                <title>Changes Password</title>
            </Helmet>
            <div id="dashboard-page" className="pages">
                <main className="h-100" id="dashboard-maain">
                    <div className="row gx-lg-2 gx-0">
                        <Header />
                        {/* <!-- main dashboard --> */}
                        <div className="col-lg-9 left-col main-dashboard header-custom-col">
                            {/* <!-- top navbar --> */}
                            <Navbar showGoodMorning />
                            {/* <!-- create project --> */}
                            <div className="project">
                                <Form
                                    name="basic"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                    form={form}
                                    ref={formRef}
                                >
                                    <div class="right-header">
                                        <div class="row gx-0">
                                            <div class="col-6 d-flex align-items-start">
                                                <h2>Changes Password</h2>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="content w-100">
                                        <Form.Item
                                            name="_id"
                                            initialValue={changesPassword._id}
                                            noStyle
                                        >
                                            <Input type="hidden" />
                                        </Form.Item>

                                        <label htmlFor="oldPassword" className='height-set'>Current Password<span className="required">*</span></label>
                                        <Form.Item
                                            name="oldPassword"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please Enter Your Current Password!',
                                                },
                                            ]}
                                            className='height-set'
                                        >
                                            <Input.Password
                                                placeholder="Enter Your Current Password"
                                                id="oldPassword"
                                                type='oldPassword'
                                                value={changesPassword?.oldPassword}
                                                onChange={(e) => onInputChange(e, 'oldPassword')}
                                                name="oldPassword"
                                                className="custom-input"
                                            />
                                        </Form.Item>

                                        <label htmlFor="newPassword" className='height-set'>New Password<span className="required">*</span></label>
                                        <Form.Item
                                            name="newPassword"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please Enter Your New Password!',
                                                },
                                            ]}
                                            className='height-set'
                                        >
                                            <Input.Password
                                                placeholder="Enter Your New Password"
                                                id="password"
                                                type='password'
                                                className="custom-input"
                                                value={changesPassword?.newPassword}
                                                onChange={(e) => onInputChange(e, 'newPassword')}
                                            />
                                        </Form.Item>

                                        <label htmlFor="newPassword" className='height-set'>Confirm New Password<span className="required">*</span></label>
                                        <Form.Item
                                            name="confirmPassword"
                                            dependencies={['newPassword']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please Confirm New Password!',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('newPassword') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('The New Password and Confirm New Passwords Do Not Match!'));
                                                    },
                                                }),
                                            ]}
                                            className='height-set'
                                        >
                                            <Input.Password
                                                placeholder="Confirm New Password"
                                                id="confirmPassword"
                                                type="password"
                                                className="custom-input"
                                            />
                                        </Form.Item>

                                        <div className="form-group d-flex align-items-end button-color height-set ">
                                            <Button type="primary" htmlType="submit" loading={loading} className="btn bg-color-submit-changes">
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default ChangesPassword
