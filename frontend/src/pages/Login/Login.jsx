import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import classes from './Login.module.css'
const Login = () => {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  const navigate = useNavigate()
  const handleLogin = (e) => {
    e.preventDefault()
    if (username && room) {
      navigate(`chat/${username}/${room}`)
    } else {
      alert('Enter username and room')
    }
  }
  return (
    <Form className={classes['login-container']} onSubmit={handleLogin}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="username"
          placeholder="Enter username"
        />
      </Form.Group>

      <Form.Group controlId="formBasicText">
        <Form.Label>Room id:</Form.Label>
        <Form.Control
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Enter room id"
        />
      </Form.Group>

      <Button type="submit">Login</Button>
    </Form>
  )
}

export default Login
