const express = require('express')
const os = require('os')
const path = require('path')

const IP = os.networkInterfaces()['Беспроводная сеть'][1]['address']
const PORT = process.env.PORT || 5000
const app = express()


app.set('public', path.join(__dirname,'public'))


app.use( (req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.render = (fileName) => {
        return res.sendFile(path.join(app.get('public'), fileName + ".html"))
    }
    next()
})

app.use(express.static('public'))


app.get('/',(req,res) => res.render('index'))

app.get('/login',(req,res) => res.render('login'))
app.get('/register',(req,res) => res.render('register'))
app.get('/upload',(req,res) => res.render('upload'))



app.listen(PORT, () => console.log('frontend http://' + IP + ':' + PORT))
