import React,{Component} from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as  actions  from '../../../store/actions/index';

class ContactData extends Component{
   state = {
     orderForm: {
       name: {
         elementType: 'input',
         elementConfig: {
           type:'text',
           placeholder: 'Your Name'
         },
         value: '',
         validation: {
           required: true,
           minLength: 3
         },
         valid: false,
         istouched: false
       },
       street: {
         elementType: 'input',
         elementConfig: {
           type:'text',
           placeholder: 'Street'
         },
         value: '',
         validation: {
           required: true
         },
         valid: false,
         istouched: false
       },
       zipCode: {
         elementType: 'input',
         elementConfig: {
           type:'text',
           placeholder: 'ZIP Code'
         },
         value: '',
         validation: {
           required: true,
           minLength: 6,
           maxLength: 6
         },
         valid: false,
         istouched: false

       },
       country: {
         elementType: 'input',
         elementConfig: {
           type:'text',
           placeholder: 'Country'
         },
         value: '',
         validation: {
           required: true
         },
         valid: false,
         istouched: false

       },
       email:{
         elementType: 'input',
         elementConfig: {
           type:'email',
           placeholder: 'Your E-mail'
         },
         value: '',
         validation: {
           required: true
         },
         valid: false,
         istouched: false

       },
       deliverMethod: {
         elementType: 'select',
         elementConfig: {
           options:[
             {value: 'fastest',displayValue: 'Fastest'},
             {value: 'cheapest',displayValue: 'Cheapest'}
           ]
         },
         value: 'fastest',
         valid: true
       }
     },
     isFormValid: false,
   }
   orderHandler = (event) =>{
     event.preventDefault();
     const formData = {};
     for(let formElementIdentifier in this.state.orderForm){
       formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
     }
     const order = {
     	ingredients: this.props.ings,
     	price: this.props.price,
      orderData: formData
     }
     this.props.onOrderInit(order);
   }
   checkValidity(value, rules) {
     let isValid = true;

     if(rules && rules.required){
         isValid = value.trim() !== '' && isValid;
     }

     if (rules && rules.minLength){
       isValid = value.length >= rules.minLength && isValid;
     }

     if (rules && rules.maxLength){
       isValid = value.length <= rules.maxLength && isValid;
     }

     return isValid
   }
   inputChangeHandler = (event,inputIdentifier) => {
       console.log(event.target.value);
       const updatedOrderForm = {
         ...this.state.orderForm
        };
       const updateFormElement = {
         ...updatedOrderForm[inputIdentifier]
        };
        updateFormElement.value = event.target.value;
        updateFormElement.istouched =  true;
        updateFormElement.valid = this.checkValidity(updateFormElement.value,updateFormElement.validation)
        updatedOrderForm[inputIdentifier] = updateFormElement;

        let isFormValid = true;
        for(let inputIdentifier in updatedOrderForm){
          isFormValid = updatedOrderForm[inputIdentifier].valid && isFormValid
        }
        console.log(isFormValid);
        this.setState({orderForm: updatedOrderForm,isFormValid: isFormValid});
   }

   render(){
     const formElementsArray = [];
     for (let key in this.state.orderForm){
       formElementsArray.push({
         id: key,
         config: this.state.orderForm[key]
       });
     }
     console.log(this.state.isFormValid);
     let form = (
       <form onSubmit={this.orderHandler}>
         {formElementsArray.map(formElement => (
            <Input key={formElement.id} valueType={formElement.id} invalid={!formElement.config.valid} touched={formElement.config.istouched} shouldValidate={formElement.config.validation} elementType={formElement.config.elementType} elementConfig={formElement.config.elementConfig} value={formElement.config.value} changed={(event) => this.inputChangeHandler(event,formElement.id)}/>
         ))}
         <Button btnType="Success" disabled={!this.state.isFormValid}> Order </Button>
       </form>);
      if (this.props.loading){
        form = <Spinner />;
      }
     return(
       <div className={classes.ContactData}>
        <h4> Enter Your Contact Data! </h4>
        {form}
      </div>
     );
   }
}
const mapStateToProps = state => {
 return {
   ings: state.burgerBuilder.ingredients,
   price: state.burgerBuilder.totalPrice,
   loading: state.order.loading
 } ;
}
const mapDispatchToProps = dispatch => {
  return {
    onOrderInit: (orderData) => dispatch(actions.purchaseBurger(orderData))
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));
