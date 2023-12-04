const pathToModules = "./other-backend/node_modules/"

const { PrismaClient } = require( pathToModules + '@prisma/client')
const express = require(pathToModules + 'express');
const multer = require(pathToModules + 'multer');
const session = require(pathToModules + 'express-session');

const url = require('url');

const prisma = new PrismaClient()
const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

async function main() {

}

main()
  .then(async () => {
    await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})

app.use(express.static(__dirname));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else res.redirect('/signIn')
}

app.post('/signUp', express.urlencoded({ extended: false }), async (req, res) => {
    console.log(req.body);
    const formData = req.body;

    try {
        const newUser = await prisma.user.create({
            data: {
            userName: formData['usernameInput'],
            password: formData['passwordInput'],
            role: formData['roleInput']
            },
        });
        if(newUser != undefined) {
            console.log('User authenticated');
            req.session.regenerate(function (err) {
                if (err) next(err)
            
                req.session.user = newUser;
            
                req.session.save(function (err) {
                if (err) return next(err)
                console.log('Session saved'); 
                res.redirect('/')
            })
        })
      }
    } catch (error) {
      console.error('Error (skapa):', error);
      res.status(500).send('Error (skapa)');
    }
});
app.post('/signIn', express.urlencoded({ extended: false }), async(req, res) => {
    const formData = req.body;
    console.log(formData)

    try {
        const user = await prisma.user.findUnique({
            where: {
                userName: formData['usernameInput']
            }
        })
        if (user && user.password === formData['passwordInput']) {
            console.log('User authenticated');
            req.session.regenerate(function (err) {
                if (err) next(err)
            
                req.session.user = user;
            
                req.session.save(function (err) {
                  if (err) return next(err)
                  console.log('Session saved'); 
                  res.redirect('/')
                })
            })
        }
    }
    catch (error) {
        console.error('Error (search):', error);
        res.status(500).send('Error (search)');
    }
});

app.get('/postViewer', async (req,res)=>{
    const viewPost = await prisma.user.findMany();
    res.json(viewPost);
});

app.post('/createPost', upload.single('image'), express.urlencoded({ extended: false }), async (req, res) => {
    console.log(req.body);
    const formData = req.body;
    try {
        const newPost = await prisma.post.create({
            data: {
            title: formData['titleInput'],
            content: formData['descriptionInput'],
            image: req.file ? req.file.filename : '',
            authorId: req.session.user.id
        },
        });
        res.redirect('/')
    } catch (error) {
      console.error('Error 500:', error);
      res.status(500).send('Error (skapa)');
    }
});

app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});
app.get('/signIn', (req, res) => {
    res.sendFile(__dirname + '/html/signIn.html');
});
app.get('/signUp', (req, res) => {
    res.sendFile(__dirname + '/html/signUp.html');
});
app.get('/admin', (req, res) => {
    req.session.user.role === 'Admin' ? res.sendFile(__dirname + '/html/admin.html'): res.redirect('/');
});

app.get('/signOut', (req, res) => {
    req.session.user = null
    req.session.save(function (err) {
      if (err) next(err)
      req.session.regenerate(function (err) {
        if (err) next(err)
        res.redirect('/')
      })
    })
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});