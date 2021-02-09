import React, {Component} from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef();
class Recaptcha_ extends Component {
	constructor(props){
		super(props)

		this.handleChange = this.handleChange.bind(this);
	}
  
	handleChange(value){
		if("onChange" in this.props){
			this.props.onChange(value)
		}
	}  
      
	render() {
	    return (		   
		      <ReCAPTCHA
		        ref={recaptchaRef}
		        sitekey="6LeT-LsUAAAAALVii1TkymJMS34K4oTRvM9J9awt"
		        onChange={this.handleChange}
		      />	    	       
	    )
	}
}

export default Recaptcha_;
