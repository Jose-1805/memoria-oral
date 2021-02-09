import types from './const';
import params from '../../config/params';

const initRegister = {
    storiesRegister:false,
    //almacena los ids de las historias que han aparecido en la pantalla
    storiesDisplayed:[],
    //almacena los anexos de cada historia del conflicto por id
    annexes:[],
}


const reducerApp = (state=initRegister, action) => {
    switch (action.type) {

        case types.REGISTER:
            return Object.assign({}, state, {
                storiesRegister:true
            });

            break;

        case types.ADD_STORIES_DISPLAYED:

            let currentStories = action.reload?[]:state.storiesDisplayed;
            for (let i = 0; i < action.data.length; i++) {
                currentStories.push(action.data[i]);
            }

            let currentAnnexes = action.reload?[]:state.annexes;

            //se agregan los anexos en currentAnnexes de acuerdo 
            //al id de la historia de conflicto en cada ciclo
            _.map(currentStories, (el, i) => {
                currentAnnexes[el.id] = _.filter(action.annexes, (objectAnnexed) => objectAnnexed.id_hc == el.id)             
            });                      
            
            return Object.assign({}, state, {
                storiesDisplayed:currentStories,
                annexes:currentAnnexes               
            });

            break;
        default:
    }

    return state;
}

export default reducerApp;