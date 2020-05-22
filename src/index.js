import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.updateLocation = this.updateLocation.bind(this);

        this.state = {
            location: ''
        };
    }

    onSubmit(evt) {
        evt.preventDefault();
        const { getWeather } = this.props;
        const { location } = this.state;
        if (location !== '') getWeather(location);
    }

    updateLocation(evt) {
        const { value } = evt.target;
        this.setState({ location: value });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    type="text"
                    placeholder="Location..."
                    onChange={this.updateLocation}
                />
                <button>Search</button>
            </form>
        );
    }
}

class Weather extends React.Component {
    render() {
        const { data } = this.props;
        if (data === null) return <div className="weather" />;

        const { icon, main } = data.weather[0];
        let { temp } = data.main;
        const location = data.name;
        temp = Math.round(temp);

        const imgSrc = `http://openweathermap.org/img/wn/${icon}@4x.png`;

        return (
            <div className="weather">
                <h2>{location}</h2>
                <div className="weather-main">
                    <img src={imgSrc} alt="weather icon" />
                    <h1>
                        {temp}
                        °C
                    </h1>
                </div>
                <h2>{main}</h2>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.getWeather = this.getWeather.bind(this);

        this.state = { data: null };
    }

    componentDidMount() {
        this.getWeather('london');
    }

    async getWeather(location) {
        try {
            const api = await fetch(
                `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=ea43808cef7f14291dd69003af2398f6`,
                { mode: 'cors' }
            );
            if (api.status === 200) {
                const data = await api.json();
                console.log(data);
                this.setState({ data });
            } else {
                throw new Error(api.status);
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="container">
                <SearchBar getWeather={this.getWeather} />
                <Weather data={this.state.data} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
