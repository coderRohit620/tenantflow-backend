import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";


const registerService = async ({ companyName, email, password }) => {
    // check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
