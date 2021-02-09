import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Grid, Button, Menu, Segment, Header as H, Icon, Image, Dropdown, Divider, Responsive } from 'semantic-ui-react'
import ModalChangeComponent from '../Auth/ModalChangePassword/ModalChangePassword';

import routes from '../../config/routes';
import { actChangeActiveItem } from '../../redux/header/actions';

import { actLogout } from '../../redux/app/actions';

class Header extends React.Component {

	constructor(props) {
	  super(props);

	  this.state = {
	  		showMenuMobile:false
	  };

	  this.toggleMenuMobile = this.toggleMenuMobile.bind(this);
	}

	toggleMenuMobile(){
		this.setState((oldState, props) => ({showMenuMobile:!oldState.showMenuMobile}))
	}

	render(){
		const {activeItem, handleItemClick, history, logout, userAuth, user} = this.props;

		/*======================================
		=            Items del menú            =
		======================================*/
		
	    const logo = <Responsive minWidth={992} key={0}>
								<Menu.Item>
									<Image src="/images/logo_sm.png" size="small"/>
								</Menu.Item>
							</Responsive>

		const optionHome = <Menu.Item 
								key={1}
								content={routes.home.name}
								item={routes.home.item}
								path={routes.home.path}
								active={activeItem === routes.home.item} 
								onClick={handleItemClick} 
							/>

		const optionTestimony = <Menu.Item
							  key={2}
							  name={routes.testimony.name}
							  item={routes.testimony.item}
							  path={routes.testimony.path}
							  active={activeItem === routes.testimony.item}
							  onClick={handleItemClick}
							/>

		const optionStorieConflict = <Menu.Item
							  key={3}
							  content={routes.storie_conflict.name}
							  item={routes.storie_conflict.item}
							  path={routes.storie_conflict.path}
							  active={activeItem === routes.storie_conflict.item}
							  onClick={handleItemClick}
							/>

		/*const optionInvestigationRequest = <Menu.Item
							  key={4}
							  name={routes.investigation_request.name}
							  item={routes.investigation_request.item}
							  path={routes.investigation_request.path}
							  active={activeItem === routes.investigation_request.item}
							  onClick={handleItemClick}
							/>*/

	    //Si es administrador debe mostrar la opcion de usuarios
	    const optionUsers = userAuth?(
	    		user.rol == 'Administrador'?
	    		<Menu.Item
	    		  key={5}
		          name={routes.user.name}
		          item={routes.user.item}
		          path={routes.user.path}
		          active={activeItem === routes.user.item}
		          onClick={handleItemClick}
		        />
	    		:""
	    	):"";

	    //Si es administrador debe mostrar la opcion de allies
	    const optionAllies = userAuth?(
	    		user.rol == 'Administrador'?
	    		<Menu.Item
	    		  key={8}
		          name={routes.allies.name}
		          item={routes.allies.item}
		          path={routes.allies.path}
		          active={activeItem === routes.allies.item}
		          onClick={handleItemClick}
		        />
	    		:""
	    	):"";	    

		const optionOpenData = <Menu.Item
							  key={6}
							  name={routes.open_data.name}
							  item={routes.open_data.item}
							  path={routes.open_data.path}
							  active={activeItem === routes.open_data.item}
							  onClick={handleItemClick}
							/>

		const buttonShowChangePassword = <ModalChangeComponent buttonShow={<Dropdown.Item>Cambiar contraseña</Dropdown.Item>} />

		const userText = userAuth?
			<H as="h5" textAlign="right" className="no-margin">
				{user.nombres+' '+user.apellidos}
				<H.Subheader>
					{user.rol}
				</H.Subheader>
			</H>:"";
		//Muestra botón para navegar a ingreso o opciones de usuario si esta logueado
		//<Dropdown.Item>Perfil</Dropdown.Item>
		const optionAuth = userAuth?
				<Menu.Menu position="right" key={7}>
					<Dropdown item trigger={userText}>
						<Dropdown.Menu>
							{buttonShowChangePassword}
							<Divider/>
							<Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Menu>:
				<Menu.Menu position="right" key={7}>
					<Dropdown 
						text='Acceso'
						icon='users' 
					    labeled
					    button
					    className='icon primary text-lh-4rem'
					>
						<Dropdown.Menu style={{minWidth:"250px"}}>
							<Dropdown.Item
								item={routes.login.item}
								path={routes.login.path}
								content={<H as="h3" textAlign="center">{routes.login.name}</H>}
								onClick={handleItemClick}
							/>
							<Divider horizontal>
							o
							</Divider>
							<Dropdown.Item
								item={routes.registerUser.item}
								path={routes.registerUser.path}
								content={<H as="h3" textAlign="center">{routes.registerUser.name}</H>}
								onClick={handleItemClick}
							/>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Menu>

				/*<Menu.Menu position="right" key={7}>
		          <Button primary path={routes.login.path} onClick={handleItemClick}>
		          		{routes.login.name}
		          		<Icon name="chevron right"/>
		          </Button>
		        </Menu.Menu>*/
        /*=====  Fin de Items del menú  ======*/

	    const optionsMenu = [
	    	logo,
	    	optionHome,
	    	optionStorieConflict,
	    	optionTestimony,
	    	//optionInvestigationRequest,
	    	optionUsers,
	    	optionAllies,
	    	optionOpenData,
	    	optionAuth
	    ];

	    return (
	    	<Segment className="margin-bottom-30 no-padding navbar_header" style={{borderBottom:"2px solid #01579b"}}>
	    		<Grid columns={1}>
					<Grid.Column only="mobile tablet">
						<Segment textAlign = 'right'>
							<Image src="/images/logo_sm.png" size="tiny" floated="left"/>
							<Button icon="bars" primary onClick={this.toggleMenuMobile}/>
						</Segment>
						{
							this.state.showMenuMobile?
							<Grid.Column>				
								<Menu stackable vertical fluid={true} style={{paddingTop:'12px'}}>
									{optionsMenu}
								</Menu>
							</Grid.Column>:""
						}
					</Grid.Column>
				</Grid>
				
				<Grid columns={1}>
					<Grid.Column only="computer">
						<Menu secondary stackable>
							{optionsMenu}
						</Menu>
					</Grid.Column>
				</Grid>
	      </Segment>
	    )
	}
}

const mapStateToProps = (state, props) =>{
	let activeItem = null;

	//determina el item activo segun la url
	_.forIn(routes, (value, key) => {
		if(value.path == props.history.location.pathname){
			activeItem = value.item;
		}
	})

	return {
		activeItem,
		history:props.history,
		userAuth:state.app.userAuth,
		user:state.app.user
	}
}

const mapDispatchToProps = (dispatch, {history}) => {
	return {
		//manejador de click de los items del menú
		handleItemClick:(e, {path, item}) => {
			dispatch(actChangeActiveItem(item));
			history.push(path);
		},
		logout:() => (dispatch(actLogout(true)))
	}
}	

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
