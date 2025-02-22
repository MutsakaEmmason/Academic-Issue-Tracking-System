import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api/'
const LOGIN_URL = '${BASE_URL}token'
 export const StudentLogin = async (StudentRegNumber,Password) => {
    const response = await axios.post(LOGIN_URL,
    {StudentRegNumber:StudentRegNumber, Password:Password},
    {withCredential:true}
    )
    return response.data.success
}