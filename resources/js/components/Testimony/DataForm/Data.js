import React, { Component, PropTypes } from 'react';

import params from '../../../config/params';

import { Grid, Form, Segment, Select } from 'semantic-ui-react';

import { Valid, SearchServer } from '../../Helpers/Helpers';

import SelectTemplate from './SelectTemplate';
import Annexes from './Annexes';

const optionsTypeTestimony = [
	  { key: '0', text: 'Atentado', value: 'Atentado' },
	  { key: '1', text: 'Desaparición forzada', value: 'Desaparición forzada' },
	  { key: '2', text: 'Desplazamiento', value: 'Desplazamiento' },
	  { key: '3', text: 'Muerte', value: 'Muerte' },
	  { key: '4', text: 'Secuestros', value: 'Secuestros' },
	  { key: '5', text: 'Supervivencia', value: 'Supervivencia' },
	];

class Data extends Component {
    
    constructor(props) {
        super(props);

        this.state={
        	titulo:"",
        	descripcionCorta:"",
        	fechaEvento:"",
			municipioTestimonio:null,
        	descripcionLugar:"",
        	tipoTestimonio:"",
        	nombreMunicipio:"",
			
			formValidations:{
	        	titulo:false,
	        	descripcionCorta:false,
	        	fechaEvento:false,
				municipioTestimonio:false,
	        	descripcionLugar:false,
	        	tipoTestimonio:false
			},
			formErrors:{				
	        	titulo:[],
	        	descripcionCorta:[],
	        	fechaEvento:[],
				municipioTestimonio:[],
	        	descripcionLugar:[],
	        	ubicacion:[],
	        	tipoTestimonio:[]
			},
			formIsValid:false,
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

    componentWillMount() {
    	if("initialData" in this.props && this.props.initialData){
    		const { initialData } = this.props;

    		this.setState({
	        	titulo:initialData.titulo,
	        	descripcionCorta:initialData.descripcion_corta,
	        	fechaEvento:initialData.fecha_evento,
				municipioTestimonio:initialData.municipio_id,
	        	descripcionLugar:initialData.descripcion_lugar,
	        	tipoTestimonio:initialData.tipo,
	        	nombreMunicipio:initialData.nombreMunicipio,
				
				formValidations:{
		        	titulo:true,
		        	descripcionCorta:true,
		        	fechaEvento:true,
					municipioTestimonio:true,
		        	descripcionLugar:true,
		        	tipoTestimonio:true
				},
				formIsValid:false,
	        })

	        this.handleUpdateState();
	        this.setFormIsValid();
    	}	    
    }	

    componentWillReceiveProps(nextProps) {
        if("resetForm" in nextProps && nextProps.resetForm){
        	this.setState({
	        	titulo:"",
	        	descripcionCorta:"",
	        	fechaEvento:"",
				municipioTestimonio:null,
	        	descripcionLugar:"",
	        	tipoTestimonio:"",
	        	nombreMunicipio:"",
				
				formValidations:{
		        	titulo:false,
		        	descripcionCorta:false,
		        	fechaEvento:false,
					municipioTestimonio:false,
		        	descripcionLugar:false,
		        	tipoTestimonio:false
				},
				formErrors:{				
		        	titulo:[],
		        	descripcionCorta:[],
		        	fechaEvento:[],
					municipioTestimonio:[],
		        	descripcionLugar:[],
		        	tipoTestimonio:[]
				},
				formIsValid:false,
	        })
        }

        if("formErrors" in nextProps){
	        this.setState({
	        	formErrors:nextProps.formErrors
	        })
	    }
    }

    /**
     * Dispara evento de actualización en el componente padre
     * si se envia la propiedad onUpdate
     */
    handleUpdateState(){
    	setTimeout(() => {
			if('onUpdate' in this.props){
				this.props.onUpdate(this.state);
			}
		}, 10);
    }

    handleInputChange(e, {name}){
        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
        
        this.setState({ [name]:  value});
        this.handleUpdateState();
    }    

    handleSelectChange(e, {name, value}){
        this.setState({ [name]:  value});        
	    this.onTrueValid({name});
        this.handleUpdateState();
    }

    handleFocus(e, {name}){
    	if(this.state.formErrors[name].length){
	        this.setState((oldState, props) => {
	            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
	        })
	        this.handleUpdateState();
	    }
    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/    

    /**
     * Determina si los datos del testimonio son correctos o no
     * y lanza el evento "onFormStateChange" en el padre, si se definió
     */
    setFormIsValid(){
        setTimeout(() => {
        	const lastFormIsValid = this.state.formIsValid;
            let isValid = true;

            _.map(this.state.formValidations, (value, key) => {
            	if(!value)isValid = false;
            });

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
		if(input.name == "municipioTestimonio"){
			this.setState({nombreMunicipio:result.title+" ("+result.description+")"});
		}
		this.onTrueValid(input);
        this.handleUpdateState();
	}
	
	handleSearchChange(e, {input, result}){
		this.setState({[input.name]:null})
		this.onFalseValid(input);
        this.handleUpdateState();
	}            

    render() {
    	const {
    		titulo,
			descripcionCorta,
			fechaEvento,
			municipioTestimonio,
			descripcionLugar,
			tipoTestimonio,
    		formIsValid,
    		formErrors
    	} = this.state;

    	let limiteFechaEvento = new Date();
    	limiteFechaEvento.setMonth(limiteFechaEvento.getMonth() - 1);

    	const yyyy = limiteFechaEvento.getFullYear();
    	const mm = (limiteFechaEvento.getMonth() + 1) < 10?"0"+(limiteFechaEvento.getMonth() + 1):(limiteFechaEvento.getMonth() + 1);
    	const dd = limiteFechaEvento.getDate() < 10?"0"+limiteFechaEvento.getDate():limiteFechaEvento.getDate();

    	limiteFechaEvento = yyyy+"-"+mm+"-"+dd;
		
        return (
        	<Grid>	
        		<Grid.Column mobile={16} tablet={16} computer={8} className="padding-top-2 margin-top-2">
	                <Form.Select 
	                	required 
	                	name="tipoTestimonio" 
	                	fluid 
	                	label="Tipo de testimonio" 
	                	options={optionsTypeTestimony} 
	                	placeholder="Seleccione" 
	                	value={tipoTestimonio} 
	                	onChange={(e, data) => {
	                			this.handleSelectChange(e,data);
	                		}
	                	} 
	                	errors={formErrors.genero}
	                	/>
                </Grid.Column>

        		<Grid.Column mobile={16} tablet={16} computer={8}>
          			<Valid.Input 		                    
	                    type="text" 
	                    name="titulo" 
	                    id="titulo" 
	                    value={titulo} 
	                    label='Titulo' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 
						onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 				                    			                    
	                    required
	                    min_length={6}
	                    max_length={250}
	                    errors={formErrors.titulo}
	                    help="Este titulo debe describir, en pocas palabras, el hecho ocurrido y narrado en el testimonio. Un ejemplo es: 'Una estrategia de supervivencia diferente.'"
	                />  
	            </Grid.Column>

        		<Grid.Column mobile={16} tablet={16} computer={8}>
          			<Valid.Input 		                    
	                    type="text" 
	                    name="descripcionCorta" 
	                    id="descripcionCorta" 
	                    value={descripcionCorta} 
	                    label='Descripción corta' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 
						onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 				                    			                    
	                    required
	                    min_length={50}
	                    max_length={150}
	                    errors={formErrors.titulo}
	                    help="Escriba un resumen muy corto del testimonio que desea registrar o actualizar en el sistema, se necesitan 50 caracteres como mínimo y 150 como máximo."
	                />  
	            </Grid.Column>

        		<Grid.Column mobile={16} tablet={16} computer={8}>
          			<Valid.Input 		                    
	                    type="date" 
	                    name="fechaEvento" 
	                    id="fechaEvento" 
	                    value={fechaEvento} 
	                    label='Fecha del evento' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 
						onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 				                    			                    
	                    required
	                    errors={formErrors.fechaEvento}
	                    max={limiteFechaEvento}
	                    help="Seleccione una fecha que se aproxime a la fecha en que iniciaron los hechos que se narran en el testimonio."
	                />  
	            </Grid.Column>

        		<Grid.Column mobile={16} tablet={16} computer={8}>
          			<Valid.Input 		                    
	                    type="text" 
	                    name="descripcionLugar" 
	                    id="descripcionLugar" 
	                    value={descripcionLugar} 
	                    label='Descripción del lugar' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 
						onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 				                    			                    
	                    required
	                    min_length={50}
	                    max_length={150}
	                    errors={formErrors.descripcionLugar}
	                    help="Describa brevemente como recuerda el lugar donde ocurrieron los hechos, se necesitan 50 caracteres como mínimo y 150 como máximo."
	                />  
	            </Grid.Column>

                <Grid.Column mobile={16} tablet={16} computer={8}>
                	<Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
                		<SearchServer required name="municipioTestimonio" label="Municipio" predetermined={municipioTestimonio} url={params.URL_API+"query/municipios"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange}/>
                	</Segment>           	
                </Grid.Column>
            </Grid>  	            
        );
    }
}

export default Data;