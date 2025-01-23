import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {User} from '../src/models/User.js';
import {Vehicle} from '../src/models/Vehicle.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Conectado a MongoDB");

    // Crear usuarios de prueba
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
      { email: "admin@example.com", password: hashedPassword },
      { email: "user1@example.com", password: hashedPassword },
      { email: "user2@example.com", password: hashedPassword },
    ]);

    // Crear vehículos de prueba
    await Vehicle.insertMany([
      { brand: "Toyota", model: "Corolla", year: 2020, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Honda", model: "Civic", year: 2019, status: "en_mantenimiento", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Ford", model: "Focus", year: 2021, status: "en_servicio", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Chevrolet", model: "Malibu", year: 2018, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Nissan", model: "Altima", year: 2022, status: "en_mantenimiento", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Hyundai", model: "Elantra", year: 2020, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Kia", model: "Soul", year: 2019, status: "en_servicio", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Mazda", model: "3", year: 2021, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Subaru", model: "Impreza", year: 2018, status: "en_mantenimiento", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Volkswagen", model: "Jetta", year: 2022, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "BMW", model: "3 Series", year: 2020, status: "en_servicio", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Mercedes-Benz", model: "C-Class", year: 2019, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Audi", model: "A4", year: 2021, status: "en_mantenimiento", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Lexus", model: "IS", year: 2018, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Acura", model: "TLX", year: 2022, status: "en_servicio", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Infiniti", model: "Q50", year: 2020, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Tesla", model: "Model 3", year: 2019, status: "en_mantenimiento", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Volvo", model: "S60", year: 2021, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Jaguar", model: "XE", year: 2018, status: "en_servicio", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Alfa Romeo", model: "Giulia", year: 2022, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
      { brand: "Jeep", model: "Cherokee", year: 2020, status: "disponible", createdBy: users[0]._id, updatedBy: users[0]._id },
    ]);

    console.log("Seed generado correctamente");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });