var express = require('express');
var router = express.Router();
const Auth = require('../models/authModel')
const User = require('../models/userModel')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index',{ errors: [],message:null })
  const username = req.session.username || loggedInUsername;
  if(!username){
    return res.redirect('/');
  }
});
router.get('/dashboard', (req, res) => {
  res.render('dashboard',{ errors: [],message:null })
});
router.post('/', function (req, res) {
      const { username, password } = req.body;
      
      let foundUser; // Declare foundUser here
 
      Auth.findOne({ username })
      .then(user => {
        if (!user) {
          return res.render('index', { message: 'Incorrect Email Address.',errors: [] });
        }
        if(password != user.password){
          return res.render('index', { message: 'Incorrect password.',errors: [] });
        }
        req.session.userId = user._id;
        req.session.username = user.username;
       

       
        
        res.redirect('/dashboard');
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  });

// var us = user.username;
router.get('/createemployee', (req,res)=>{
    res.render('CreateEmployee', {error: null})
});



const multer = require('multer');
const user = require('../models/userModel');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})
router.post('/createemployee',upload.single('f_image'), (req, res) => {
  const { f_name, f_email, f_Mobile,f_Designation,f_gender,f_course,f_createdate } = req.body;
  console.log(req.body)
  let f_image='';
  if(req.file){
 f_image = req.file.path;
  }
 console.log(req.file
 )


 const employee = new User({
   f_name,
   f_email,
   f_Mobile,
   f_Designation,
   f_gender,
   f_course,
   f_createdate:new Date(),
   f_image
  });
  const validationError = employee.validateSync();
  if (validationError) {
      res.render('CreateEmployee', { error: validationError.errors});
  } else {
      employee.save().then(() => {
              res.redirect('/employelist');
          }).catch((error) => {
              console.error(error);
             
          });
 }
})
// list 
router.get('/employelist', (req, res) => {
  if(!req.session.userId){
    res.redirect('/employelist');
    return;
  }
  User.find().then(data => {
    res.render('list',{
      data:data, 
      name:req.session.username
    })

  }).catch(error => {

    console.error(error);
    
  });

});

//update
router.get('/edit/:id',(req , res) =>{
  const edit = req.params.id;
 User.findById(edit).lean().then(user_name =>{
      res.render('Edit',{employee:user_name,error: null
})
  }).catch(error => {
      console.error(error);
    });
})
//
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// const upload= multer({storage: storage})




router.post('/edit/:id', (req, res) => {
  const editId = req.params.id;
  console.log(editId)
  const { f_name,f_email, f_Mobile,f_Designation,f_gender,f_course,f_createdate,f_image } = req.body;
  console.log(req.body)
  // f_image ='';
  // f_name= req.body.f_name;
  const updatedFields = { f_name,f_email, f_Mobile, f_Designation, f_gender, f_course,f_createdate,f_image}
 
  User.findByIdAndUpdate(
    editId,
    updatedFields,
    {new: true}
  )
    .then(() => {
      res.redirect('/employelist'); // Redirect to the product list after updating
    })
    .catch(error => {
      console.error(error);
    });
})
//delete
// GET route to confirm delete action
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id).lean()
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      // Render a confirmation page before deletion
      res.render('delete', { employee: user });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Server error');
    });
});

// DELETE route to actually delete the employee
// router.delete('/delete/:id', (req, res) => {
//   const { id } = req.params;
//   User.findByIdAndDelete(id)
//     .then(() => {
//       // Redirect to the employee list page after deletion
//       res.redirect('/list');
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).send('Server error');
//     });
// });
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Debugging: Log the ID being processed
  console.log(`Deleting user with ID: ${id}`);

  User.findByIdAndDelete(id)
    .then(() => {
      console.log(`User with ID: ${id} deleted successfully`);
      res.redirect('/employelist'); // Redirect after successful deletion
    })
    .catch(error => {
      console.error(`Error deleting user with ID: ${id}`, error);
      res.status(500).send('Server error');
    });
});



//Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }

    res.redirect('/'); // Redirect to login page after logging out
  });
});


module.exports = router;
