const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const shortid = require('shortid');
const fs = require('fs/promises');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const dbl = './data.json';
const doctor_base = './doctor.json';
const patient_base = './patient.json';

app.get('/doctors',async (req,res)=>{
  const data = await fs.readFile(doctor_base);
  const doctors = JSON.parse(data);
  res.status(201).json(doctors);
})

app.post('/doctor',async(req,res)=>{

  const doctor={
      ...req.body,
      id:shortid.generate(),
  };
  const data = await fs.readFile(doctor_base);
  const doctors =JSON.parse(data);
  doctors.push(doctor);
  await fs.writeFile(doctor_base,JSON.stringify(doctors));
  res.status(201).json(doctors);
})
app.get('/doctor/:ID',async (req,res)=>{

  const id = req.params.ID;
  const data = await fs.readFile(doctor_base);
  const doctors = JSON.parse(data);
  const doctor = doctors.find(item=> item.ID===id);

  if(!doctor){
     res.status(404).json({massage:'doctor not found'});
  }
 else 
  res.status(200).json(doctor);
})
app.get('/doctorapp/:ID',async (req,res)=>{

  const id = req.params.ID;
  const data = await fs.readFile(patient_base);
  const doctors = JSON.parse(data);
  let doctor =[];
   doctors.map(item=> {if(item.doctorid===id)doctor.push(item)});

  if(!doctor){
     res.status(404).json({massage:'doctor not found'});
  }
 else 
  res.status(200).json(doctor);
})
app.get('/patient/:id',async (req,res)=>{

  const id = req.params.id;
  const data = await fs.readFile(patient_base);
  const patients = JSON.parse(data);
  const patient = patients.find(item=> item.ID===id);

  if(!patient){
     res.status(404).json({massage:'Player not found'});
  }
 else 
  res.status(200).json(patient);
})

app.delete('/:id',async (req,res)=>{

  const id = req.params.id;
  const data = await fs.readFile(dbl);
  const players = JSON.parse(data);
  let player = players.find((item) => item.id===id);

  if(!player){
     
  }
 
  const player2 =  players.find((item) => item.id!==id);
  await fs.writeFile(dbl, JSON.stringify(player2));
  res.status(200).json(player2);

 
})

app.patch('/:id',async (req,res)=>{

  const id = req.params.id;
  const data = await fs.readFile(dbl);
  const players = JSON.parse(data);
  const player = players.find(item=> item.id===id);

  if(!player){
     res.status(404).json({massage:'Player not found'});
  }
 else {
  player.name= req.body.name || player.name;

  await fs.writeFile(dbl, JSON.stringify(players));
  res.status(200).json(players);

 }

})
app.post('/id',async(req,res)=>{

    const id={
        ...req.body,
        idd:shortid.generate(),
    };
    const data = await fs.readFile('./data.json');
    let ids =JSON.parse(data);
    ids = id;
    await fs.writeFile('./data.json',JSON.stringify(ids));
    res.status(201).json(ids);
})

app.get('/id',async (req,res)=>{
  const data = await fs.readFile(dbl);
  const id = JSON.parse(data);
  res.status(201).json(id);
})



app.get('/appointment/:doctorname',async (req,res)=>{
  const data = await fs.readFile(dbl);
  const players = JSON.parse(data);
  res.status(201).json(players);
})

app.get('/health',(_req,res)=> {
    res.status(200).json({status:'ok'});
})

const port= process.env.PORt || 4000;

app.listen(port, ()=> {

    console.log(`Server is listenning on port ${port}`);
    console.log(`localhost:${port}`);
});

