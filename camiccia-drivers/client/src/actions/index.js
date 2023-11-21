import axios from "axios"

export function getDrivers() {
    return async function(dispatch) {
        var json = await axios.get("http://localhost:3001/drivers")    //Acá se conecta el front con el back
        return dispatch({
            type: 'GET_DRIVERS',
            payload: json.data
        })
    }
}

export function firstCallDrivers() {
    return async function(dispatch) {
        var json = await axios.get("http://localhost:3001/drivers")    //Acá se conecta el front con el back
        return dispatch({
            type: 'FIRST_CALL',
            payload: json.data
        })
    }
}

export function getNameDrivers(name) {
    return async function (dispatch){
        try {
            var json = await axios.get(`http://localhost:3001/drivers?name=${name}`);
            if (!json.data) {
                alert("No se encontró el driver")
            }
            return dispatch({
                type: "GET_NAME_DRIVERS",
                payload: json.data,
            })
        }
        catch (error) {
            alert("No se encontró el driver")
            console.log(error);
        }
    }
}

export function filterDriversByDob(payload) {
    return {
        type: 'FILTER_BY_DOB',
        payload
    }
}

export function filterByName(payload) {
    return {
        type: "FILTER_BY_NAME",
        payload
    }
}

export function filterCreated(payload) {
    return {
        type: "FILTER_CREATED",
        payload
    }
}

export function paginadoGlobal(payload) {
    return {
        type: "UPDATE_CURRENT_PAGE",
        payload,
    }
}

export function getTeams() {
    return async function (dispatch) {
        let json = await axios("http://localhost:3001/teams")
        return dispatch({
            type: "GET_TEAMS",
            payload: json.data
        })
    }
}

export function postDriver(payload){
    return async function (dispatch) {
        const response = await axios.post('http://localhost:3001/drivers', payload)
        console.log(response);
        return response;
    }
}

export function selectedTeam(payload){
    return {
        type: "SELECTED_TEAM",
        payload
    }
}

export function filterRestart(payload){
    return {
        type: "RESTART_FILTER",
        payload
    }
}
