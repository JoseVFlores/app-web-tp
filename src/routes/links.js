const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const moment = require ('moment');

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



router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM Planes WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
    
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { actividad, coach, fecha_act, incidencia} = req.body; 
    const newincidencia = {
        incidencia
    };
    await pool.query('UPDATE Planes set ? WHERE id = ?', [newincidencia, id]);
    req.flash('success', 'Incidencia Registrada');
    res.redirect('/links');
});



module.exports = router;