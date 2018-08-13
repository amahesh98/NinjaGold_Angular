var express=require('express')
var app=express()
var mongoose=require('mongoose')
var path=require('path')
var session=require('express-session')({
    secret:'SpoOoOoOoOoOkyyy',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:60000},
})
app.set('trust proxy', 1)
var bodyParser=require('body-parser')

app.use(express.static(path.join(__dirname, '/public/dist/public')))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/NinjaGoldDB')
var SaveSchema = new mongoose.Schema({
    gold:{type:Number, required:[true, 'Gold is required'], default:0},
    user:{type:String, required:[true, 'User is required']}
})
mongoose.model('Save', SaveSchema)
var Save = mongoose.model('Save')

app.get('/gold', function(request, response){
    // if(!('gold' in request.session)){
    //     request.session.gold=0
    // }
    // console.log("Request gold: ", request.session.gold)
    // response.json({gold:request.session.gold})
    var startPos=request.headers.cookie.search('sessionid')
    var endPos=request.headers.cookie.indexOf(';', startPos)
    var sessionid_raw=request.headers.cookie.slice(startPos, endPos)
    var sessionid=sessionid_raw.slice(10)
    var user=sessionid

    Save.findOne({user:user}, function(error, save){
        if(error){
            response.json({gold:0})
        }
        else if(save==null){
            response.json({gold:0})
        }
        else{
            response.json({gold:save.gold})
        }
    })
})
app.post('/gold', function(request, response){
    // console.log(request.headers.cookie)

    var startPos=request.headers.cookie.search('sessionid')
    var endPos=request.headers.cookie.indexOf(';', startPos)
    console.log(`Start Pos: ${startPos}, End Pos: ${endPos}`)
    var sessionid_raw=request.headers.cookie.slice(startPos, endPos)
    var sessionid=sessionid_raw.slice(10)
    console.log('Session ID:', sessionid)
    
    var activity = request.body.activity
    if(activity == 'farming'){
        var gold=Math.floor(Math.random()*4+2)
        response.json({response:1, gold:gold})
    }
    else if(activity == 'spelunking'){
        var gold=Math.floor(Math.random()*6+5)
        response.json({response:1, gold:gold})
    }
    else if(activity == 'stealing'){
        var gold=Math.floor(Math.random()*8+7)
        response.json({response:1, gold:gold})
    }
    else if(activity == 'gambling'){
        var sign=Math.floor(Math.random()*2+1)
        var gold=Math.floor(Math.random()*101)
        if(sign==2){
            gold=0-gold
        }
        response.json({response:1, gold:gold})
    }
    else{
        response.json({response:0})
    }
})
app.post('/save', function(request, response){
    console.log("Attempting save")
    var gold=request.body.gold

    var startPos=request.headers.cookie.search('sessionid')
    var endPos=request.headers.cookie.indexOf(';', startPos)
    console.log(`Start Pos: ${startPos}, End Pos: ${endPos}`)
    var sessionid_raw=request.headers.cookie.slice(startPos, endPos)
    var sessionid=sessionid_raw.slice(10)
    var user=sessionid

    Save.findOne({user:user}, function(error, save){
        console.log("Search result: ", save)
        if(error){
            response.json({success:0, message:'Error'})
        }
        else{
            if(save!=null){
                console.log("Found user save")
                save.gold=gold
                save.save(function(error){
                    if(error){
                        response.json({success:0, message:'Failed to save'})
                    }
                    else{
                        response.json({success:1, message:"Successfully saved"})
                    }
                })
            }
            else{
                console.log("Didn't find user save")
                var newSave = new Save({gold:gold, user:user})
                newSave.save(function(error){
                    if(error){
                        console.log("There was an error")
                        response.json({success:0, message:"Failed to save"})
                    }
                    else{
                        console.log("Save successful")
                        response.json({success:1, message:"Successfully saved"})
                    }
                })
            }
        }
    })
})
app.get('/leaderboard', function(request, response){
    Save.find({}).sort('-gold').limit(5).exec(function(error, saves){
        console.log(saves)
        if(error){
            response.json({success:0})
        }
        else{
            response.json({success:1, saves:saves})
        }
    })
})

app.listen(8000, function(){console.log("Listening on port 8000")})

