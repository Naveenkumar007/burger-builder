import React, { Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import * as  actions  from '../../store/actions/index';

class BurderBuilder extends Component {
	state ={
		purchasing: false,

	}
	componentDidMount () {
		this.props.onInitIngredients();
	}
	updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
		        .map(igKey => {
							return ingredients[igKey];
						})
						.reduce((sum,el) => {
							return sum + el;
						},0);
		 return sum > 0;
	}


	puchaseHandler = () => {
		this.setState({purchasing: true});
	}
	puchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}
	puchaseContinueHandler = () => {
		  this.props.onPurchaseInit();
			this.props.history.push('/checkout');
	}
	render(){
		const disabledInfo = { ...this.props.ings };
		for (let key in disabledInfo) {
			disabledInfo[key] = 	disabledInfo[key] <= 0
		}
		let orderSummary = null;
    let burger =  this.props.error ? <p>Ingredients can not be loaded! </p> : <Spinner />;
		if (this.props.ings){
			burger =  (
				<Aux>
					<Burger ingredients={this.props.ings}/>
					<BuildControls
						ingredientAdded = {this.props.onIngredientAdded}
						ingredientRemoved ={this.props.onIngredientRemoved}
						disabledInfo = {disabledInfo}
						purchasable = {this.updatePurchaseState(this.props.ings)}
						price = {this.props.tprice}
						ordered = {this.puchaseHandler}
					/>
				</Aux>
			);

			orderSummary = 	 <OrderSummary
				 ingredients={this.props.ings}
				 puchaseCancelled={this.puchaseCancelHandler}
				 puchaseContinued={this.puchaseContinueHandler}
				 price = {this.props.tprice}/>;

		}


		return(
		    <Aux>
				  <Modal show={this.state.purchasing} modalClosed={this.puchaseCancelHandler}>
					   {orderSummary}
					</Modal>
         {burger}
				</Aux>
		);
	}

}
const mapStateToProps = state => {
	return{
		ings: state.burgerBuilder.ingredients,
		tprice: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error
	};
}
const mapDispatchToProps = dispatch => {
  return{
		onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
		onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
		onPurchaseInit: () => dispatch(actions.purchaseInit())

	};
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurderBuilder , axios));
