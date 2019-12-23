import React, {Component} from 'react';
import {Form, Button, Icon, Grid, Label, Dropdown} from 'semantic-ui-react';
import {Badge, CSSReset, ThemeProvider} from "@chakra-ui/core";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import './ProductDetails.css';

class ProductDetails extends Component {
    state = {
        availability: true,
        size: '',
        color: '',

    };

    handleChangeSize = (e, {value}) => this.setState({value, size: value});

    handleChangeColor = (e, { value }) => this.setState({ value, color: value });

    handleAddToOrder = () => {
        console.log('Product to order');
        console.log(this.props.product.id);
        console.log(this.props.product.name);
        console.log(this.props.product.brand);
        console.log(this.props.product.price);
        console.log(this.state.size);
        console.log(this.state.color);
        const productToOrder= {
            id: this.props.product.id,
            name: this.props.product.name,
            brand: this.props.product.brand,
            price: this.props.product.price,
            size: this.state.size,
            color: this.state.color
        }

        this.props.addProductToOrder(productToOrder);
    }

    render() {
        let badge = null;

        const options = [
            {key: 'm', text: 'Male', value: 'male'},
            {key: 'f', text: 'Female', value: 'female'},
            {key: 'o', text: 'Other', value: 'other'},
        ]

        if (this.state.availability) {
            badge = (
                <div>
                    <ThemeProvider>
                        <CSSReset/>
                        <Badge rounded="full" px="2" variantColor="teal">
                            Available
                        </Badge>
                    </ThemeProvider>
                </div>
            )
        } else {
            badge = (
                <div>
                    <ThemeProvider>
                        <CSSReset/>
                        <Badge rounded="full" px="2" variantColor="red">
                            Soldout
                        </Badge>
                    </ThemeProvider>
                </div>
            )
        }

        return (
            <div>
                <div>
                    <p className="Product-Name-Div">{this.props.product.name}</p>
                </div>
                <div className="Product-Form-Div">
                    <Form unstackable widths='equal' size='large'>

                        <Form.Group inline widths='equal'>
                            <span className="Product-Props-Div">COLOR:&nbsp;&nbsp;&nbsp;</span>
                            <Dropdown
                                onChange={this.handleChangeColor}
                                fluid
                                options={options}
                                placeholder='Color'
                                selection
                                value={this.state.color}/>
                        </Form.Group>
                        <Form.Group inline widths='equal'>
                            <span className="Product-Props-Div">SIZE:&nbsp;&nbsp;&nbsp;</span>
                            <Form.Radio
                                label='Small'
                                value='S'
                                checked={this.state.value === 'S'}
                                onChange={this.handleChangeSize}
                            />
                            <Form.Radio
                                label='Medium'
                                value='M'
                                checked={this.state.value === 'M'}
                                onChange={this.handleChangeSize}
                            />
                            <Form.Radio
                                label='Large'
                                value='L'
                                checked={this.state.value === 'L'}
                                onChange={this.handleChangeSize}
                            />
                        </Form.Group>
                        <Form.Group inline widths='equal'>
                            <span className="Product-Props-Div">PRICE:&nbsp;&nbsp;&nbsp;</span>
                            <Label tag color='red'>
                                ${this.props.product.price}
                            </Label>
                        </Form.Group>
                        <Form.Group>
                            <a href="/delivery" className="Product-Delivery-Div">&nbsp;&nbsp;&nbsp;Delivery & return info</a>
                        </Form.Group>
                        <Form.Group>
                            {badge}
                        </Form.Group>
                        <Button animated='vertical' inverted color='yellow' floated='right' onClick={this.handleAddToOrder}>
                            <Button.Content hidden>Got it!</Button.Content>
                            <Button.Content visible>
                                <Icon name='shop' inverted color='yellow'/>
                            </Button.Content>
                        </Button>
                    </Form>
                </div>

                <div className="Grid-Container-Div">
                    <Grid columns={1} verticalAlign='bottom'>
                        <Grid.Row stretched>
                            <Grid.Column>
                                <p className="Product-Grid-Div">PRODUCT DETAILS:</p>
                                <p className="Product-Grid-Div">100% COTTON</p>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row stretched>
                            <Grid.Column>
                                <p className="Product-Grid-Div">MODEL DETAILS:</p>
                                <p className="Product-Grid-Div">HEIGHT 170cm/79</p>
                                <p className="Product-Grid-Div">SIZE: S</p>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

            </div>
        );
    }
}

const dispatchToProps = dispatch => {
    return {
        addProductToOrder: (productToOrder) => dispatch(actions.addProductToOrder(productToOrder))
    }
}

export default connect(null, dispatchToProps)(ProductDetails);