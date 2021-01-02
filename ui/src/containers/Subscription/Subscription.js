import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Embed, Form, Grid} from "semantic-ui-react";
import story from './story.png';
import storyMobile from './story-resize.png';
import manifesto from './manifesto.png';
import './Subscription.css';
import naybxrzVideo from './Nqybxrz_V1.mp4';
import * as actions from './../../store/actions/index';
import {isMobile, isTablet} from 'react-device-detect';

class Subscription extends Component {

    state = {
        email: '',
        showMessage: false
    }

    componentDidMount() {
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    subscribeUser = () => {
        this.props.subscribeUser(this.createUser());
        this.setState({email: '', showMessage: true});
    }

    createUser() {
        return {
            email: this.state.email
        }
    }

    render() {

        let added = undefined
        if (this.props.subscribedUser !== '' && this.props.subscribedUser !== '') {
            added = <span className="subscription-main-info-added-text" aria-label="{'\u1F64C'}">
                Aiight ! We let you know <span role="img" aria-label="emoji">{String.fromCodePoint(0x1F64C)}</span>
            </span>
        }

        let columnWidthButton = 3;
        let columnWidthText = 7;
        let image = story
        if (isMobile){
            columnWidthButton = 10;
            columnWidthText = 10;
            image = storyMobile
        }

        return <div className="subscription-main">
            <img src={image} alt="Naybxrz Story Street life Street wear Culture"
                 className="subscription-main-img"/>
            <div className="subscription-main-video">
                <Embed id="9I7IJtgk2xM"
                    //source="youtube"
                       url={naybxrzVideo}
                       placeholder={manifesto}
                />
            </div>
            <div className="subscription-main-info">
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={columnWidthText} mobile>
                            <Form.Input required inverted loading={this.props.subscribeUserLoading}
                                        placeholder='Email...'
                                        name='email'
                                        size="small"
                                        value={this.state.email}
                                        style={{width: '100%', paddingBottom: '3%'}}
                                        onChange={this.handleChange}/>

                        </Grid.Column>
                        <Grid.Column width={columnWidthButton} mobile>
                            <Button className="subscription-main-info-button"
                                    style={{background: 'yellow'}}
                                    onClick={() => this.subscribeUser()}>
                                <span className="subscription-main-info-button-text">Join the tribe !</span>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            {added}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        subscribeUserLoading: state.users.subscribeUserLoading,
        subscribedUser: state.users.subscribedUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        subscribeUser: (user) => dispatch(actions.subscribeUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);