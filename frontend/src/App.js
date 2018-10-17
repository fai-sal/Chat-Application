import React, { Component } from 'react';
import io from 'socket.io-client'
import FormField from './components/formField'
import MessageBox from './components/messageBox'
import { Container, Row, Button } from 'reactstrap'
const socket = io.connect('http://localhost:4005')
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: "",
      message: "",
      messages: [],
      typing: ""
    }

  }
  componentDidMount() {
    const { messages } = this.state
    socket.on('newMessage', (data) => {
      messages.push(`${data.userName} : ${data.message}`)
      this.setState({
        messages: messages,
        typing: ""
      })
    })

    socket.on('typing', data => {
      this.setState({
        typing: `${data} is typing`
      })
    })
  }
  render() {
    const { messages, typing } = this.state

    return (
      <Container >
        <MessageBox
          messages={messages}
          typingMessage={typing}
        />
        <FormField
          inputFieldOnChange={this.inputFieldOnChange}
          value={this.state.message}
          sendButtonOnClick={this.sendButtonOnClick}
        />
        <Row>
          <Button onClick={this.clearMessages} style={styles.buttonStyle}>Clear All</Button>
        </Row>
      </Container>
    );
  }
  clearMessages = () => {
    this.setState({
      userName: "",
      message: "",
      messages: [],
      typing: ""
    })
  }

  inputFieldOnChange = (event) => {
    if (event.target.name === 'message') {
      socket.emit('typing', this.state.userName)
    }
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  sendButtonOnClick = (event) => {
    const { userName, message } = this.state
    socket.emit('newMessage', {
      message: message,
      userName: userName
    })
    this.setState({
      message: ""
    })
  }

}
export default App;
const styles = {
  buttonStyle: {
    padding: '1%',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderRadius: '10px'
  }
}