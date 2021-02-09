import types from './const';
import axios from 'axios';
import params from '../../config/params';

/**
 * Acción para registrar un usuario en el sistema
 * @param  {Oobject} data Datos necesarios para registrar un nuevo usuario en el sistema
 * @return {Object}      Respuesta del servidor
 */

const actRegisterUser = (data) => {
    return dispatch => {
        const formData = new FormData();

        formData.append("numero_identificacion", data.numero_identificacion);
        formData.append("nombres", data.nombres);
        formData.append("apellidos", data.apellidos);
        formData.append("fecha_nacimiento", data.fecha_nacimiento);
        formData.append("genero", data.genero);
        formData.append("email", data.email);
        formData.append("telefono", data.telefono);
        formData.append("nivel_estudio", data.nivel_estudio);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        formData.append("municipio_id", data.municipio_id);
        formData.append("direccion", data.direccion);
        formData.append("certificado_victima", data.certificadoVictima);
        formData.append("victima_minas", data.victima_minas);

        return axios.post(params.URL_API+'user/register',formData)
        .then((response) => {
            //console.log(response);
            return response;
        
        })
        .catch((error) => {
            return error.response;
        });
    }
}

const actUpdateUser =(data, userId)=>{

    return dispatch => {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("numero_identificacion", data.numero_identificacion);
        formData.append("nombres", data.nombres);
        formData.append("apellidos", data.apellidos);
        formData.append("fecha_nacimiento", data.fecha_nacimiento);
        formData.append("genero", data.genero);
        formData.append("email", data.email);
        formData.append("telefono", data.telefono);
        formData.append("nivel_estudio", data.nivel_estudio);
        formData.append("municipio_id", data.municipio_id);
        formData.append("direccion", data.direccion);
        formData.append("victima_minas", data.victima_minas);
        formData.append("certificado_victima", data.certificadoVictima);

        return axios.post(params.URL_API+'user/update/'+userId,formData)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
    }    
}

export {actRegisterUser, actUpdateUser};

