import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';


function SignUp({ email: initialEmail }) {
    const [email, setEmail] = useState(initialEmail);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birth, setBirth] = useState(null);
    const [gender, setGender] = useState('male');
    const [passwordMismatch, setPasswordMismatch] = useState(false); 
    const [formErrors, setFormErrors] = useState({}); 

    useEffect(() => {
        // 이메일 prop이 변경될 때마다 이메일 입력란에 값을 설정
        if (initialEmail) {
            setEmail(initialEmail); // 초기 이메일 값을 설정할 때도 상태 변수 이름 사용
        }
    }, [initialEmail]);

    const handleSignUp = (e) => {
        e.preventDefault();
        axios.post('/users/join', {
            email,
            userName,
            password,
            birth,
            gender
        })
        .then(response => {
            // 사용자 정보 등록 성공 시 처리
            console.log('User registration successful:', response.data);
            // 사용자를 로그인 페이지로 리디렉션 또는 다른 작업 수행
        })
        .catch(error => {
            // 사용자 정보 등록 실패 시 처리
            console.error('User registration failed:', error);
            // 오류 처리 또는 사용자에게 메시지 표시
        });

        // 비밀번호와 확인 비밀번호가 같은지 확인
        if (password !== confirmPassword) {
            setPasswordMismatch(true); // 일치하지 않으면 상태 변수를 true로 설정
            return; // 함수를 빠져나감
        } else {
            setPasswordMismatch(false); // 일치하면 상태 변수를 false로 설정
        }

        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
        }
        if (!userName) {
            errors.userName = 'Name is required';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        if (!confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        if (!birth) {
            errors.birth = 'Birth Date is required';
        }
        if (!gender) {
            errors.gender = 'Gender is required';
        }

        // 오류가 있는지 확인하고 상태 변수에 저장
        if (Object.keys(errors).length === 0) {
            setFormErrors({});
        } else {
            setFormErrors(errors);
            return;
        }

        // 회원가입 로직을 여기에 추가하세요
        console.log('Signing up with email:', email);
        console.log('userName:', userName);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
        console.log('Birth:', birth);
        console.log('Gender:', gender);
    };


    return (
        <Form onSubmit={handleSignUp}>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={formErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="userName" className='mt-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    isInvalid={formErrors.userName}
                />
                <Form.Control.Feedback type="invalid">
                    {formErrors.userName}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className='mt-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={formErrors.password}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    {formErrors.password}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className='mt-2'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordMismatch(false); // 확인 비밀번호를 변경할 때마다 불일치 플래그를 초기화
                    }}
                    isInvalid={formErrors.confirmPassword || passwordMismatch}
                    required
                />
                {passwordMismatch && (
                    <p style={{ color: 'red' }}>Passwords do not match</p>
                )}
                <Form.Control.Feedback type="invalid">
                    {formErrors.confirmPassword || (passwordMismatch && 'Passwords do not match')}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group controlId="birth" className="mt-2">
                <Form.Label>Birth Day</Form.Label>
                <Row>
                    <Col>
                        <InputGroup>
                        <DatePicker
                                className="form-control"
                                selected={birth}
                                onChange={(date) => setBirth(date)}
                                dateFormat="yyyy-MM-dd"
                                showDropdown
                                minDate={new Date('1950-01-01')}
                                maxDate={new Date()}
                                placeholderText="Year"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Form.Control.Feedback type="invalid">
                    {formErrors.birth}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="gender" className='mt-2'>
                <Form.Label>Gender</Form.Label>
                <Row>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Male"
                            name="gender"
                            value="male"
                            checked={gender === 'male'}
                            onChange={() => setGender('male')}
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Female"
                            name="gender"
                            value="female"
                            checked={gender === 'female'}
                            onChange={() => setGender('female')}
                        />
                    </Col>
                </Row>
            </Form.Group>
            
            <div className="d-grid gap-1 mt-3">
                <Button
                variant="secondary"
                type="button"
                onClick={handleSignUp}
                >
                Sign Up
                </Button>
             </div>
        </Form>
    );
}

export default SignUp;