import React, { Component, PropTypes } from 'react';

import { Responsive, Segment, Header, Container, Message, Grid, Form, Icon, Divider, Button } from 'semantic-ui-react';
import { TableJL1805, StaticSidebar, Btn } from '../Helpers/Helpers';
import params from '../../config/params';
import axios from 'axios';

import { connect } from 'react-redux';
import { actUpdateTableJL1805, actInitTableJL1805, actUpdateOtherParamsTableJL1805 } from '../../redux/tableJL1805/actions';

import Documentation from './Documentation';

const tiposTestimonio = [
	{ key: '6', text: 'Todos', value: '' },
	{ key: '0', text: 'Atentado', value: 'Atentado' },
	{ key: '1', text: 'Desaparición forzada', value: 'Desaparición forzada' },
	{ key: '2', text: 'Desplazamiento', value: 'Desplazamiento' },
	{ key: '3', text: 'Muerte', value: 'Muerte' },
	{ key: '4', text: 'Secuestros', value: 'Secuestros' },
	{ key: '5', text: 'Supervivencia', value: 'Supervivencia' },
];

class OpenData extends Component {
    constructor(props) {
        super(props);

        let headers = [
            {name:'id',label:'Identificador', name_column:['testimonios.id']},
            {name:'titulo',label:'Título'/*,textAlign:'center',textAlignContent:'center'*/},
            {name:'tipo',label:'Tipo de testimonio'/*,textAlign:'center',textAlignContent:'center'*/},
            {name:'descripcion_corta',label:'Descripción corta'},
            {name:'descripcion_detallada',label:'Descripción detallada',width:3},
            {name:'fecha_evento',label:'Fecha del evento'},
            {name:'descripcion_lugar',label:'Descripción del lugar'},
            {name:'municipio',label:'Municipio', name_column:['municipios.nombre']},
            {name:'departamento',label:'Departamento', name_column:['departamentos.nombre']},
            {name:'audio',label:'Audio', no_server:true},
            {name:'video',label:'Video', no_server:true},
            {name:'anexos',label:'Anexos', no_server:true},
        ];

        this.state = {
        	configTable:{
        		search:false,
                rows_current:10,
                rows:[10,20,50,100],
                headers:headers,
                data_source:'server',
                data_source_url:params.URL_API+'testimony/list/1',
                data:[],
                assignValueCell:(header, row, value) => {
                	if(header.name == "municipio"){
                		return value.nombre;
                	}
                	if(header.name == "departamento"){
                		return row.municipio.departamento.nombre;
                	}
                	if(header.name == "descripcion_detallada"){
                		return <div style={{width:"500px"}} dangerouslySetInnerHTML={{__html: value}}></div>
                	}
                	if(header.name == "audio" && value){
                		return <a href={params.URL_API+'testimony/annexed/'+row.id+"/audio/"+value.id} target="_blank">{value.nombre}</a>;
                	}
                	if(header.name == "video" && value){
                		return <a href={params.URL_API+'testimony/annexed/'+row.id+"/video/"+value.id} target="_blank">{value.nombre}</a>;
                	}
                	if(header.name == "anexos" && value){
                		const items = _.map(value, (el, i) => {
                			return <li key={el.id}>
                				<Header as="h4">{el.nombre}</Header>
                				<p>{el.fecha}</p>
                				<p>{el.descripcion}</p>
	                			<a href={params.URL_API+'testimony/annexed/'+row.id+"/image/"+el.id} target="_blank">{el.nombre_archivo}</a>
                			</li>
                		})
                		//console.log(value);
                		return <ul>
                			{items}
                		</ul>
                	}
                    return value;
                },
                //assignRow:assignRow,
                //assignCell:assignCell,
                props:{
                    sortable:true,
                    selectable:true,
                    celled:true,
                    fixed:true,
                    style:{
                    	width:"auto"
                    }
                },
                otherParams:{
                	busqueda:"",
					tipo:"",
					municipio:"",
					departamento:"",
					fechaInicio:"",
					fechaFin:"",
					//excepciones:"",
					cantidad:""
                }
            },

            busqueda:"",
			tipo:"",
			municipio:"",
			departamento:"",
			fechaInicio:"",
			fechaFin:"",
			sidebarVisible:false
        }

        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.export = this.export.bind(this);
    }

    componentWillMount() {
        this.props.initTable(this.state.configTable);
    }

    /**
	 * Evento para manejar los cambios registrados en lso filtros
	 */
	handleChangeFilter(e, {name, value}) {
		this.setState((oldState) => {
			return {
				[name]:value
			}
		}, () => {
			let otherParams = {
				busqueda:this.state.busqueda,
				tipo:this.state.tipo,
				municipio:this.state.municipio,
				departamento:this.state.departamento,
				fechaInicio:this.state.fechaInicio,
				fechaFin:this.state.fechaFin
			};

			this.props.updateOtherParams(otherParams);
		})
	}

	export(){
		const paramsSend = "busqueda="+this.state.busqueda
			+"&tipo="+this.state.tipo
			+"&municipio="+this.state.municipio
			+"&departamento="+this.state.departamento
			+"&fechaInicio="+this.state.fechaInicio
			+"&fechaFin="+this.state.fechaFin

		window.location = params.URL_API+'testimony/export?'+paramsSend;
	}

    render() {
    	const { busqueda, tipo, municipio, departamento, fechaInicio, fechaFin, sidebarVisible } = this.state;
        return (
			 <Container>
			 	<StaticSidebar left visible={sidebarVisible} computer="30%" tablet="60%" mobile="90%">
			 		<Responsive onUpdate={() => this.setState({sidebarVisible:false})}/>
			 		<Btn.Close floated="right" onClick={() => this.setState({sidebarVisible:false})}/>
			 		<Documentation/>
			 	</StaticSidebar>
				<Message info>
					<Message.Header>Bienvenido al módulo de datos abiertos</Message.Header>
					<p>A través de este módulo usted podrá visualizar toda la información que es compartida de manera pública por el API. En esté módulo podrá acceder a la documentación del API, la cual le permitirá identificar cómo utilizar este servicio y acceder a la información a través de otros sistemas.</p>
				</Message>

				<Grid>
					<Grid.Column computer={4} tablet={7} mobile={16}>						
    					<Segment inverted basic className="no-margin gradient-green-blue">
	    					<Header inverted as="h3">Filtros de búsqueda</Header>
	    					<Form inverted>

		    					<Form.Input type='search' value={busqueda} name="busqueda" fluid label="Busqueda" placeholder="Texto para buscar ..." onChange={this.handleChangeFilter}/>

		    					<Form.Select name="tipo" value={tipo} fluid label="Tipo" options={tiposTestimonio} placeholder="Tipo de testimonios" onChange={this.handleChangeFilter}/>

		    					
		    					<Divider horizontal inverted className="padding-top-20">
		    						<Header as='h4' inverted>
								        <Icon name='map marker alternate' />
								        Ubicación
								      </Header>
		    					</Divider>

		    					<Form.Input type='search' value={municipio} name="municipio" fluid label="Municipio" placeholder="Municipio del testimonio" onChange={this.handleChangeFilter}/>
		    					<Form.Input type='search' value={departamento} name="departamento" fluid label="Departamento" placeholder="Departamento del testimonio" onChange={this.handleChangeFilter}/>

			                	<Divider horizontal inverted className="padding-top-20">
		    						<Header as='h4' inverted>
								        <Icon name='calendar alternate outline' />
								        Fecha
							        </Header>
		    					</Divider>

			                	<Form.Input type='date' value={fechaInicio} name="fechaInicio" fluid label="Fecha inicio" onChange={this.handleChangeFilter}/>

			                	<Form.Input type='date' value={fechaFin} name="fechaFin" fluid label="Fecha fin" onChange={this.handleChangeFilter}/>

			                	
		                	</Form>
	                	</Segment>
					</Grid.Column>
					<Grid.Column computer={12} tablet={9} mobile={16}>
						<Segment textAlign="right" basic>
							<Button primary onClick={() => {
								this.setState((oldState) => {
									return {
										sidebarVisible:!oldState.sidebarVisible
									}
								})
							}}>
								<Icon name="align justify"/>
								Documentación
							</Button>
							<Button positive onClick={this.export}>
								<Icon name="file excel"/>
								Exportar
							</Button>
							<Divider/>
						</Segment>
						<Segment basic className="no-padding" style={{marginTop:"-50px"}}>
							<TableJL1805 id="table_api" height={400}/>
						</Segment>
					</Grid.Column>
				</Grid>
			 </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        updateTable:() => {
            return dispatch(actUpdateTableJL1805("table_api"));
        },
        initTable:(config) => {
            return dispatch(actInitTableJL1805("table_api",config));
        },
        updateOtherParams:(newOtherParams) => {
        	return dispatch(actUpdateOtherParamsTableJL1805("table_api", newOtherParams));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenData);
