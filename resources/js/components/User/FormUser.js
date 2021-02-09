import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actRegisterUser, actUpdateUser } from '../../redux/RegisterUser/actions';
import { actOpenFullLoader, actCloseFullLoader } from '../../redux/fullLoader/actions';
import axios from 'axios';
import params from '../../config/params';

import { Grid, Form, Checkbox, Button, Icon, Segment, Container,Select,Message, Modal, Header } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import { Btn, Valid, SearchServer, Recaptcha_ } from '../Helpers/Helpers';
import User from './DataForm/User';
import TyC from './TyC';

import {animateScroll} from 'react-scroll';

class FormUser extends Component {

    constructor(props) {
        super(props);

        this.state={
        	dataUser:null,
			loading:false,
			showModalTyC:false,
			formIsValid:false,
			recaptchaIsValid:this.props.userAuth,
			resetForm:false,
			formErrors:{}
        };

        this.handleSubmitFormRegister = this.handleSubmitFormRegister.bind(this);
    }
	
	/*==============================================
	=            Manejadores de eventos            =
	==============================================*/	

    handleSubmitFormRegister(){
    	this.setState({loading:true});	
    	this.props.openLoader("Estamos guardando la información, este proceso puede tardar varios segundos.");

    	if(this.props.action == "register"){
    		this.props.sendRegisterUser(this.state.dataUser)
	    	.then((response) => {
	    		if(response.status == 200){                  			
					this.setState({
						loading:false,
						resetForm:true,
						recaptchaIsValid:false
					})
					this.props.closeLoader();

					if("onActionSuccess" in this.props){
						this.props.onActionSuccess();
					}

    				animateScroll.scrollToTop();
	    		}else{

	                let errors = {};
	                _.map(response.data.errors, (el, i) => {
	                    errors[i] = el;
	                });
	                this.setState((oldState, props) => {
	                    return {
	                    	formErrors: Object.assign({}, oldState.formErrors, errors),
			    			loading:false,
							//formIsValid:false
	                    };
	                })  

					animateScroll.scrollToTop();
		    	}
	    	});
    	}else if(this.props.action == "update"){
    		this.props.sendUpdateUser(this.state.dataUser, this.props.userId)
	    	.then((response) => {
	    		if(response.status == 200){                  			
					this.setState({			
						loading:false,
						errors:{}
					})
					this.props.closeLoader();

					if("onActionSuccess" in this.props){
						this.props.onActionSuccess();
					}
					animateScroll.scrollToTop();
	    		}else{

	                let errors = {};
	                _.map(response.data.errors, (el, i) => {
	                    errors[i] = el;
	                });
	                this.setState((oldState, props) => {
	                    return {
	                    	formErrors: Object.assign({}, oldState.formErrors, errors),
			    			loading:false
	                    };
	                })  

		    		animateScroll.scrollToTop();
		    	}
	    	});
    		
    	}    	
    }

    render() {
    	const { loading , formIsValid, showModalTyC, formErrors, resetForm, recaptchaIsValid } = this.state;
    	const { userAuth } = this.props;

    	const  fieldRecaptcha = !userAuth && !resetForm?
		                <Recaptcha_ 
			                onChange={(value) => this.setState({recaptchaIsValid:value?true:false})}
			            />:""
    		
        return (
        	<Form className="margin-top-40">
        		<User 
        			userId={"userId" in this.props?this.props.userId:false}
        			formErrors={formErrors}
        			resetForm={resetForm}
    				onUpdate={(dataUser) => {
        					this.setState({
        						dataUser,
        						resetForm:false
        					});
        				}
        			}
    				onFormStateChange={(state) => {
    						this.setState({formIsValid:state})
        				}
        			}
				/>

				<Grid centered>
					<Segment compact>
						{fieldRecaptcha}
		            </Segment>
	            </Grid>

	        	<Grid stackable doubling columns={3}>	
	          		
					<Grid.Column width={16} textAlign="center">	
						{
							!("userId" in this.props)?
							<Modal open={showModalTyC} trigger={<Button type="button" icon="certificate" content="Ver términos y condiciones" onClick={() => this.setState({showModalTyC:true})}/>}>
								<Modal.Header className="text-center">Términos y condiciones</Modal.Header>
								<Modal.Content>
									<Modal.Description>
										<TyC/>
									</Modal.Description>
								</Modal.Content>
								<Modal.Actions>
									<Btn.Close onClick={() => this.setState({showModalTyC:false})}/>
								</Modal.Actions>
							</Modal>:""
						}
						<Btn.Save disabled={(!formIsValid || !recaptchaIsValid || loading)} onClick={this.handleSubmitFormRegister}/>		                   
		            </Grid.Column>
	            </Grid>  	            
            </Form>
        );
    }
}

const mapStateToProps = (state, props) => {
	return {
		userAuth:state.app.userAuth
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		sendRegisterUser:(data) => {
			return dispatch(actRegisterUser(data));
		},
		sendUpdateUser:(data, userId)=>{
			return dispatch(actUpdateUser(data, userId));
		},
		openLoader:(message = "Cargando.") => {
			return dispatch(actOpenFullLoader(message));
		},
		closeLoader:() => {
			return dispatch(actCloseFullLoader());
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FormUser);
