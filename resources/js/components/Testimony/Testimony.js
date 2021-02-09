import React, { PropTypes, createRef } from 'react';

import { connect } from 'react-redux';
import { actLoadTestimonies, actSaveBackup, actRestoreBackup } from '../../redux/testimony/actions';
import { actAddNotification } from '../../redux/notifications/actions';

import { Segment, Visibility, Sticky, Header, Container, Divider, Icon, Grid, Message, Button, Form, Card } from 'semantic-ui-react';
import Detail from './ContentList/Detail';
import Compact from './ContentList/Compact';
import UpdateTestimony from './UpdateTestimony';

import { SearchServer, GeneralMessage } from '../Helpers/Helpers';
import params from '../../config/params';

import config_routes from '../../config/routes';

import {animateScroll} from 'react-scroll';

const tiposTestimonio = [
	{ key: '6', text: 'Todos', value: 'Todos' },
	{ key: '0', text: 'Atentado', value: 'Atentado' },
	{ key: '1', text: 'Desaparición forzada', value: 'Desaparición forzada' },
	{ key: '2', text: 'Desplazamiento', value: 'Desplazamiento' },
	{ key: '3', text: 'Muerte', value: 'Muerte' },
	{ key: '4', text: 'Secuestros', value: 'Secuestros' },
	{ key: '5', text: 'Supervivencia', value: 'Supervivencia' },
];

const estadosTestomonio = [
	{ key: '2', text: 'Todos', value: 'Todos' },
	{ key: '0', text: 'Aprobado', value: 'Aprobado' },
	{ key: '1', text: 'Registrado', value: 'Registrado' },
	{ key: '3', text: 'Cancelado', value: 'Cancelado' }
];

const mostrarTestomonio = [
	{ key: '0', text: 'Todos', value: 'Todos' },
	{ key: '1', text: 'Mis testimonios', value: 'Mis testimonios' }
];

const tipoVistaTestomonio = [
	{ key: '0', text: 'Detalle', value: 'Detalle' },
	{ key: '1', text: 'Compacta', value: 'Compacta' }
];

class Testimony extends React.Component {
	contextRef = createRef();
	isMounted = false;
	constructor(props) {
		super(props);

		this.state = {
			texto:"",
			tipo:"Todos",
			estado:"Todos",
			municipio:"",
			fechaInicio:"",
			fechaFin:"",
			tipoVista:"Compacta",
			mostrar:"Todos",
			find:null,//para buscar testimonios individuales (vista detalle)
			findNext:null,//para consultar el testimonio que siguiente al actual
			findPrevious:null,//para consulta el testimonio que antecede al actual
			loading:false,
			responseEmpty:false,//cuando se ha consultado sin tener resultados
			updateWasOpen:false,
			activeSticky:(window.innerWidth < 768)?false:true
		}

		this.handleChangeFilter = this.handleChangeFilter.bind(this);
		this.loadTestimonies = this.loadTestimonies.bind(this);
		this.handleMore = this.handleMore.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleReturn = this.handleReturn.bind(this);
		this.handlePrevious = this.handlePrevious.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handleUpdateVisibility = this.handleUpdateVisibility.bind(this);

		window.addEventListener("resize", function(){
			if(this.isMounted){
				if(window.innerWidth < 768 && this.state.activeSticky){
					this.setState({
						activeSticky:false
					})
				}else if(window.innerWidth >= 768 && !this.state.activeSticky){
					this.setState({
						activeSticky:true
					})
				}
			}
		})
	}

	componentWillMount() {
		this.isMounted = true;
		//se cargan los testimonios al iniciar el componente
	    this.loadTestimonies(false);
	}

	componentWillUnmount() {
	    this.isMounted = false;
	}

	/**
	 * Funcion encargada de cargar testimonios
	 * 
	 * @param  {Boolean} reload          Determina si se debe eliminar el contenido actual y agregar solo
	 *                                   el resultado obtenido, o si se debe cargar lo actual y lo nuevo
	 * @param  {Boolean} noReloadOnEmpty Determina si se debe ejecutar o no el efecto 'reload' cuando no hay resultados
	 *                                   se utiliza principalmente para en la vista a detalle se pueda mostrar un mensaje toast cuando
	 *                                   no hay resultados, sin quitar el testimonio que està en pantalla
	 */
	loadTestimonies(reload = true, noReloadOnEmpty = false, callback = false){
		this.setState({loading:true});

		setTimeout(() => {
			this.props.load(this.state, reload, noReloadOnEmpty)
			.then((response) => {
				//si no se encontraron resultados
				if(!response.data.length && (noReloadOnEmpty || !reload)){
					this.setState({responseEmpty:true});

					//pasados unos segundos se establece el responseEmpty en false
					//para que se pueda seguir cargando con el scroll
					setTimeout(() => {
						this.setState({responseEmpty:false});
					},10000);

					this.props.addNotification({
						header:"Sin resultados",
						message:"No se han encontrado más resultados para mostrar.",
						showButtonClose:true,
						closeIn:4
					})
				}
				this.setState({
					loading:false
				});

				if(typeof callback == "function"){
					callback();
				}
			});
		}, 10);
		
	}

	/**
	 * Evento para manejar los cambios registrados en lso filtros
	 */
	handleChangeFilter(e, {name, value}) {
		//filtros que hacen que el scroll vaya hasta arriba cuando presentan cambios
		const namesForScrollTop = {tipo:true,municipio:true,tipoVista:true,mostrar:true};

		this.setState((oldState) => {
			return {
				[name]:value,
				find:null,
				findNext:null,
				findPrevious:null,
				responseEmpty:false
			}
		})

		//si se debe hacer scroll hasta arriba
		if(name in namesForScrollTop){
			animateScroll.scrollToTop();
		}

		this.loadTestimonies();
	}

	/**
	 * Manejador del evento de click en el botòn de ver más
	 * @param  {[type]} idTestimony identificador del testimonio
	 */
	handleMore(idTestimony){
		animateScroll.scrollToTop();
		//se cambia el modo de vista a detalle y se establece
		//el identificador del testimonio en find para que lo busque en la base de datos
		this.setState({tipoVista:"Detalle", find:idTestimony});
		//se crea un backup de los datos existentes para poder
		//cerrar la vista a detalle y tener los datos que existian antes de abrirla
		this.props.saveBackup();
		this.loadTestimonies()
	}

	/**
	 * Manejador del evento de click en el botòn de actualizar
	 * @param  {[type]} idTestimony identificador del testimonio
	 */
	handleUpdate(idTestimony){
		this.setState({tipoVista:"Actualizar"})
		//se cambia el modo de vista a Actualizar y se establece
		//el identificador del testimonio en find para que lo busque en la base de datos
		//this.setState({find:idTestimony});
		//se crea un backup de los datos existentes para poder
		//cerrar la vista a detalle y tener los datos que existian antes de abrirla
		/*this.props.saveBackup();
		this.loadTestimonies(true, false, () => {
			this.setState({tipoVista:"Actualizar"})
		});*/
	}

	/**
	 * Manejador del evento generado al intentar cerrar la vista a detalle
	 */
	handleReturn(){
		animateScroll.scrollToTop();
		if(!this.state.updateWasOpen){
			//se restablecen los datos existentes antes de abrir la vista a detalle
			this.props.restoreBackup();
		}

		//se vuelve a la vista compacta y find se asigna en null para que no se consulte nuevamente
		if(this.state.updateWasOpen){
			this.setState({tipoVista:"Compacta", updateWasOpen:false, find:null});
			this.loadTestimonies();
		}else{
			this.setState({tipoVista:"Compacta", find:null});
		}
	}

	/**
	 * Manejador del evento para ver el testimonio anterior en la vista a detalle
	 * @param  {[type]} idTestimony identificador del testimoino actual
	 * @return {[type]}             [description]
	 */
	handlePrevious(idTestimony){
		//se establece el valor del identificador del testimonio actual
		//en findPrevious para que se busque el testimonio anterior
		this.setState({findPrevious:idTestimony, findNext:null});
		this.loadTestimonies(true, true);
		animateScroll.scrollToTop();
	}

	/**
	 * Manejador del evento para ver el testimonio siguiente en la vista a detalle
	 * @param  {[type]} idTestimony identificador del testimoino actual
	 * @return {[type]}             [description]
	 */
	handleNext(idTestimony){
		//se establece el valor del identificador del testimonio actual
		//en findNext para que se busque el testimonio posterior al actual
		this.setState({findNext:idTestimony, findPrevious:null});
		this.loadTestimonies(true, true);
		animateScroll.scrollToTop();
	}

	/**
	 * Manejador para controlar cuando el scroll baja y debe 
	 * mandarse a buscar nuevos testimonios
	 * @param  {[type]} options.calculations Datos calculados para decidir que hacer
	 */
	handleUpdateVisibility(e, {calculations}){
		if(
			!this.state.loading//si no se encuentra en un proceso de carga
			&& calculations.bottomVisible//si la parte de abajo de los ultimos testimonios està visible
			&& calculations.direction == "down"
			&& this.state.tipoVista == "Compacta"
			&& !this.state.responseEmpty
		){
			//console.log("AQUI",calculations);
			this.loadTestimonies(false);
			animateScroll.scrollMore(-50);
		}
		/*console.log("*******************************")
		console.log("bottomPassed",calculations.bottomPassed);
		console.log("bottomVisible",calculations.bottomVisible);
		console.log("direction",calculations.direction);
		console.log("fits",calculations.fits);
		console.log("offScreen",calculations.offScreen);
		console.log("onScreen",calculations.onScreen);
		console.log("passing",calculations.passing);
		console.log("topPassed",calculations.topPassed);
		console.log("topVisible",calculations.topVisible);
		//this.loadTestimonies(false);
		//animateScroll.scrollMore(-50);*/
	}

	render(){
		const {
			texto,
			tipo,
			estado,
			municipio,
			fechaInicio,
			fechaFin,
			tipoVista,
			mostrar,
			loading,
			find,
			activeSticky
		} = this.state;


		let content = "";

		if(this.props.testimonies.length){
			if(tipoVista == "Compacta"){
				let items = [];

				_.map(this.props.testimonies, (el, i) => {
					items.push(<Compact key={i} testimony={el} onClickMore={this.handleMore} onClickUpdate={this.handleUpdate}/>)
				});

				content = <Card.Group itemsPerRow={2} doubling>
			    			{items}
			    		</Card.Group>
	    	}else if(tipoVista == "Detalle"){
	    		content = <Detail 
    						testimony={this.props.testimonies[0]}
    						user={this.props.user}
    						handleUpdate={(idTestimony) => {
    							animateScroll.scrollToTop();
    							this.handleUpdate(idTestimony)
    						}}
    						returnable={find?true:false}
    						showNavigation={find?false:true}
    						onReturn={this.handleReturn}
    						onPrevious={this.handlePrevious}
    						onNext={this.handleNext}
    					/>	
	    	}else if(tipoVista == "Actualizar" && this.props.testimonies.length == 1){
	    		content = <UpdateTestimony 
    						testimony={this.props.testimonies[0]}
    						onReturn={() => {
    							animateScroll.scrollToTop();
    							this.setState({tipoVista:"Detalle"})
    						}}
    						onUpdateTestimony={(dataTestimony) => {
    							this.setState({
    								updateWasOpen:true
    							});

    							this.props.addNotification({
									header:"Testimonio actualizado",
									message:"Los cambios realizados han sido registrados con éxito en el sistema.",
									showButtonClose:true,
									closeIn:10
								})
    							this.handleMore(dataTestimony.id);
    						}}
    					/>	
	    	}
		}else{
			content = <GeneralMessage
						warning
						icon
						messages={["No se encontraron resultados con los criterios de búsqueda seleccionados."]}
					/>;
		}

		let message = "";
		let inputEstado = "";
		let inputMostrar = "";

		if(this.props.userType == "Administrador"){
			message = <Message
	    			info
				    icon='microphone'
				    header='¿Desea registrar un testimonio?'
				    content={
				    	<Segment basic className="no-padding">
				    		Recuerde que para registrar un testimonio en el sistema debe tener los datos personales de la víctima completos.
					    	Haga clic en el siguiente botón y tendrá disponible el registro de testimonios
					    	<Button onClick={() => this.props.history.push(config_routes.register_testimony.path)} positive type="button" className="margin-left-10">Registrar testimonio</Button>.
					    	Los testimonios registrados por usted quedarán públicos automáticamente.
				    	</Segment>
				    }
				  />

			inputEstado = <Form.Select disabled={find?true:false} name="estado" value={estado} fluid label="Estado" options={estadosTestomonio} placeholder="Estado de los testimonios" onChange={this.handleChangeFilter}/>
		}else if(this.props.userType == "Usuario"){
			message = <Message
	    			info
				    icon='microphone'
				    header='¿Quiere contarle al mundo su testimonio?'
				    content={
				    	<Segment basic className="no-padding">
					    	Si usted ha sido víctima del comflicto armado en Colombia y desea que las personas que visitan
					    	nuestro sistema de información conozcan su historia, puede registrarla desde el siguiente botòn 
					    	y esperar que sea autorizada para ser pública en el sistema.
					    	<Button onClick={() => this.props.history.push(config_routes.register_testimony.path)} positive type="button" className="margin-left-10">Registrar testimonio</Button>
					    	Su testimonio hace parte de la memoria viva del conflicto armado, por lo tanto, mientras más perdure en el tiempo, más
					    	personas conocerán la verdadera historia.
				    	</Segment>
				    }
				  />

			inputMostrar = <Form.Select disabled={find?true:false} name="mostrar" value={mostrar} fluid label="Mostrar" options={mostrarTestomonio} placeholder="Testimonios a mostrar" onChange={this.handleChangeFilter}/>
		}
		
	    return (
	    	<Container>
	    		{message}
	    		<div ref={this.contextRef}>
		    		<Grid divided>
		    			<Grid.Column mobile={16} tablet={6} computer={5}>
		    				<Sticky context={this.contextRef} active={activeSticky}>
		    					<Segment disabled={find?true:false} inverted basic className="no-margin gradient-green-blue">
			    					<Header inverted as="h3">Filtros de búsqueda</Header>
			    					<Form inverted>
			    						<Divider horizontal inverted className="padding-top-20">
				    						<Header as='h4' inverted>
										        <Icon name='search' />
										        General
										      </Header>
				    					</Divider>

				    					<Form.Input disabled={find?true:false} type='search' value={texto} name="texto" fluid label="Texto" placeholder="Texto para buscar ..." onChange={this.handleChangeFilter}/>

				    					<Form.Select disabled={find?true:false} name="tipo" value={tipo} fluid label="Tipo" options={tiposTestimonio} placeholder="Tipo de testimonios" onChange={this.handleChangeFilter}/>

				    					{inputEstado}
				    					
				    					<Divider horizontal inverted className="padding-top-20">
				    						<Header as='h4' inverted>
										        <Icon name='map marker alternate' />
										        Ubicación
										      </Header>
				    					</Divider>

					                	<SearchServer disabled={find?true:false} noRenderFails noRenderIcon name="municipio" label="Municipio" url={params.URL_API+"query/municipios"} placeholder="Municipio del testimonio" handleResultSelect={(e, {input, result}) => { this.handleChangeFilter(e, {name:input.name, value:result.key}) }} handleSearchChange={() => { this.setState({municipio:null}) }}/>

					                	<Divider horizontal inverted className="padding-top-20">
				    						<Header as='h4' inverted>
										        <Icon name='calendar alternate outline' />
										        Fecha
									        </Header>
				    					</Divider>

					                	<Form.Input disabled={find?true:false} type='date' value={fechaInicio} name="fechaInicio" fluid label="Fecha inicio" onChange={this.handleChangeFilter}/>

					                	<Form.Input disabled={find?true:false} type='date' value={fechaFin} name="fechaFin" fluid label="Fecha fin" onChange={this.handleChangeFilter}/>

					                	<Divider horizontal inverted className="padding-top-20">
				    						<Header as='h4' inverted>
										        <Icon name='eye' />
										        Visualización
									        </Header>
				    					</Divider>

				    					<Form.Select disabled={find?true:false} name="tipoVista" value={tipoVista} fluid label="Tipo de vista" options={tipoVistaTestomonio} placeholder="Tipo de vista del testimonio" onChange={this.handleChangeFilter}/>

					                	{inputMostrar}
				                	</Form>
			                	</Segment>
		    				</Sticky>
		    			</Grid.Column>

		    			<Grid.Column mobile={16} tablet={10} computer={11}>
				    		
		    				<Visibility
				              	once={false}
				    			onUpdate={this.handleUpdateVisibility}
				    		>
		    					<Segment basic loading={loading}>
						    		{content}
					    		</Segment>
	    					</Visibility>
		    			</Grid.Column>
		    		</Grid>
	    		</div>
	        </Container>
	    );
	}
}

const mapStateToProps = (state) => {
	return {
		userType:state.app.user?state.app.user.rol:false,
		user:state.app.userAuth?state.app.user:false,
		testimonies:state.testimony.testimonies
	}
}

const mapDispatchToProps = (dispatch, state) => {
	return {
		load:(data, reload, noReloadOnEmpty) => {
			return dispatch(actLoadTestimonies(data, reload, noReloadOnEmpty));
		},
		saveBackup:() => {
			return dispatch(actSaveBackup());
		},
		restoreBackup:() => {
			return dispatch(actRestoreBackup());
		},
		addNotification:(notification) => {
			dispatch(actAddNotification(notification));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Testimony);
