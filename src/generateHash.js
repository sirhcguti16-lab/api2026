import bcrypt from 'bcryptjs';

// Cambia "Admin123." por la contraseña que quieras usar
const password = "Admin123.";

async function hashPassword() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hash generado:', hashedPassword);
}

hashPassword();
