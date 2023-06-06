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
const Doctor_User = './doctor_user.json';
const Patient_User = './patient_user.json';
const Appoint_base = './appointments.json';

app.get('/doctorsidlist',async (req,res)=>{
  const data = await fs.readFile(doctor_base);
  const doctors = JSON.parse(data);
  let list=[];
  doctors.forEach((e)=>list.push({Name : e.docName , ID: e.ID}));
  let format="";
 list.map((x)=>{format += "Name : "+ x.Name + " - ID : " + x.ID+ "\n"});
res.status(201).json(format);

})

app.get('/doctorstimea/:ID',async (req,res)=>{
  const id = req.params.ID;
  const data = await fs.readFile(Appoint_base);
  const doctors = JSON.parse(data);
  let timing =[];
  doctors.forEach((x)=>{if(x.docID==id)timing.push({...x})});
  const data2 = await fs.readFile(doctor_base);
  const doctors2 = JSON.parse(data2);
  let timing2 ="";
  doctors2.forEach((x)=>{if(x.ID==id)timing2=x.Slots});
  if(timing=="")res.status(201).json(timing2);
  else {
  let px =[];
   timing2.forEach((y)=> { 
    let py=[];
    y.time.forEach((x)=>{timing.map((z)=>(x==z.time && y.day ==z.day)?null:py.push(" "+x))});

px.push({day: y.day, time : py});
});
let format="";
 px.map((x)=>{format += x.day + " : " + x.time+ "\n"});
res.status(201).json(format);
}})

app.post('/doctorstimejson/:ID',async (req,res)=>{
  const id = req.params.ID;
  const data = await fs.readFile(Appoint_base);
  const doctors = JSON.parse(data);
  let timing =[];
  doctors.forEach((x)=>{if(x.docID==id)timing.push({...x})});
  const data2 = await fs.readFile(doctor_base);
  const doctors2 = JSON.parse(data2);
  let timing2 ="";
  doctors2.forEach((x)=>{if(x.ID==id)timing2=x.Slots});
  if(timing=="")res.status(201).json(true);
  else {
  let px =[];
   timing2.forEach((y)=> { 
    let py=[];
    y.time.forEach((x)=>{timing.map((z)=>(x==z.time && y.day ==z.day)?null:py.push(x))});

px.push({day: y.day, time : py});});

const temp ={
  ...req.body
}
let pp2=false;
let pp=false;
px.map((y)=>{y.time.map((x)=>{(x==temp.time && y.day==temp.day)?pp2=true:pp=false;

})});
res.status(201).json(pp2);
}

})


app.get('/doctorstime/:ID',async (req,res)=>{
  const id = req.params.ID;
  const data = await fs.readFile(Appoint_base);
  const doctors = JSON.parse(data);
  let timing =[];
  doctors.forEach((x)=>{if(x.docID==id)timing.push({day:x.day, time:x.time})});
  //const doctors = JSON.parse(data);
  res.status(201).json(timing);
})
app.get('/doctorslot/:ID',async (req,res)=>{
  const id = req.params.ID;
  const data = await fs.readFile(doctor_base);
  const doctors = JSON.parse(data);
  let timing ="";
  doctors.forEach((x)=>{if(x.ID==id)timing=x.Slots});
  //const doctors = JSON.parse(data);
  res.status(201).json(timing);
})
app.get('./Doctor_User2/:ID',async (req,res)=>{

  const id = req.params.ID;
  const data = await fs.readFile(Doctor_User);
  const doctors = JSON.parse(data);
  const doctor = doctors.find(item=> item.ID===id);

  if(!doctor){
     res.status(404).json({massage:'doctor not found'});
  }
 else 
  res.status(200).json(doctor);
})

app.get('./Doctor_User/:ID',async (req,res)=>{

  const id = req.params.ID;
  const data = await fs.readFile(Doctor_User);
  const doctors = JSON.parse(data);
  const doctor = doctors.find(item=> item.ID===id);

  if(!doctor){
     res.status(404).json({massage:'doctor not found'});
  }
 else 
  res.status(200).json(doctor);
})
    

app.get('/doctors',async (req,res)=>{
  const data = await fs.readFile(Doctor_User);
  const doctors = JSON.parse(data);
  res.status(201).json(doctors);
})

app.get('/patients',async (req,res)=>{
  const data = await fs.readFile(patient_base);
  const doctors = JSON.parse(data);
  res.status(201).json(doctors);
})
app.post('/patientapp/:ID',async(req,res)=>{
  const id = req.params.ID;
  const temp={
    ID : id,
      ...req.body,
  };
  const data = await fs.readFile(Appoint_base);
  const doctors =JSON.parse(data);
  doctors.push(temp);
  await fs.writeFile(Appoint_base,JSON.stringify(doctors));
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

app.post('/doctor_user',async(req,res)=>{

  const itemx={
      ...req.body,
  };
  const data = await fs.readFile(doctor_base);
  const data2 = await fs.readFile(Doctor_User);
  const doctors =JSON.parse(data);
  const doctors2 =JSON.parse(data2);
  const doctor1 = doctors.find(item=> item.ID===itemx.ID);
  const doctor2 = doctors2.find(item=> item.ID===itemx.ID);


  if(!doctor2 || (doctor2.password != itemx.password)){
    res.status(404).json({massage:'not found'});
  }
  else{
    res.status(201).json({message:"Successful", user : {...doctor1},
    token : "dfdghgfh"
  });
    }
})

app.post('/patient_user',async(req,res)=>{

  const itemx={
      ...req.body,
  };
  const data = await fs.readFile(patient_base);
  const data2 = await fs.readFile(Patient_User);
  const doctors =JSON.parse(data);
  const doctors2 =JSON.parse(data2);
  const doctor2 = doctors.find(item=> item.ID===itemx.ID);
  const doctor = doctors2.find(item=> item.ID===itemx.ID);



  if(!doctor || (doctor.password != itemx.password)){
    res.status(404).json({massage:'not found'});
  }
  else{
  res.status(201).json({message:"Successful", user : {...doctor2},
  token : "dfdghgfh"
});
  }
})


app.post('/patient',async(req,res)=>{

  const patient={
      ...req.body,
  };
  const data = await fs.readFile(patient_base);
  const patients =JSON.parse(data);
  patients.push(patient);
  await fs.writeFile(patient_base,JSON.stringify(patients));
  res.status(201).json(patient);
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
  const data = await fs.readFile(Appoint_base);
  const data2 = await fs.readFile(patient_base);
  const doctors = JSON.parse(data);
  const doctors2 = JSON.parse(data2);
  let patient =[];
   doctors.forEach((item)=> (item.docID==id)?patient.push(item.ID):null);   
   let patients =[];
   doctors2.forEach((item)=> patient.forEach((item2)=>item.ID==item2? patients.push(item):null));

  res.status(200).json(patients);
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

app.delete('/appdel/:id',async (req,res)=>{

  const id = req.params.id;
  const data = await fs.readFile(Appoint_base);
  const players = JSON.parse(data);
  let player = players.find((item) => item.id===id);

  if(!player){
     
  }
 
  players.pop(player)
  await fs.writeFile(Appoint_base, JSON.stringify(players));
  res.status(200).json(players);

 
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

