const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});


router.post('/add', isLoggedIn, async (req, res,done) => {



    const { tipo_act, actividad, num_promotores, fecha_act, Hentrada, Hsalida, coord, url, descripcion, coach, apoyo, especiales, coord2 } = req.body;

    
        const newPlan = {
            tipo_act,
            actividad,
            num_promotores,
            fecha_act,
            Hentrada,
            Hsalida,
            coord,
            url,
            descripcion,
            coach,
            especiales,
            apoyo,
            coord2,
            user_id: req.user.id
        };

    await pool.query('INSERT INTO Planes set ?', [newPlan]);
    res.redirect('/links');   //res.send('received');
    
});

router.get('/', isLoggedIn, async (req, res) => {

    const links = await pool.query('SELECT * FROM Planes WHERE user_id=?', [req.user.id]);
    res.render('links/list', { links });
});

module.exports = router;