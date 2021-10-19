const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqsch.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const appointmentsCollection = client
    .db("doctorsMangement")
    .collection("pendingAppoinments");
  const doctorsCollection = client.db("doctorsMangement").collection("doctors");
  const patientCollection = client
    .db("doctorsMangement")
    .collection("patients");
  const adminCollection = client.db("doctorsMangement").collection("admins");
  const AmbulanceCollection = client
    .db("doctorsMangement")
    .collection("Ambulances");
  const bloodDonarCollection = client
    .db("doctorsMangement")
    .collection("bloodDonar");
  const categoryCollection = client
    .db("doctorsMangement")
    .collection("category");

  app.post("/appointments", (req, res) => {
    appointmentsCollection.insertOne(req.body).then((result) => {
      res.send(result.acknowledged);
      // console.log(result.acknowledged);
    });
  });

  app.get("/allAppointments/:id", (req, res) => {
    appointmentsCollection
      .find({ status: req.params.id })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.get("/myAppointments/:id/:email", (req, res) => {
    // console.log(req.params.id);
    // console.log(req.params.email);
    appointmentsCollection
      .find({ status: req.params.id, doctorEmail: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents);
      });
  });
  app.get("/allDoctors", (req, res) => {
    doctorsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/allCategory", (req, res) => {
    categoryCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/allCustomers", (req, res) => {
    patientCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/customerAppointments/:id", (req, res) => {
    appointmentsCollection
      .find({ email: req.params.id })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/customerPendingAppointments/:status/:id", (req, res) => {
    appointmentsCollection
      .find({ email: req.params.id, status: req.params.status })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/patientRegister", (req, res) => {
    patientCollection.insertOne(req.body).then((document) => {
      res.send(document.acknowledged);
    });
  });
  app.post("/bloodDonarInfo", (req, res) => {
    bloodDonarCollection.insertOne(req.body).then((document) => {
      res.send(document.acknowledged);
    });
  });
  app.post("/AmbulanceRegister", (req, res) => {
    AmbulanceCollection.insertOne(req.body).then((document) => {
      res.send(document.acknowledged);
    });
  });
  app.post("/setCategory", (req, res) => {
    // console.log(req.body);
    categoryCollection.insertOne(req.body).then((document) => {
      res.send(document.acknowledged);
      // console.log(document.acknowledged);
    });
  });

  app.post("/makeAdmin", (req, res) => {
    adminCollection.insertOne(req.body).then((document) => {
      res.send(document.acknowledged);
    });
  });

  app.post("/patientLogin", (req, res) => {
    patientCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        if (documents.length > 0) {
          // console.log("email is valid");
          patientCollection
            .find({ password: req.body.password })
            .toArray((error, results) => {
              if (results.length > 0) {
                res.send(true);
              } else {
                res.send(false);
              }
            });
        } else {
          res.send(false);
        }
      });
  });
  app.post("/adminLogin", (req, res) => {
    adminCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        if (documents.length > 0) {
          // console.log("email is valid");
          adminCollection
            .find({ password: req.body.password })
            .toArray((error, results) => {
              if (results.length > 0) {
                res.send(true);
              } else {
                res.send(false);
              }
            });
        } else {
          res.send(false);
        }
      });
  });
  app.post("/doctorLogin", (req, res) => {
    doctorsCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        if (documents.length > 0) {
          // console.log("email is valid");
          doctorsCollection
            .find({ password: req.body.password })
            .toArray((error, results) => {
              if (results.length > 0) {
                res.send(true);
              } else {
                res.send(false);
              }
            });
        } else {
          res.send(false);
        }
      });
  });

  app.post("/addDoctors", (req, res) => {
    doctorsCollection.insertOne(req.body).then((result) => {
      // console.log(result.acknowledged);
      res.send(result.acknowledged);
    });
  });
  app.patch("/updateStatus/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.body);

    appointmentsCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            status: req.body.optionValue,
            meetLink: req.body.meetLink,
          },
        }
      )
      .then((result) => {
        console.log(result.modifiedCount > 0);
        res.send(result.modifiedCount > 0);
      });
  });
  app.patch("/updateDoctorStatus/:email", (req, res) => {
    doctorsCollection
      .updateOne(
        { email: req.params.email },
        {
          $set: {
            status: req.body.status,
          },
        }
      )
      .then((result) => {
        // console.log(result.modifiedCount > 0);
        res.send(result.modifiedCount > 0);
      });
  });

  app.get("/activeDoctors/:category/:issue", (req, res) => {
    // console.log(req.params.category);
    // console.log(req.params.issue);
    doctorsCollection
      .find({
        Expertise: req.params.category,
        activity: req.params.issue,
      })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/isUserAdmin/:email", (req, res) => {
    patientCollection
      .find({ email: req.params.email })
      .toArray((error, result) => {
        if (result.length > 0) {
          res.send(result[0]);
        } else {
          doctorsCollection
            .find({ email: req.params.email })
            .toArray((err, document) => {
              if (document.length > 0) {
                // console.log("akjon doctor");
                res.send(document[0]);
              } else {
                adminCollection
                  .find({ email: req.params.email })
                  .toArray((errors, documents) => {
                    if (documents.length > 0) {
                      res.send(documents[0]);
                      // console.log("admin");
                    } else {
                      // console.log(false);
                    }
                  });
              }
            });
          // console.log("eita customer na ");
        }
      });
  });

  app.delete("/deletePendingAppointments/:id", (req, res) => {
    appointmentsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.acknowledged);
        // console.log(result);
      });
    console.log(req.params.id);
  });
  app.delete("/deleteDoctor/:id", (req, res) => {
    doctorsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.acknowledged);
        // console.log(result);
      });
    // console.log(req.params.id);
  });
  app.delete("/deletePatient/:id", (req, res) => {
    patientCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.acknowledged);
        // console.log(result);
      });
    // console.log(req.params.id);
  });
});

app.listen(process.env.PORT || port);
