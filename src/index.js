import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BsSun, BsMoon } from "react-icons/bs"

// Renders buttons for setting time and starting alarm in Button Row.
function Button(props) {
    const number = props.number;
    const value = props.value;

    // Buttons for setting time are disabled when alarm is set.

    let disableButton = false;
    if (value === "+" || value === "-") {
        disableButton = props.alarmStarted
    };
    return (
      <button disabled={disableButton} className="button" onClick={() => props.onClick(number)}>
        {props.value}
      </button>
    )
  }

// Text box component for user-input message that will be read by TTS when alarm rings.
class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return(
            <form>
                <input className="textBox" type="text" name="name" 
                placeholder="Enter joyful text-to-speech mesage to wake you up!" 
                value={this.props.value}
                onChange={this.props.onChange} />
            </form>

        )
    }
}

// Component that holds time-setting buttons and alarm start button.
class ButtonRow extends React.Component {
    constructor(props) {
        super(props);
    }

    renderButton(i, index) {
        return (
        <Button onClick={(i) => this.props.onClick(i)}
            value={i}
            number={index}
            key={index}
            alarmStarted={this.props.alarmStarted}
        />
        );
      }

    render() {
        const buttons = this.props.buttons;

        // Renders buttons by looping over "buttons" list stored in Clock component.
        return(
            <div>
                {
                  buttons.map ( (i, index) => (
                      this.renderButton(i, index)
                  )) 
                }
            </div>
        );
    }
}

// Component that displays alarm set time to user.
class Clock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const hour = this.props.hour.toLocaleString(
            'en-US', {minimumIntegerDigits: 2, useGrouping:false})
        const minute = this.props.minute.toLocaleString(
            'en-US', {minimumIntegerDigits: 2, useGrouping:false})

        return(
            <div className="clock">
                {hour}:{minute}
            </div>
        )
    }
}

function speak(text) {
    var msg = new SpeechSynthesisUtterance();
    var voices = speechSynthesis.getVoices();
    msg.voice = voices[7];
    msg.voiceURI = 'native';
    msg.volume = 1;
    msg.rate = 0.8;
    msg.pitch = 1;
    msg.text = text;
    msg.lang = 'en-US';
    
    speechSynthesis.speak(msg);
}


// Outermost component which contains the Clock, ButtonRow and TextInput components.
class Alarm extends React.Component {
    constructor(props) {
        super(props);
        this.myTimeout = null;
        // this.audio = null;
        this.handleClick = this.handleClick.bind(this);
        this.buttons = ['-', '+', 'Start', '-', '+'];
        this.start = ['Start', 'Stop']
        this.ringAlarm = this.ringAlarm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            time: [12, 0],
            alarmStarted: false,
            value: "",
            darkTheme: false
        }
    };

    // Upon setting alarm, calculates the number of seconds to delay the ringing of alarm.
    calculateAlarm() {
        const date = new Date();
        const currentTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
        const alarm = this.state.time
        const hour = alarm[0] - currentTime[0]
        const minute = alarm[1] - currentTime[1]
        const second = 0 - currentTime[2]
        let timeDiff = hour * 3600 + minute * 60 + second
        timeDiff = timeDiff + 24 * 3600
        timeDiff = timeDiff % (24 * 3600)
        timeDiff = timeDiff * 1000
        return(timeDiff)

    };

    // Stops tts if user deactivates alarm.
    stopTimer() {
        clearTimeout(this.myTimeout);
        speechSynthesis.cancel()
        // this.audio.pause();
    };

    // Executes when alarm delay ends.
    ringAlarm() {
        const transcriptDefault = "Wake up...It's wordle day!"
        var transcript = this.state.value ? this.state.value : transcriptDefault;
        for (let i = 0; i < 100; i++) {
            speak(transcript)
        }
 
        // this.audio = new Audio(mp3); 
        // this.audio.play();

    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleClick(j) {
        const date = new Date().toLocaleTimeString()
        const time = this.state.time
        const hour = time[0]
        const minute = time[1]
        const alarmStarted = this.state.alarmStarted
        const className = "dark"
        const darkTheme = this.state.darkTheme
        switch(j) {
            case 0:
                this.setState({
                    time: [(hour+23) % 24, minute]
                });
                break;
            case 1:
                this.setState({
                    time: [(hour+1) % 24, minute]
                });
                break;
            case 2:
                
                this.buttons[2] = !alarmStarted ? this.start[1] : this.start[0]
                this.setState({
                    alarmStarted: !alarmStarted
                })
                if (!alarmStarted) {
                    this.myTimeout = setTimeout(this.ringAlarm, this.calculateAlarm())
                } else {
                    this.stopTimer()
                }
                break;
            case 3:
                this.setState({
                    time: [hour, (minute + 59) % 60]
                });
                break;
            case 4:
                this.setState({
                    time: [hour, (minute + 1) % 60]
                });
                break;
            case 'themeToggle':
                if (!darkTheme) {
                    document.documentElement.classList.add(className)
                } else {
                    document.documentElement.classList.remove(className)
                }
                this.setState({darkTheme: !darkTheme})
                break;
            default:
                {};

            
        }
    }

    render() {
        const buttons = this.buttons;
        const hour = this.state.time[0];
        const minute = this.state.time[1];
        const alarmStarted = this.state.alarmStarted;
        const darkTheme = this.state.darkTheme;

        return(
            <div>
                <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <button className="toggleButton"
                    onClick={() => this.handleClick('themeToggle')}
                    // style={{ margin: 'auto }}
                    >
                        {darkTheme ? (
                            <BsSun color="ff0" size="24" title="Switch to light mode" />
                        ) : (<BsMoon size="24" title="Switch to dark mode" />
                        )}
                    </button>
                </div>
                <div className='alarm'>
                    <Clock hour={hour} minute={minute}/>
                    <ButtonRow onClick={(j) => this.handleClick(j)}
                    buttons={buttons} alarmStarted={alarmStarted}/>
                    <TextInput value={this.state.value} onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
    <Alarm />,
    document.getElementById('root')
);