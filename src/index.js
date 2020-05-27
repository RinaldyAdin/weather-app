import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

function SearchIcon(props) {
    return <i className="fas fa-search fa-2x" />;
}

class Switch extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        // const { onClick } = this.props;
        // onclick(e.target.checked);
    }

    render() {
        return (
            <label className="switch" htmlFor="temp-switch">
                <input
                    type="checkbox"
                    name="temp-switch"
                    id="temp-switch"
                    // onClick={this.onClick}
                    checked
                />
                <span className="slider round" />
                <span className="switch-label">Celsius</span>
            </label>
        );
    }
}

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
            <form
                onSubmit={this.onSubmit}
                spellCheck="false"
                autoComplete="off"
            >
                <input
                    type="text"
                    placeholder="Location..."
                    onChange={this.updateLocation}
                />
                <button>
                    <SearchIcon />
                </button>
            </form>
        );
    }
}

class Weather extends React.Component {
    render() {
        const { data, metric } = this.props;
        if (data === null) return <div className="weather" />;

        const { icon, main } = data.weather[0];
        const location = data.name;

        let { temp } = data.main;
        temp = Math.round(temp);

        const imgSrc = `http://openweathermap.org/img/wn/${icon}@4x.png`;

        return (
            <div className="weather">
                <h2>{location}</h2>
                <div className="weather-main">
                    <img src={imgSrc} alt="weather icon" />
                    <h1>{`${temp}°${metric ? 'C' : 'F'}`}</h1>
                </div>
                <h2>{main}</h2>
                <Switch />
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.getWeather = this.getWeather.bind(this);

        this.state = {
            data: null,
            notFound: false,
            metric: true
        };
    }

    componentDidMount() {
        this.getWeather('london');
    }

    async getWeather(location) {
        try {
            const unit = this.state.metric ? 'metric' : 'imperial';

            const api = await fetch(
                `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&APPID=ea43808cef7f14291dd69003af2398f6`,
                { mode: 'cors' }
            );

            if (api.status === 200) {
                const data = await api.json();
                this.setState({ data, notFound: false });
            } else {
                throw new Error(api.status);
            }
        } catch (err) {
            if (err.message === '404') {
                this.setState({ notFound: true });
            } else {
                console.log(err);
            }
        }
    }

    render() {
        let parentClass = 'container';
        if (this.state.data !== null) {
            parentClass += ` ${this.state.data.weather[0].main.toLowerCase()}`;
        }

        let errorClass = 'error';
        if (this.state.notFound) {
            errorClass += ' visible';
        }

        return (
            <div className={parentClass}>
                <p className={errorClass}>Location not found</p>
                <SearchBar getWeather={this.getWeather} />
                <Weather data={this.state.data} metric={this.state.metric} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
