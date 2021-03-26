import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Tab, TabList, TabPanel, Tabs} from 'react-web-tabs';
import {Dimmer, Divider, Form, Grid, Icon, Image, Label, Loader, Modal, Progress} from "semantic-ui-react";
import Aux from "../../hoc/Aux/Aux";
import 'react-web-tabs/dist/react-web-tabs.css';
import './TabAccount.css';
import graffiti from './pen1.png';
import * as actions from "../../store/actions";

class TabAccount extends PureComponent {

    state = {
        open: false,
        email: this.props.user.email,
        phone: this.props.user.phone,
        number: this.props.user.address.number,
        address: this.props.user.address.address,
        postalCode: this.props.user.address.postalCode,
        city: this.props.user.address.city,
        country: this.props.user.address.country,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        errorOldPassword: '',
        flagErrorOldPassword: false,
        errorNewPassword: '',
        flagErrorNewPassword: false,
        errorConfirmPassword: '',
        flagErrorConfirmPassword: false
    }

    show = () => this.setState({open: true});
    close = () => this.setState({open: false});
    handleChange = (e, {name, value}) => this.setState({[name]: value});
    signOff = () => { this.props.signOffUser(this.props.history); }

    statusOrder = (status) => {
        if (status === 'ORDERED' || status === 'REQUIRED_ACTION' || status === 'WAITING')
            return 20;
        else if (status === 'CONFIRMED')
            return 50;
        else if (status === 'PROCESSING')
            return 79;
        else if (status === 'SHIPPED')
            return 100;
    };

    addUser = () => {
        console.log(this.constructUser());
        this.props.addUser(this.constructUser());
        this.close();
    };

    constructUser() {
        return {
            id: this.props.user.id,
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            email: this.state.email,
            phoneNumber: this.state.phone,
            address: {
                number: this.state.number,
                address: this.state.address,
                city: this.state.city,
                postalCode: this.state.postalCode,
                country: this.state.country
            }
        };
    }

    changePassword = () => {
        if (this.state.oldPassword !== '' && this.state.newPassword !== '' && this.state.confirmNewPassword !== '') {
            this.props.changedPassword(this.props.user.email, this.state.oldPassword, this.state.newPassword, this.state.confirmNewPassword);
        }

        if (this.state.oldPassword === '') {
            this.setState({errorOldPassword: 'Missing Old Password !'});
            this.setState({flagErrorOldPassword: true});
        } else {
            this.setState({flagErrorOldPassword: false});
        }

        if (this.state.newPassword === '') {
            this.setState({errorNewPassword: 'Missing New Password !'});
            this.setState({flagErrorNewPassword: true});
        } else {
            this.setState({flagErrorNewPassword: false});
        }

        if (this.state.confirmNewPassword === '') {
            this.setState({errorConfirmNewPassword: 'Missing Confirm Password !'});
            this.setState({flagErrorConfirmNewPassword: true});
        } else {
            this.setState({flagErrorConfirmNewPassword: false});
        }

    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.props.userChangedPassword === true) {
            this.setState({oldPassword: ''});
            this.setState({newPassword: ''});
            this.setState({confirmNewPassword: ''});
        }
    }

    trackOrder = (trackingNumber) => {
        window.open('https://www.canadapost.ca/track-reperage/en#/details/'+trackingNumber);
    }


    render() {
        const {open} = this.state;

        let orderInprogress = <Aux>
            <Label className="TabAccount-Label-Message" color="red" attached="top right">No order in progress with us
                for now ... Start picking before is too
                late -> Go Got it !</Label>
        </Aux>

        if (this.props.ordersHistory
            .filter(o => o.orderStatus !== 'SHIPPED')
            .length > 0) {
            orderInprogress = this.props.ordersHistory
                .filter(o => o.orderStatus !== 'SHIPPED')
                .map((order, index) => (
                    <Grid key={index} className="TabAccount-Orders-Grid">
                        <Grid.Row className="TabAccount-Orders-Grid-Row">
                            <Grid.Column width={5} className="TabAccount-Orders-Grid-Row">
                                <span className="TabAccount-Orders-Message">
                                    Order ID: {order.orderId}
                                </span>
                            </Grid.Column>
                            <Grid.Column width={5} className="TabAccount-Orders-Grid-Row">
                                <span className="TabAccount-Orders-Message">
                                    Order time: {order.orderTime}
                                </span>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <span>
                                    <Label tag color='red'
                                           className="TabAccount-Orders-Grid-Label">${order.total}</Label>
                                </span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="TabAccount-Orders-Grid-Row">
                            <Grid.Column width={5} className="TabAccount-Orders-Grid-Row">
                                <span className="TabAccount-Orders-Message">
                                    Order Status:
                                </span>
                            </Grid.Column>
                            <Grid.Column width={6} className="TabAccount-Orders-Grid-Row">
                                {order.orderStatus === 'REFUSED' ?
                                    <Progress className="TabAccount-Orders-Message-Progress"
                                              size='small'
                                              percent={100}
                                              error
                                              indicating> Refused </Progress> :
                                    <Progress className="TabAccount-Orders-Message-Progress"
                                              size='small'
                                              percent={this.statusOrder(order.orderStatus)}
                                              indicating>
                                        <span
                                            className="TabAccount-Progress-Text">ordered&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            processing&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            preparing to ship&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            shipped</span></Progress>}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid container>
                                {order.products.map((product, indexProduct) => (
                                    <Grid.Row key={indexProduct}>
                                        <Grid.Column width={5} className="TabAccount-Orders-Product">
                                            <Image wrapped
                                                   size='small'
                                                   src={product.image}/>
                                        </Grid.Column>
                                        <Grid.Column width={5} className="TabAccount-Orders-Product">
                                            <p className="TabAccount-Orders-Message">
                                                {product.productName}
                                            </p>
                                            <p className="TabAccount-Orders-Message">
                                                {product.productColor}
                                            </p>
                                            <p className="TabAccount-Orders-Message">
                                                {product.productSize}
                                            </p>
                                            <p className="TabAccount-Orders-Message">
                                                ${product.unitPrice}
                                            </p>
                                        </Grid.Column>
                                    </Grid.Row>
                                ))}
                            </Grid>
                        </Grid.Row>
                        <Grid.Row centered>
                            <div className="TabAccount-Orders-Separator-Product" />
                        </Grid.Row>
                    </Grid>
                ))
        }

        let orderConfirmed = <Aux>
            <Label className="TabAccount-Label-Message" color="red" attached="top right">No history with us for now ...
                Start picking before is too late ->
                Go Got it !</Label>
        </Aux>

        if (this.props.ordersHistory
            .filter(o => o.orderStatus === 'SHIPPED')
            .length > 0) {
            orderConfirmed = this.props.ordersHistory
                .filter(o => o.orderStatus === 'SHIPPED')
                .map((order, index) => (
                    <Grid key={index} className="TabAccount-Orders-Grid">
                        <Grid.Row className="TabAccount-Orders-Grid-Row">
                            <Grid.Column width={5} className="TabAccount-Orders-Grid-Row">
                                <span className="TabAccount-Orders-Message">
                                    Order ID: {order.orderId}
                                </span>
                            </Grid.Column>
                            <Grid.Column width={5} className="TabAccount-Orders-Grid-Row">
                                <span className="TabAccount-Orders-Message">
                                    Order time: {order.orderTime}
                                </span>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <span>
                                    <Label tag color='red'
                                           className="TabAccount-Orders-Grid-Label">${order.total}</Label>
                                </span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="TabAccount-Orders-Grid-Row">
                            <Grid.Column width={5} className="TabAccount-Orders-Grid-Row">
                                <span className="TabAccount-Orders-Message">
                                    Order Status:
                                </span>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                {order.orderStatus === 'REFUSED' ?
                                    <Progress className="TabAccount-Orders-Message-Progress"
                                              size='small'
                                              percent={100}
                                              error
                                              indicating> Refused </Progress> :
                                    <Progress className="TabAccount-Orders-Message-Progress"
                                              size='small'
                                              percent={this.statusOrder(order.orderStatus)}
                                              indicating>
                                        <span
                                            className="TabAccount-Progress-Text">ordered&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            processing&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            preparing to ship&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            shipped</span></Progress>}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <span className="TabAccount-Orders-Message">
                                    Tracking #: <a href='#' onClick={() => this.trackOrder(order.trackingNumber)}>{order.trackingNumber} </a>
                                </span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid container>
                                {order.products.map((product, indexProduct) => (
                                    <Grid.Row key={indexProduct}>
                                        <Grid.Column width={5} className="TabAccount-Orders-Product">
                                            <Image wrapped
                                                   size='small'
                                                   src={product.image}/>
                                        </Grid.Column>
                                        <Grid.Column width={5} className="TabAccount-Orders-Product">
                                            <p className="TabAccount-Orders-Message">
                                                {product.productName}
                                            </p>
                                            <p className="TabAccount-Orders-Message">
                                                {product.productColor}
                                            </p>
                                            <p className="TabAccount-Orders-Message">
                                                {product.productSize}
                                            </p>
                                            <p className="TabAccount-Orders-Message">
                                                ${product.unitPrice}
                                            </p>
                                        </Grid.Column>
                                    </Grid.Row>
                                ))}
                            </Grid>
                        </Grid.Row>
                    </Grid>
                ))
        }

        let changedPasswordLabel = '';

        if (this.props.userChangedPassword === true) {
            changedPasswordLabel = <Label color="green">- Password changed successfully -</Label>
        }

        if (this.props.errorChangedPassword) {
            changedPasswordLabel = <Label color="red">{this.props.errorChangedPassword}</Label>
        }


        return (
            <Aux>
                <Tabs defaultTab="vertical-tab-one" vertical>
                    <TabList>
                        <Tab tabFor="vertical-tab-one">
                            <span className="TabAccount-Menu-Message">Order in progress..</span>
                        </Tab>
                        <Tab tabFor="vertical-tab-two">
                            <span className="TabAccount-Menu-Message">Order History</span>
                        </Tab>
                        <Tab tabFor="vertical-tab-three">
                            <span className="TabAccount-Menu-Message">Personal Info</span>
                        </Tab>
                        <Tab tabFor="vertical-tab-four">
                            <span className="TabAccount-Menu-Message">Change password</span>
                        </Tab>
                        <Tab tabFor="vertical-tab-five">
                            <Icon name='power off' color='red' className="log-off-icon" onClick={this.signOff} />
                        </Tab>
                    </TabList>
                    <TabPanel tabId="vertical-tab-one">
                        <Grid>
                            {orderInprogress}
                        </Grid>
                    </TabPanel>
                    <TabPanel tabId="vertical-tab-two">
                        <Grid>
                            {orderConfirmed}
                        </Grid>
                    </TabPanel>
                    <TabPanel tabId="vertical-tab-three">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={9} mobile className="TabAccount-Grid-User">
                                    <Grid className="TabAccount-Grid-User">
                                        <Grid.Row>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User">
                                                <span className="TabAccount-Message-Colorized">
                                                    First name:
                                                </span>
                                            </Grid.Column>
                                            <Grid.Column width={5}  mobile className="TabAccount-Grid-User2">
                                                <span className="TabAccount-Message">
                                                    {this.props.user.firstName}
                                                </span>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User">
                                                <span className="TabAccount-Message-Colorized">
                                                    Last name:
                                                </span>
                                            </Grid.Column>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User2">
                                                <span className="TabAccount-Message">
                                                    {this.props.user.lastName}
                                                </span>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User">
                                                <span className="TabAccount-Message-Colorized">
                                                    Email:
                                                </span>
                                            </Grid.Column>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User2">
                                                <span className="TabAccount-Message">
                                                    {this.props.user.email}
                                                </span>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User">
                                                <span className="TabAccount-Message-Colorized">
                                                    Phone:
                                                </span>
                                            </Grid.Column>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User2">
                                                <span className="TabAccount-Message">
                                                    {this.props.user.phoneNumber}
                                                </span>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={5} mobile className="TabAccount-Grid-User">
                                                <span className="TabAccount-Message-Colorized">
                                                    Address:
                                                </span>
                                            </Grid.Column>
                                            <Grid.Column width={8} mobile className="TabAccount-Grid-User2">
                                                <span className="TabAccount-Message">
                                                    {this.props.user.address.number} {this.props.user.address.address}
                                                </span>
                                                <p className="TabAccount-Message">
                                                    {this.props.user.address.city} {this.props.user.address.postalCode} {this.props.user.address.country}
                                                </p>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <img src={graffiti} alt="edit info"
                                         className="TabAccount-EditUser-Icon"
                                         onClick={this.show}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </TabPanel>
                    <TabPanel tabId="vertical-tab-four">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={5} mobile className="TabAccount-Grid">
                                    <span className="TabAccount-Message-Colorized">
                                        Old password:
                                    </span>
                                </Grid.Column>
                                <Grid.Column width={6} className="TabAccount-Grid-User">
                                    <Form inverted>
                                        <Form.Input className="TabAccount-Grid2"
                                                    placeholder="Old password..."
                                                    size="small"
                                                    type="password"
                                                    name='oldPassword'
                                                    error={this.state.flagErrorOldPassword && this.state.errorOldPassword}
                                                    value={this.state.oldPassword}
                                                    onChange={this.handleChange}/>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={5} mobile className="TabAccount-Grid">
                                    <span className="TabAccount-Message-Colorized">
                                        New password:
                                    </span>
                                </Grid.Column>
                                <Grid.Column width={6} className="TabAccount-Grid-User">
                                    <Form inverted>
                                        <Form.Input className="TabAccount-Grid2"
                                                    placeholder="New password..."
                                                    size="small"
                                                    type="password"
                                                    name='newPassword'
                                                    error={this.state.flagErrorNewPassword && this.state.errorNewPassword}
                                                    value={this.state.newPassword}
                                                    onChange={this.handleChange}/>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={5} mobile className="TabAccount-Grid">
                                    <span className="TabAccount-Message-Colorized">
                                        Confirm password:
                                    </span>
                                </Grid.Column>
                                <Grid.Column width={6} className="TabAccount-Grid-User">
                                    <Form inverted>
                                        <Form.Input className="TabAccount-Grid2"
                                                    size="small"
                                                    placeholder="Confirm password..."
                                                    type="password"
                                                    name='confirmNewPassword'
                                                    error={this.state.flagErrorConfirmNewPassword && this.state.errorConfirmNewPassword}
                                                    value={this.state.confirmNewPassword}
                                                    onChange={this.handleChange}/>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row centered>
                                {changedPasswordLabel}
                            </Grid.Row>
                            <Grid.Row centered>
                                <button className="TabAccount-Edit-Button" onClick={this.changePassword}>
                                    <span className="TabAccount-Text-Edit-Button">Change Password</span>
                                </button>
                            </Grid.Row>
                        </Grid>
                    </TabPanel>
                </Tabs>


                <Modal open={open} onClose={this.close}
                       className="TabAccount-User-Modal" closeIcon>

                    <Dimmer active={this.props.loading} page>
                        <Loader content='Loading'/>
                    </Dimmer>
                    <Modal.Content>
                        <Grid centered>
                            <Grid.Row>
                                <Grid.Column width={5}>
                                    <span className="TabAccount-Message">
                                        Email:
                                    </span>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Form.Input inverted
                                                placeholder="Email..."
                                                name='email'
                                                value={this.state.email}
                                                onChange={this.handleChange}/>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column width={5}>
                                    <span className="TabAccount-Message">
                                        Phone:
                                    </span>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Form.Input inverted
                                                placeholder="Phone..."
                                                name='phone'
                                                value={this.state.phone}
                                                onChange={this.handleChange}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={5}>
                                    <span className="TabAccount-Message">
                                        Address:
                                    </span>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Form.Input inverted
                                                placeholder='N°'
                                                name='number'
                                                value={this.state.number}
                                                onChange={this.handleChange}/>

                                    <Form.Input inverted
                                                placeholder='Street/Avenue'
                                                name='address'
                                                value={this.state.address}
                                                onChange={this.handleChange}/>
                                    <Form.Input inverted
                                                placeholder='City'
                                                name='city'
                                                value={this.state.city}
                                                onChange={this.handleChange}/>
                                    <Form.Input inverted
                                                placeholder='Postal Code'
                                                name='postalCode'
                                                value={this.state.postalCode}
                                                onChange={this.handleChange}/>
                                    <Form.Input inverted
                                                placeholder='Country'
                                                name='country'
                                                value={this.state.country}
                                                onChange={this.handleChange}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <button className="TabAccount-Edit-Button" onClick={this.addUser}>
                            <span className="TabAccount-Text-Edit-Button">Edit Info</span>
                        </button>
                    </Modal.Actions>

                </Modal>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.users.userAuthenticated,
        ordersHistory: state.order.ordersHistory,
        loading: state.users.loading,
        errorChangedPassword: state.users.errorChangedPassword,
        userChangedPassword: state.users.userChangedPassword,
        addedUser: state.users.addedUser
    }
}

const dispatchToProps = dispatch => {
    return {
        addUser: (userToAdd) => dispatch(actions.saveUser(userToAdd)),
        changedPassword: (email, oldPassword, newPassword, confirmNewPassword) => dispatch(actions.changePassword(email, oldPassword, newPassword, confirmNewPassword)),
        signOffUser: (history) => dispatch(actions.signOffUser(history))
    }
}


export default connect(mapStateToProps, dispatchToProps)(TabAccount);