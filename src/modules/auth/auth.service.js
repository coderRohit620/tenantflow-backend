import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";


const registerService = async ({ companyName, email, password }) => {

    // ✅ 1. Validate input
    if (!companyName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    // check if user exists
    // console.log("EMAIL:", email);
    const existingUser = await prisma.user.findUnique({
        where: {email:email},
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    // hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);//

    const hashedPassword = await bcrypt.hash(password, 10);//bcrypt generates salt automatically
    

    // create tenant + admin
    const tenant = await prisma.tenant.create({
        data: {
            name: companyName,
            users: {
                create: {
                    email,
                    password: hashedPassword,
                    role: "ADMIN",
                },
            },
        },
        include: {
            users: true,
        },
    });

    const user = tenant.users[0];

     // ✅ 5. Check JWT secret
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    // generate JWT
    const token = jwt.sign(
        {
            userId: user.id,
            tenantId: tenant.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

    return { user, token };
};

export { registerService };
