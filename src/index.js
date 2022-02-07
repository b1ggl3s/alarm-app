import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Button(props) {

    return (
      <button className="button" onClick={props.onClick}>
        {props.value}
      </button>
    )
  }


class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return(
            <form>
                <input type="text" name="name" />
            </form>

        )
    }
}

class ButtonRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const buttons = this.props.buttons;

        return(
            <div>
                {
                  buttons.map ( (i, index) => (
                      <Button key={index} value={i} />
                  ))  
                }
            </div>
        )
    }
}


class TimeInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const hour = this.props.hour.toLocaleString(
            'en-US', {minimumIntegerDigits: 2, useGrouping:false})
        const minute = this.props.minute.toLocaleString(
            'en-US', {minimumIntegerDigits: 2, useGrouping:false})

        return(
            <div>
                {hour}:{minute}
            </div>
        )
    }
}


class Alarm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: [12, 0]
        }
    }

    render() {
        const buttons = ['+', '-', '>', '+', '-'];
        const hour = this.state.time[0];
        const minute = this.state.time[1];

        return(
            <div className='alarm'>
                <h1>Alarm</h1>
                <TimeInput hour={hour} minute={minute}/>
                <ButtonRow buttons={buttons}/>
                <TextInput />
            </div>
        );
    }
}

ReactDOM.render(
    <Alarm />,
    document.getElementById('root')
);