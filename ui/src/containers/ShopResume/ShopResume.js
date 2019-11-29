import React, {Component} from "react";
import {Button, Header, Icon, Image, Label, Modal} from "semantic-ui-react";
import ShoppingCart from '../../components/ShoppingCart/ShoppingCart';
import './ShopResume.css';
import panierPic from './image80s.jpeg';

class ShopResume extends Component {

    state = {
        products: [
            {
                id: 1, name: 'Classic retro - 90s', brand: 'Nike', logo: '', images: [
                    {id: 1, name: 'Unknown1', url: 'Unknown1.png'},
                    {id: 2, name: 'Unknown2', url: 'Unknown2.png'},
                    {id: 3, name: 'Unknown3', url: 'Unknown3.png'}
                ]
            },
            {
                id: 2, name: 'Classic retro - ', brand: 'Nike', logo: '', images: [
                    {id: 1, name: 'Unknown1', url: 'Unknown1.png'},
                    {id: 2, name: 'Unknown2', url: 'Unknown2.png'},
                    {id: 3, name: 'Unknown3', url: 'Unknown3.png'}
                ]
            },
            {
                id: 3, name: 'Classic retro - ', brand: 'Nike', logo: '', images: [
                    {id: 1, name: 'Unknown1', url: 'Unknown1.png'},
                    {id: 2, name: 'Unknown2', url: 'Unknown2.png'},
                    {id: 3, name: 'Unknown3', url: 'Unknown3.png'}
                ]
            },
            {
                id: 4, name: 'Classic retro - ', brand: 'Nike', logo: '', images: [
                    {id: 1, name: 'Unknown1', url: 'Unknown1.png'},
                    {id: 2, name: 'Unknown2', url: 'Unknown2.png'},
                    {id: 3, name: 'Unknown3', url: 'Unknown3.png'}
                ]
            },
            {
                id: 5, name: 'Classic retro - ', brand: 'Nike', logo: '', images: [
                    {id: 1, name: 'Unknown1', url: 'Unknown1.png'},
                    {id: 2, name: 'Unknown2', url: 'Unknown2.png'},
                    {id: 3, name: 'Unknown3', url: 'Unknown3.png'}
                ]
            },
            {
                id: 6, name: 'Classic retro - ', brand: 'Nike', logo: '', images: [
                    {id: 1, name: 'Unknown1', url: 'Unknown1.png'},
                    {id: 2, name: 'Unknown2', url: 'Unknown2.png'},
                    {id: 3, name: 'Unknown3', url: 'Unknown3.png'}
                ]
            },

        ],
        open: false }

    show = (size) => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    componentDidMount() {
        console.log('Shop Resume' + this.props);
    }

    redirectToOrders = () => {
        this.props.history.push('/orders');
    }

    render() {
        const { open, size } = this.state

        return (
            <div>
                <div>
                    <ShoppingCart size={this.props.size} show={this.show('small')}/>
                </div>

                <div className="Modal-Content-div">
                <Modal size={size} open={open} onClose={this.close} style={{ position: 'static', height:'auto' }} >
                    <Modal.Header><Image src={panierPic} fluid style={{ height: '220px' }}/></Modal.Header>
{/*
                    <span className="Panier-Resume-Text"> You GOT : </span>
*/}

                    {this.state.products.map(product => (
                    <Modal.Content image key={product.id}>
                        <Image wrapped size='small'
                               src={product.images[0].url}/>
                        <Modal.Description>
                            <Header><span className="Panier-Items-Text-Header">{product.name}</span></Header>
                            <p className="Panier-Items-Text">Black </p>
                            <p className="Panier-Items-Text">Small</p>
                            <p className="Panier-Items-Text">$90</p>
                        </Modal.Description>
                    </Modal.Content>
                    ))}

                    <Modal.Actions>
                        <Button color='black' onClick={this.redirectToOrders}>
                            <span className="Pay-Text">CHECKOUT</span><Icon name='right chevron' color='yellow'/>
                        </Button>
                    </Modal.Actions>
                </Modal>
                </div>
            </div>
        );
    }

}

export default ShopResume;