import React, { Component } from 'react';
import io from 'socket.io-client'

import LoginForm from './LoginForm';
import ChatRoom from './ChatRoom';

const socketURL = 'https://agile-cliffs-98788.herokuapp.com/';
// const socketURL = '10.0.0.4:5000'

export default class Login extends Component {
	constructor(props){
		super(props);

		this.state={
			socket:null,
			user: '',
			userList: [],
			messages: [], 
			typingMessage: ''
		}
	}

	initSocket = () => {
		const socket = io(socketURL);

		socket.on('connect', () => {
			console.log('Socket is connected!')

			socket.emit('createMessage', {
				from: 'client',
				to: 'server',
				text: 'this is from client',
				createdAt: 123
			});
		})

		socket.on('disconnect', () => {
			console.log('Disconnected from server!')
		})

		socket.on('newMessage', (data) => {
			console.log('New email:', data);
		})

		socket.on('newUserEnterChat', ({username, userList}) => {
			const user = username;
			const messageId = this.state.messages.length
			const text = user + ' has entered the chat.'
			const now = new Date();
			const date = now.toLocaleString();

			const welcomeMessage = {
				id:messageId,
				author: 'Admin',
				date: date,
				text: text
			}
			const {messages} = this.state
			messages.push(welcomeMessage);

			this.setState({userList, messages})
		})

		socket.on('userLeftChat', (userList) => {
			console.log('user has left the chat');
			this.setState({userList})
		})

		socket.on('activateTypingMessage', (username) => {
			var timeout;

			const typingMessage = `${username} is typing...`;
			this.setState({typingMessage})

			timeout = setTimeout(() => {
				this.setState({typingMessage: ''})
		    }, 3000);
			

		})

		this.setState({socket});
	}

	componentDidMount(){
		this.initSocket();
	}

	enterChat = (user,userList) => {
		const socket = io(socketURL);

		socket.emit('newUser', user);
		this.setState({user, userList})
	}

	userTyping = () => {
		const { user } = this.state
		const socket = io(socketURL);

		socket.emit('userTyping', user);
	}

	render(){
		const { socket,user,userList,messages, typingMessage } = this.state
		const userTyping = this.userTyping
		return(
			<div>
				<p>This is the Login.js page</p>
				{ user ? 
					<ChatRoom 
						socket={socket} 
						userList={userList} 
						messages={messages} 
						userTyping={userTyping}
						typingMessage={typingMessage}
					/>
					:
					<LoginForm  socket={socket} enterChat={this.enterChat}/>
				}
			</div>
		)
	}
}