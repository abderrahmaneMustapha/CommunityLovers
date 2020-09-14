import React ,{ useEffect,useState } from "react"
import {useMutation } from 'react-apollo';
import { CHECK_AUTH_TOKEN} from '../../../api/login/index'
import {Link, Redirect} from "react-router-dom"

function  Dashboard (){

    const token = localStorage.getItem('jwt')


    const [is_auth, setAuth] = useState(false)
    const [checkAuthToken, { data,error,loading }  ] = useMutation(CHECK_AUTH_TOKEN) 

    
    useEffect(() => {
       
        if (token){
            checkAuthToken({variables : {
                token : token
            }})
         }
        
    }, [token,checkAuthToken]);


    if(data){ setAuth(data.verifyToken.success)}

    if (error) console.log(error)

    if (loading) return <div>{loading}</div>
  

    if (is_auth===false){
        
        return <Redirect 
        to={{pathname:"/signin",
        state:{message: "you are not logged in  try to login again"}}}
        />        
    }



        return(
            <>
                <Link to="/create-group"></Link>
                <div>{this.props.location.state.message}</div>
            </>
        )
    
}

export default Dashboard