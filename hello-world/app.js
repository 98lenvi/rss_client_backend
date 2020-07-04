const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lenvin:***@cluster0-8hz1a.mongodb.net/user_info?retryWrites=true&w=majority', {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    const userSchema = new mongoose.Schema({
        email: String,
        data: Array
      });
    const User = mongoose.model('User', userSchema);

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "content-type": "application/json",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
}

exports.lambdaHandler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
    return  {
        statusCode: 200,
        headers: headers,
    }
}

    if (event.httpMethod === 'GET') {
        try {
            const email = event.queryStringParameters.email
            const FoundUser = await User.findOne({email:email});
            return {
                statusCode: 200,
                body: JSON.stringify(FoundUser.data),
                headers: headers,
            }
        } catch (err) {
            console.log(err)
            return {
                statusCode: 500,
                body: JSON.stringify(err),
                headers: headers,
            }
        }
    }

    if (event.httpMethod === 'PUT') {
        try {
            const parsedBody = JSON.parse(event.body)
            const data = parsedBody.data
            const email = event.queryStringParameters.email
            await User.update({email:email},{email:email, data:data},{upsert:true});
            const FoundUser = await User.findOne({email: email});
            return {
                statusCode: 200,
                body: JSON.stringify(FoundUser.data),
                headers: headers,
            }
        } catch (err) {
            console.log(err)
            return {
                statusCode: 500,
                body: JSON.stringify(err),
                headers: headers,
            }
        }
    }

    return  {
        statusCode: 200,
        headers: headers,
    }
};
