import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Card, Header, Icon, Grid, Segment, Label } from 'semantic-ui-react';
import { Btn, Comments } from '../../Helpers/Helpers';
import params from '../../../config/params';

class Compact extends Component {
	isMounted = false;

    constructor(props) {
        super(props);

        this.handleMore = this.handleMore.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentWillMount() {
        this.isMounted = true;
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    handleMore(idTestimony){
    	if('onClickMore' in this.props && this.isMounted){
    		this.props.onClickMore(idTestimony);
    	}
    }

    handleUpdate(idTestimony){
    	if('onClickUpdate' in this.props && this.isMounted){
    		this.props.onClickUpdate(idTestimony);
    	}
    }

    render() {
    	const { testimony } = this.props;

    	let color = "";

    	let label = "";

    	let btnOption = <Btn.More floated="right" onClick={() => this.handleMore(testimony.id)}/>

    	if(this.props.user && (this.props.user.rol == "Administrador" || this.props.user.id == testimony.usuario_id)){
	    	
	    	if(testimony.estado == "Registrado"){
				label = <Label as='a' color='blue' corner>
		        	<Icon name="wait"/>
		        </Label>

		        color = "blue";
		    }

	    	if(testimony.estado == "Aprobado"){
				label = <Label as='a' color='green' corner>
		        	<Icon name="check circle"/>
		        </Label>

		        color = "green";
		    }


	    	if(testimony.estado == "Cancelado"){
				label = <Label as='a' color='grey' corner>
		        	<Icon name="times circle"/>
		        </Label>

		        color = "grey";
		    }

		    /*if(
		    	this.props.user.rol == "Administrador"
		    	|| (
		    		this.props.user.rol == "Usuario"
			    	&& testimony.estado == "Registrado"
		    	)
	    	)
		    	btnOption = <Btn.Update floated="right" onClick={() => this.handleUpdate(testimony.id)}/>*/
	    }
        return (
	            <Card>	
					<Card.Content>
						{label}
		            	
						<Card.Header>{testimony.titulo}</Card.Header>
						<Card.Meta>
							<span className='date'>{testimony.fecha_evento}</span>
						</Card.Meta>
						<Card.Meta>
							<span className='date'>{testimony.nombreMunicipio}</span>
						</Card.Meta>
						<Card.Meta>
							<span className='date'>{testimony.tipo}</span>
						</Card.Meta>
						<Card.Description>
							{testimony.descripcion_corta}
						</Card.Description>				
					</Card.Content>
					
					<Card.Content extra>
						<Label>
							<Icon name='comments' />
							<Comments
								onlyCount
		                        href={params.URL+"/testimony/"+testimony.id}
		                    />
						</Label>
						{btnOption}
					</Card.Content>
					<Segment className={"no-padding "+color}>
					</Segment>
				</Card>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		user:state.app.userAuth?state.app.user:false
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Compact);
