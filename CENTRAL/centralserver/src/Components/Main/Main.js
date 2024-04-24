const { default: Home } = require("../Home/Home");
const { default: Login } = require("../Login/login");


function parsejwt(token){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c){
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const tokenExpirationTime = parsejwt(localStorage.getItem('token')).exp * 1000;
const currentTime = Date.now();
const tokenIsStillValid = tokenExpirationTime > currentTime;





const Main=()=>{
    return(
        <>{tokenIsStillValid ? <Home/>: <Login/>} /</>
    );

}

export default Main;