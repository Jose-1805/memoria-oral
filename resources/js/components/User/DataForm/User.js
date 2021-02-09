import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actRegisterUser, actUpdateUser } from '../../../redux/RegisterUser/actions';
import axios from 'axios';
import params from '../../../config/params';

import { Grid, Form, Checkbox, Button, Icon, Segment, Container,Select,Message, Modal, Header, Input } from 'semantic-ui-react';
import GeneralMessage from '../../Helpers/components/GeneralMessage';
import { Btn, Valid, SearchServer } from '../../Helpers/Helpers';

import {animateScroll} from 'react-scroll';

const options = [
  { key: 'm', text: 'Masculino', value: 'Masculino' },
  { key: 'f', text: 'Femenino', value: 'Femenino' },
]

const options_nivel_estudios = [
  { key: 'ninguno', text: 'Ninguno', value: 'Ninguno'},           
  { key: 'primaria', text: 'Básica primaria', value: 'Básica primaria'},
  { key: 'secundaria', text: 'Básica secundaria', value: 'Básica secundaria'},
  { key: 'tecnico', text: 'Técnico profesional', value: 'Técnico profesional'},
  { key: 'tecnologia', text: 'Tecnológico', value: 'Tecnológico'}, 
  { key: 'profesional', text: 'Profesional', value: 'Profesional'}, 
  { key: 'especializacion', text: 'Especialización', value: 'Especialización'}, 
  { key: 'maestria', text: 'Maestría', value: 'Maestría'},
  { key: 'doctorado', text: 'Doctorado', value: 'Doctorado'},           
]


class User extends Component {

    constructor(props) {
        super(props);

        const stateFormValidations = ("userId" in this.props && this.props.userId)?true:false;

        this.state={
        	id:"userId" in this.props?this.props.userId:false,
        	numero_identificacion:"",
        	nombres:"",
        	apellidos:"",
        	email:"",
        	genero:"",
        	password:"",
        	password_confirmation:"",
        	telefono:"",
			nivel_estudio:"",
			fecha_nacimiento:"",
			direccion:"",
			municipio_id:"",
			certificadoVictima:"",
			consentimientoInformado:"",
			terminos_condiciones:("userId" in this.props && this.props.userId)?true:false,
			victima_minas:false,
			formValidations:{
	        	numero_identificacion:stateFormValidations,
	        	nombres:stateFormValidations,
	        	apellidos:stateFormValidations,
	        	email:stateFormValidations,
	        	genero:stateFormValidations,
	        	password:("noRenderPassword" in this.props)?true:stateFormValidations,
	        	password_confirmation:("noRenderPasswordConfirmation" in this.props)?true:stateFormValidations,
	        	telefono:true,
				nivel_estudio:stateFormValidations,
				fecha_nacimiento:stateFormValidations,
				direccion:stateFormValidations,
				municipio_id:stateFormValidations,					
				//certificadoVictima:stateFormValidations,					
				consentimientoInformado:!("renderConsentimientoInformado" in this.props)?true:stateFormValidations,					
				terminos_condiciones:("noRenderTyC" in this.props)?true:stateFormValidations					
			},
			formErrors:{
				numero_identificacion:[],
	        	nombres:[],
	        	apellidos:[],
	        	email:[],
	        	genero:[],
	        	password:[],
	        	password_confirmation:[],
	        	telefono:[],
				nivel_estudio:[],
				fecha_nacimiento:[],
				direccion:[],
				municipio_id:[],
				consentimientoInformado:[],
				certificadoVictima:[],
			},
			formIsValid:false,
			resetFiles:false
        };

        this.handleUpdateState = this.handleUpdateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.handleFocus = this.handleFocus.bind(this);        
        this.onFalseValid = this.onFalseValid.bind(this);
        this.setFormIsValid = this.setFormIsValid.bind(this);        
        this.handleSearchServerSelect = this.handleSearchServerSelect.bind(this);        
        this.handleSearchChange = this.handleSearchChange.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if("resetForm" in nextProps && nextProps.resetForm){
        	this.setState({
        		numero_identificacion:"",
	        	nombres:"",
	        	apellidos:"",
	        	email:"",
	        	genero:"",
	        	password:"",
	        	password_confirmation:"",
	        	telefono:"",
				nivel_estudio:"",
				fecha_nacimiento:"",
				direccion:"",
				municipio_id:"",
				resetFiles:true,
				formValidations:Object.assign({}, this.state.formValidations, {
					terminos_condiciones:("noRenderTyC" in this.props)?true:(("userId" in this.props && this.props.userId)?true:false)					
				}),
        	})
        }else{
        	this.setState({
				resetFiles:false
        	})
        }

        if("formErrors" in nextProps){
	        this.setState({
	        	formErrors:nextProps.formErrors
	        })
	    }
    }		

    componentDidMount() {
    	//indica que es una actualización
        if("userId" in this.props && this.props.userId){
        	this.setState({
        		loading:true
        	});

        	axios.post(params.URL_API+"user/show/"+this.props.userId)
        	.then(
        		(response) => {        			
        			this.setState({
		        		//formIsValid:true,
		        		loading:false,
		        		numero_identificacion:response.data.numero_identificacion?response.data.numero_identificacion:"",
		        		nombres:response.data.nombres?response.data.nombres:"",
		        		apellidos:response.data.apellidos?response.data.apellidos:"",
		        		fecha_nacimiento:response.data.fecha_nacimiento?response.data.fecha_nacimiento:"",
		        		genero:response.data.genero?response.data.genero:"",
		        		email:response.data.email?response.data.email:"",
		        		telefono:response.data.telefono?response.data.telefono:"",
		        		nivel_estudio:response.data.nivel_estudio?response.data.nivel_estudio:"",
		        		municipio_id:response.data.municipio_id?response.data.municipio_id:"",
		        		direccion:response.data.direccion?response.data.direccion:"",
		        		victima_minas:response.data.victima_minas?true:false
		        	}, () => this.handleUpdateState(), this.setFormIsValid());

        		}, 
        		(error) => {        			
        			//console.log(error);
        			this.setState({
		        		loading:false
		        	});
        		}
    		)
        }
    }

    handleUpdateState(){
    	setTimeout(() => {
			if('onUpdate' in this.props){
				const {
					id,
					numero_identificacion,
					nombres,
					apellidos,
					fecha_nacimiento,
					genero,
					email,
					telefono,
					nivel_estudio,
					password,
					password_confirmation,
					municipio_id,
					direccion,
					certificadoVictima,
					consentimientoInformado,
					victima_minas,
					formErrors
				} = this.state;

				this.props.onUpdate({
					id,
					numero_identificacion,
					nombres,
					apellidos,
					fecha_nacimiento,
					genero,
					email,
					telefono,
					nivel_estudio,
					password,
					password_confirmation,
					municipio_id,
					direccion,
					certificadoVictima,
					consentimientoInformado,
					victima_minas,
					formErrors
				});
			}
		}, 10);
    }

    handleInputChange(e, props_){
    	if(e.target.type == "file"){
    		this.setState({
    			[props_.name]:e.target.files[0]
    		})

    		if(e.target.files[0]){
    			this.onTrueValid({name:props_.name})
    		}else{
    			this.onFalseValid({name:props_.name})
    		}

    		this.handleUpdateState();
    		return
    	}

        let value = (props_.type == 'checkbox')?(props_.checked?true:false):props_.value;
        this.setState({ [props_.name]:  value});

        //acepta terminos y condiciones
        if(props_.type == 'checkbox'){
        	if(value)
        		this.onTrueValid({name:props_.name});
    		else
    			this.onFalseValid({name:props_.name});
        }
        
        this.handleUpdateState();
    }

    handleSelectChange(e, {name, value}){
        this.setState({ [name]:  value});
        this.onTrueValid({name});
        this.handleUpdateState();
    }

    handleFocus(e, {name}){
        this.setState((oldState, props) => {
            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
        })
        this.handleUpdateState();
    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/    

    setFormIsValid(){
    	//console.log(this.state.formValidations);
        setTimeout(() => {
        	const lastFormIsValid = this.state.formIsValid;
        	//console.log("lastFormIsValid", lastFormIsValid);
        	const exceptions = ["victima_minas"];
            let isValid = true;
            _.map(this.state.formValidations, (value, key) => {
            	if(exceptions.indexOf(key) < 0)
                	if(!value)isValid = false;
            });
            //console.log("isValid", isValid);
            this.setState({
                formIsValid:isValid
            })

            if("onFormStateChange" in this.props && lastFormIsValid != isValid){
            	this.props.onFormStateChange(isValid);
            }
        }, 10)
    }


    onTrueValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:true})
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:false})
            }
        });

        this.setFormIsValid();
    }   

	/*=====  Fin de Estado de validaciòn de formulario  ======*/

	handleSearchServerSelect(e, {input, result}){
		this.setState({[input.name]:result.key})
		this.onTrueValid(input);
	}
	

	handleSearchChange(e, {input, result}){
		this.setState({[input.name]:null})
		this.onFalseValid(input);
	}

    render() {
    	const {numero_identificacion, nombres, apellidos, email,genero,password,password_confirmation,telefono,nivel_estudio,fecha_nacimiento,direccion,municipio_id,terminos_condiciones,loading, formIsValid, formErrors, success, resetFiles, victima_minas } = this.state;
    	
    	let limiteFechaNacimiento = new Date();
    	limiteFechaNacimiento.setFullYear(limiteFechaNacimiento.getFullYear() - 18);

    	const yyyy = limiteFechaNacimiento.getFullYear();
    	const mm = (limiteFechaNacimiento.getMonth() + 1) < 10?"0"+(limiteFechaNacimiento.getMonth() + 1):(limiteFechaNacimiento.getMonth() + 1);
    	const dd = limiteFechaNacimiento.getDate() < 10?"0"+limiteFechaNacimiento.getDate():limiteFechaNacimiento.getDate();

    	limiteFechaNacimiento = yyyy+"-"+mm+"-"+dd;

    	let fieldPassword = <Valid.Input	      		                    
	                    id="password" 
	                    name="password" 
	                    value={password} 
	                    label="Contraseña" 
	                    type="password" 
	                    onChange={this.handleInputChange} 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid}
	                    onFocus={this.handleFocus}
	                    required
	                    min_length={8} 
	                    max_length={60}  
	                    errors={formErrors.password}
	                    wrapperColumn
	                />;

	    let fieldpassword_confirmation = <Valid.Input	      		                    
	                    id="password_confirmation" 
	                    name="password_confirmation" 
	                    value={password_confirmation} 
	                    label="Confirme su contraseña" 
	                    type="password" 
	                    onChange={this.handleInputChange} 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid}
	                    onFocus={this.handleFocus}
	                    required
	                    min_length={8} 
	                    max_length={60}  
	                    errors={formErrors.password_confirmation}
	                    wrapperColumn
	                />;

	    let fielterminos_condiciones = ("resetForm" in this.props && this.props.resetForm)?"":<Grid.Column width={16}>			               					   
						  					<Form.Checkbox name="terminos_condiciones" inline label='Estoy de acuerdo con los Términos y Condiciones. Vea términos y condiciones con el botón [ Ver términos y condiciones ]' required onChange={this.handleInputChange}/>
		            					</Grid.Column>;

	    let fieldVictimaMinas = resetFiles?"":<Grid.Column computer={16}>
						  					<Form.Checkbox name="victima_minas" inline label='¿Ha sido víctima de minas antipersona?' onChange={this.handleInputChange} checked={victima_minas}/>
		            					</Grid.Column>;
	                
	    let fieldCertificadoVictima = <Grid.Column className="field required padding-top-none margin-top-none">
	    									<Valid.File
	    										maxSize={1}
	    										label="Certificado de víctima del conflicto armado"
	    										name="certificadoVictima"
	    										onChange={this.handleInputChange} 
	    										accept=".jpg,.jpeg,.png,.pdf"
	    										onFocus={this.handleFocus} 
	    										errors={formErrors.certificadoVictima}
	    										reset={resetFiles}
	    									 />
		            					</Grid.Column>;
	                
	    let fieldConsentimientoInformado = <Grid.Column className="field required padding-top-none margin-top-none">
	    									<Valid.File
	    										maxSize={1}
	    										label="Consentimiento informado"
	    										name="consentimientoInformado"
	    										onChange={this.handleInputChange} 
	    										onFocus={this.handleFocus} 
	    										accept=".jpg,.jpeg,.png,.pdf"
	    										required
	    										errors={formErrors.consentimientoInformado}
	    										reset={resetFiles}
	    									 />
		            					</Grid.Column>;

	    if("userId" in this.props && this.props.userId){
	    	fieldPassword = "";
	    	fieldpassword_confirmation="";
	    	fielterminos_condiciones="";
	    	//fieldVictimaMinas = "";
	    	//fieldCertificadoVictima = "";
	    }

	    if(!("renderConsentimientoInformado" in this.props)) fieldConsentimientoInformado = "";
	    if("noRenderPassword" in this.props)fieldPassword = "";
	    if("noRenderPasswordConfirmation" in this.props)fieldpassword_confirmation = "";
	    if("noRenderTyC" in this.props)fielterminos_condiciones = "";
	    if("noRenderVictimaMinas" in this.props)fieldVictimaMinas = "";
    	
        return (
        	<Grid stackable doubling columns={3}>	
          		<Valid.Input 		                    
	                    type="text" 
	                    name="numero_identificacion" 
	                    id="numero_identificacion" 
	                    value={numero_identificacion} 
	                    label='Número de identificación' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 
						onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 				                    			                    
	                    required
	                    numeric
	                    min_length={6}
	                    max_length={10}
	                    wrapperColumn
	                    errors={formErrors.numero_identificacion}
	                />

          		<Valid.Input 
	                    type="text" 
	                    name="nombres" 
	                    id="nombres" 
	                    value={nombres} 
	                    label='Nombres'
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 			                     
	                    onChange={this.handleInputChange} 
	                    onFocus={this.handleFocus}
	                    required
	                    min_length={3}
	                	max_length={60}			                
	                    wrapperColumn
	                    errors={formErrors.nombres}
	                    alphabeticalSpace
	                />   
                
          		<Valid.Input 
	                    type="text" 
	                    name="apellidos" 
	                    id="apellidos" 
	                    value={apellidos} 
	                    label='Apellidos' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 			                    
	                    onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 
	                    required
	                    min_length={3}
	                	max_length={60}			                
	                    wrapperColumn
	                    errors={formErrors.apellidos}
	                    alphabeticalSpace
	                />

                <Valid.Input  
                    type="Date" 
                    name="fecha_nacimiento" 
                    id="fecha_nacimiento" 
                    value={fecha_nacimiento} 
                    label='Fecha de nacimiento'
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid}		                    
                    onChange={this.handleInputChange} 
                    onFocus={this.handleFocus}
                    required
                    wrapperColumn
                    errors={formErrors.fecha_nacimiento}
                    max={limiteFechaNacimiento}
                /> 			                

	        	<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="genero" fluid label="Genero" options={options} placeholder="Seleccione" value={genero} onChange={this.handleSelectChange} errors={formErrors.genero}/>
        		 	</Segment>
	        	</Grid.Column>	

                  <Valid.Input	
                    id="email"
                    name="email"
                    value={email}
                    label='Correo electrónico'		                   
                    type="text" 		                     		                     		                     		                     
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid} 		                    
                    onChange={this.handleInputChange} 
                    onFocus={this.handleFocus}
                    required
                    email
                    wrapperColumn
                    max_length={100}
                    min_length={7}
                    errors={formErrors.email}
                />	

                <Valid.Input 
                    type="text" 
                    name="telefono" 
                    id="telefono" 
                    value={telefono} 
                    label='Número de celular'
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid} 			                	                    
                    onChange={this.handleInputChange}
                    onFocus={this.handleFocus}		                     
                    numeric
	                min_length={10}
	                max_length={15}	 
                    wrapperColumn
                    errors={formErrors.telefono}
                /> 	
                		                
    			<Grid.Column>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="nivel_estudio" fluid label="Nivel de estudios" options={options_nivel_estudios} placeholder="Seleccione" value={nivel_estudio} onChange={this.handleSelectChange} errors={formErrors.nivel_estudio}/>
        		 	</Segment>
	        	</Grid.Column>	         

                <Grid.Column>
                	<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
                		<SearchServer required name="municipio_id" label="Municipio" predetermined={municipio_id} url={params.URL_API+"query/municipios"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange}/>
                	</Segment>	                	
                </Grid.Column>

                <Valid.Input  
                    type="text" 
                    name="direccion" 
                    id="direccion" 
                    value={direccion} 
                    label='Dirección' 
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid}		                    
                    onChange={this.handleInputChange}
                    onFocus={this.handleFocus} 
                    required
                    min_length={3} 
                    max_length={60}  
                    errors={formErrors.direccion}		                    
                    wrapperColumn
                /> 			                	                		                	                                

                {fieldCertificadoVictima}
                {fieldConsentimientoInformado}

                {fieldPassword}
                {fieldpassword_confirmation}
                {fieldVictimaMinas}
                {fielterminos_condiciones}
            </Grid>  	            
        );
    }
}

export default User;
