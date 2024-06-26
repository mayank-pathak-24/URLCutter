const jwt=require('jsonwebtoken')
const secret='Mayank'
function setUser(user)
{
    
    return jwt.sign({
        _id:user._id,
        email:user.email,
        
    },secret)

}

function getUser(token)
{   console.log(token);
    if(!token)return null;
    
    try {
        return jwt.verify(token,secret)
    } catch (error) {
        console.log(error);
        return null;
        
    }
}

module.exports={setUser,getUser}