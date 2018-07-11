import React,{ Component} from 'react';
import Aux from '../Aux/Aux';
import Model from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent,axios) => {
  return class extends Component {
        state = {
          error: null
        }
        componentWillMount(){
          this.reqInterceptor = axios.interceptors.request.use(req => {
            this.setState({error: null });
            return req;
          });
           this.resInterceptor = axios.interceptors.response.use(resp => resp,error => {
             this.setState({error: error });
           });
        }
        componentWillUnmount(){
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.request.eject(this.resInterceptor);
        }
        errorConfirmedHandler = () =>{
          this.setState({error: null });
        }
        render() {
          return(
            <Aux>
              <Model
              show={this.state.error}
              modalClosed={this.errorConfirmedHandler}>
                {this.state.error ? this.state.error.message : null}
              </Model>
              <WrappedComponent { ...this.props } />
            </Aux>
          );
        }
    }
}
export default withErrorHandler;
