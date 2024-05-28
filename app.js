// app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (email, parola, done) => {
        try {
            const [rows] = await db.query('SELECT * FROM Utilizatori WHERE Email = ?', [email]);
            const user = rows[0];
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (parola === user.Parola) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.Tip_Utilizator);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM Utilizatori WHERE Tip_Utilizator = ?', [id]);
        const user = rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    })
);

app.get('/dashboard', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const [setari] = await db.query('SELECT * FROM setari');
    
    res.render('user', { user: req.user, setari: setari });
});

app.post('/change-settings/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const setareid = req.params.id;
    const [setare] = await db.query('SELECT * FROM setari');
    
    var newStatus = 0;

    switch (setareid) {
        case 'Setare_stare_usa':
            newStatus = (setare[0].Setare_stare_usa === 1 ? 0 : 1);
            break;
        case 'Setare_bec_1':
            newStatus = (setare[0].Setare_bec_1 === 1 ? 0 : 1);
            break;
        case 'Setare_bec_2':
            newStatus = (setare[0].Setare_bec_2 === 1 ? 0 : 1);
            break;
        case 'Setare_bec_3':
            newStatus = (setare[0].Setare_bec_3 === 1 ? 0 : 1);
            break;
        case 'Setare_bec_4':
            newStatus = (setare[0].Setare_bec_4 === 1 ? 0 : 1);
            break;
        case 'Setare_temperatura':
            newStatus = req.body.temperature;
            break;
    }

    await db.query('UPDATE setari SET ' + setareid + ' = ?', [newStatus]);
    res.redirect('/dashboard');
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
