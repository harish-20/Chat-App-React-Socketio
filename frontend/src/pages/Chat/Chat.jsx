import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import classes from './Chat.module.css'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeUsers, setActiveUsers] = useState([])
  const params = useParams()

  const navigate = useNavigate()

  const name = params.user
  const room = params.room
  const messageRef = useRef()
  const chatContainerRef = useRef()

  const socket = io('http://localhost:8080')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected ', params)
    })

    socket.emit('join', { name, room }, (error) => {
      alert(error)
      navigate('/')
    })

    messageRef.current.focus()
    return () => {
      socket.disconnect()
      socket.off()
    }
  }, [])

  useEffect(() => {
    const container = document.getElementById('chat-container')
    chatContainerRef.current.scroll({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  socket.on('setactiveusers', (users) => {
    setActiveUsers(users.activeUsers)
    console.log(users)
  })

  socket.on('messagein', (message) => {
    setMessages((prev) => [...prev, message])
  })

  const sendMessage = (event) => {
    event.preventDefault()
    setIsLoading(true)

    const name = params.user
    const room = params.room
    socket.emit(
      'sendmessage',
      {
        name,
        room,
        message: messageRef.current.value,
      },
      () => {
        console.log('message sent')
      },
    )

    messageRef.current.value = ''
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className={classes.chat}>
      <div className={classes.roomid}>
        <h4>Room id:</h4>
        <span>{room}</span>
      </div>
      <div
        id="chat-container"
        className={classes['chat-container']}
        ref={chatContainerRef}
      >
        <ul className={classes['message-container']}>
          {messages.map((message, i) => {
            console.log('messages', message)
            if (message.user !== undefined) {
              return (
                <li
                  key={i}
                  className={
                    name === message.user ? classes.sender : classes.receiver
                  }
                >
                  <h3 className={classes.user}>{message.user}</h3>{' '}
                  <p>{message.text}</p>
                </li>
              )
            }
            return (
              <li key={i} className={classes.info}>
                <em>{message.text}</em>
              </li>
            )
          })}
        </ul>
        <div className={classes['active-users']}>
          <h3>Active users</h3>
          <ul>
            {activeUsers.map((user) => (
              <li>
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={classes.actions}>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            name="message"
            ref={messageRef}
            autoComplete="off"
          />
          {isLoading ? (
            <Button onClick={sendMessage} style={{ background: 'darkblue' }}>
              Sending...
            </Button>
          ) : (
            <Button type="submit" onClick={sendMessage}>
              Send message
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}

export default Chat
