import types from './const';
import axios from 'axios';
import params from '../../config/params';
import store from '../store';

/**
 * Acción para registrar una historia en el sistema
 * @param  {Oobject} data Datos necesarios para registrar una nueva historia en el sistema
 * @return {Object}      Respuesta del servidor
 */

const actRegisterStories = (data) => {
    return dispatch => {
        const formData = new FormData();

        formData.append("titulo",data.titulo);
        formData.append("texto",data.texto);
        if(data.municipio_id)
            formData.append("municipio_id",data.municipio_id);
        if(data.departamento_id)
            formData.append("departamento_id",data.departamento_id);
        let indice = 1;
        _.map(data.annexesValues, (el, i) => {
            formData.append("file_"+indice,el);
            indice++;
        })

        return axios.post(params.URL_API+'storie_conflict/register',formData,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        )
        .then((response) => {            
            return response;
        
        })
        .catch((error) => {
            return error.response;
        });
    }
}

const actUpdateStories =(data, StorieConflictId)=>{
    return dispatch => {
        const formData = new FormData();

        formData.append("titulo",data.titulo);
        formData.append("texto",data.texto);
        formData.append("municipio_id",data.municipio_id);
        formData.append("departamento_id",data.departamento_id);
        formData.append("annexes_remove",data.annexesRemove);
        let indice = 1;
        _.map(data.annexesValues, (el, i) => {
            formData.append("file_"+indice,el);
            indice++;
        })

        return axios.post(params.URL_API+'storie_conflict/update/'+StorieConflictId,formData,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })        
        .then((response) => {
            //console.log(response);
            return response;
        })
        .catch((error) => {
            return error.response;
        });
    }     
}

const actList = (data, reload = false) => {
    return dispatch => {
        let currentStories = store.getState().StorieConflict.storiesDisplayed;
        let currentStoriesId = [];

        //si no se está haciendo reload se traen las historias
        //diferentes a las que están en pantalla 
        if(!reload){
            for (let i = 0; i < currentStories.length; i++) {
                currentStoriesId.push(currentStories[i].id);
            }        
        }

        return axios.post(params.URL_API+'storie_conflict/list',{
            type:data.tipoBusqueda,
            municipio:data.municipio_id,
            departamento:data.departamento,
            buscar:data.buscar,
            currentStoriesId,
        })
        .then((response) => {
            dispatch(actAddStorieConflictDisplayed(response.data.historiasConflicto, response.data.annexes, reload));
            
            return response;
        
        })
        .catch((error) => {
            return error.response;
        });
    }
}

const actAddStorieConflictDisplayed= (data, annexes, reload) =>({
    type:types.ADD_STORIES_DISPLAYED,
    data,
    annexes,
    reload
})

export {actRegisterStories, actUpdateStories, actList, actAddStorieConflictDisplayed};