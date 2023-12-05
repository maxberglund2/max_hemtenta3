const pathToModules = "./other-backend/node_modules/"

// get access to packages
const { PrismaClient } = require( pathToModules + '@prisma/client')
const express = require(pathToModules + 'express');
const multer = require(pathToModules + 'multer');
const session = require(pathToModules + 'express-session');

const prisma = new PrismaClient()
const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

async function main() {

}

// connect to prisma DB
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


// Activate Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }));

// a function checks if you are Authenticated, if not it will send you to sign in page
const isAuthenticated = (req, res, next) => {
    if (req.session.user) next()
    else res.redirect('/signIn')
}

// When user tries to sign up
app.post('/signUp', async (req, res) => {
    const formData = req.body;

    try {
        // creates new user into DB with prisma
        const newUser = await prisma.user.create({
            data: {
            userName: formData['usernameInput'],
            password: formData['passwordInput'],
            role: formData['roleInput']
            },
        });

        // if the user is created (not undefined) this tell session that user is authenticated
        if(newUser != undefined) {
            req.session.regenerate(function (err) {
                if (err) next(err)
            
                req.session.user = newUser;
            
                req.session.save(function (err) {
                if (err) return next(err);
                res.redirect('/');
            })
        })
      }
    } catch (error) {
      console.error('Error (skapa):', error);
      res.status(500).send('Error (skapa)');
    }
});

// when user tries to sign in
app.post('/signIn', async(req, res) => {
    const formData = req.body;

    try {
        // compares entered username in the input with all users
        const user = await prisma.user.findUnique({
            where: {
                userName: formData['usernameInput']
            }
        })
        // if the user was found and the password input is the same as users password
        if (user && user.password === formData['passwordInput']) {
            // tells session that user is authenticated
            req.session.regenerate(function (err) {
                if (err) next(err)
            
                req.session.user = user;
            
                req.session.save(function (err) {
                  if (err) return next(err)
                  res.redirect('/');
                })
            })
        }
    }
    catch (error) {
        console.error('Error (search):', error);
        res.status(500).send('Error (search)');
    }
});

// sends a response to a js that tells if the currents user is admin or not
app.get('/isAdmin', async (req,res)=>{
    res.json(req.session.user.role);
});

// sends data of post table to js file
app.get('/postViewer', async (req,res)=>{
    const viewPost = await prisma.post.findMany();
    res.json(viewPost);
});

// when admin creates "post"
app.post('/createPost', upload.single('image'), async (req, res) => {
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

// routing
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
    // looks if current user is admin, if not sends you back to home page
    req.session.user.role === 'Admin' ? res.sendFile(__dirname + '/html/admin.html'): res.redirect('/');
});

// when sign out button is pressed
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

// server's port connection
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});