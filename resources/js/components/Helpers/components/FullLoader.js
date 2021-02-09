import React, { Component } from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';

class FullLoader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	const display = this.props.visible?"":"display-none";
        return (
            <div className={"fullLoader "+display}>
            	<Dimmer active inverted>
			      	<Loader size="big">
			      		<p style={{maxWidth:"300px"}}>{this.props.message}</p>
			      	</Loader>
			    </Dimmer>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		visible:state.fullLoader.visible,
		message:state.fullLoader.message
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(FullLoader);
