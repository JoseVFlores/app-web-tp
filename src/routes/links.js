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

    const linksp = await pool.query('SELECT * FROM (SELECT * FROM Planes A LEFT JOIN coaches B ON A.user_id=B.id_coaches) AS CRUCE WHERE user_id=? OR user_id IN (SELECT id_coaches FROM coaches WHERE id_lider=?)', [req.user.id,req.user.id]);
    //const links = await pool.query('SELECT * FROM Planes WHERE user_id=? OR user_id IN (SELECT id FROM coaches WHERE id_lider=?)', [req.user.id,req.user.id]);
    if(req.user.eslider==1){
    res.render('links/list', { linksp });
    }
    else{res.render('links/list2', { linksp });}
          
});



router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
   
    const links = await pool.query('SELECT * FROM Planes WHERE id = ?', [id]);
    //console.log(links);
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

router.get('/add2/:id', async (req, res) => {
    const { id } = req.params;
    const planes = await pool.query('SELECT * FROM planes WHERE id = ?', [id]);
    res.render('links/add2', {plan: planes[0]});
    console.log(planes[0])
});

router.post('/add2/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo_act, actividad, num_promotores, fecha_act, Hentrada, Hsalida, coord, url, descripcion, coach, apoyo, especiales, coord2 } = req.body; 
    const newLink = {
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
        coord2
    };
    await pool.query('UPDATE Planes set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Actividad actualizada exitosamente');
    res.redirect('/links');
});


router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('UPDATE Planes set estatus_plan=true WHERE id = ?', [id]);
    req.flash('success', 'Actividad aprobada');
    res.redirect('/links');
});




module.exports = router;